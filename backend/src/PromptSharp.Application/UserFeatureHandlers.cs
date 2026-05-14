using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class UserFeatureHandlers(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IBootstrapAdminProvider bootstrapAdminProvider,
    TimeProvider timeProvider) :
    IRequestHandler<EnsureUserExistsCommand, UserDto>,
    IRequestHandler<GetMeQuery, UserDto>,
    IRequestHandler<GetBookmarksQuery, IReadOnlyList<BookmarkDto>>,
    IRequestHandler<AddBookmarkCommand>,
    IRequestHandler<DeleteBookmarkCommand>,
    IRequestHandler<GetProgressQuery, TutorialProgressDto>,
    IRequestHandler<PutProgressCommand, TutorialProgressDto>
{
    public async Task<UserDto> Handle(EnsureUserExistsCommand request, CancellationToken cancellationToken)
    {
        var now = timeProvider.GetUtcNow();
        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleOrDefaultAsync(entity => entity.Sub == request.Sub, cancellationToken);

        if (user is null)
        {
            user = User.Create(request.Sub, request.Email, request.DisplayName, request.AvatarUrl, now);
            dbContext.Users.Add(user);
        }
        else
        {
            user.UpdateProfile(request.Email, request.DisplayName, request.AvatarUrl, now);
        }

        var roles = await ResolveInitialRoleIds(request.Email, cancellationToken);
        if (user.UserRoles.Count == 0)
        {
            user.ReplaceRoles(roles);
        }

        return TutorialMapper.ToUserDto(user);
    }

    public async Task<UserDto> Handle(GetMeQuery request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        return TutorialMapper.ToUserDto(user);
    }

    public async Task<IReadOnlyList<BookmarkDto>> Handle(GetBookmarksQuery request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        var bookmarks = await dbContext.Bookmarks
            .AsNoTracking()
            .Where(bookmark => bookmark.UserId == user.Id)
            .Include(bookmark => bookmark.Tutorial)
            .ThenInclude(tutorial => tutorial!.Category)
            .Include(bookmark => bookmark.Tutorial)
            .ThenInclude(tutorial => tutorial!.TutorialTags)
            .ThenInclude(tutorialTag => tutorialTag.Tag)
            .Include(bookmark => bookmark.Tutorial)
            .ThenInclude(tutorial => tutorial!.Steps)
            .OrderByDescending(bookmark => bookmark.CreatedAt)
            .ToListAsync(cancellationToken);

        return bookmarks
            .Where(bookmark => bookmark.Tutorial is not null)
            .Select(bookmark => new BookmarkDto(TutorialMapper.ToListItem(bookmark.Tutorial!), bookmark.CreatedAt))
            .ToArray();
    }

    public async Task Handle(AddBookmarkCommand request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        var tutorialExists = await dbContext.Tutorials.AnyAsync(
            tutorial => tutorial.Id == request.TutorialId && tutorial.IsPublished,
            cancellationToken);

        if (!tutorialExists)
        {
            throw new NotFoundException($"Tutorial '{request.TutorialId}' was not found.");
        }

        var exists = await dbContext.Bookmarks.AnyAsync(
            bookmark => bookmark.UserId == user.Id && bookmark.TutorialId == request.TutorialId,
            cancellationToken);

        if (!exists)
        {
            dbContext.Bookmarks.Add(new Bookmark(user.Id, request.TutorialId, timeProvider.GetUtcNow()));
        }
    }

    public async Task Handle(DeleteBookmarkCommand request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        var bookmark = await dbContext.Bookmarks.SingleOrDefaultAsync(
            entity => entity.UserId == user.Id && entity.TutorialId == request.TutorialId,
            cancellationToken);

        if (bookmark is not null)
        {
            dbContext.Bookmarks.Remove(bookmark);
        }
    }

    public async Task<TutorialProgressDto> Handle(GetProgressQuery request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        var progress = await dbContext.TutorialProgress.AsNoTracking().SingleOrDefaultAsync(
            entity => entity.UserId == user.Id && entity.TutorialId == request.TutorialId,
            cancellationToken);

        return progress is null
            ? new TutorialProgressDto(user.Id, request.TutorialId, null, [], timeProvider.GetUtcNow())
            : TutorialMapper.ToProgressDto(progress);
    }

    public async Task<TutorialProgressDto> Handle(PutProgressCommand request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        var tutorial = await dbContext.Tutorials
            .Include(entity => entity.Steps)
            .SingleOrDefaultAsync(entity => entity.Id == request.TutorialId && entity.IsPublished, cancellationToken);

        if (tutorial is null)
        {
            throw new NotFoundException($"Tutorial '{request.TutorialId}' was not found.");
        }

        var validStepIds = tutorial.Steps.Select(step => step.Id).ToHashSet();
        if (request.Input.CurrentStepId is not null && !validStepIds.Contains(request.Input.CurrentStepId.Value))
        {
            throw new ValidationException("Current step must belong to the tutorial.");
        }

        if (request.Input.CompletedStepIds.Any(stepId => !validStepIds.Contains(stepId)))
        {
            throw new ValidationException("Completed steps must belong to the tutorial.");
        }

        var now = timeProvider.GetUtcNow();
        var progress = await dbContext.TutorialProgress.SingleOrDefaultAsync(
            entity => entity.UserId == user.Id && entity.TutorialId == request.TutorialId,
            cancellationToken);

        if (progress is null)
        {
            progress = new TutorialProgress(user.Id, request.TutorialId, request.Input.CurrentStepId, request.Input.CompletedStepIds, now);
            dbContext.TutorialProgress.Add(progress);
        }
        else
        {
            progress.Update(request.Input.CurrentStepId, request.Input.CompletedStepIds, now);
        }

        return TutorialMapper.ToProgressDto(progress);
    }

    private async Task<User> RequireCurrentUser(CancellationToken cancellationToken)
    {
        if (!currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(currentUser.Subject))
        {
            throw new ForbiddenException("Authentication is required.");
        }

        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleOrDefaultAsync(entity => entity.Sub == currentUser.Subject, cancellationToken);

        return user ?? throw new NotFoundException("Current user has not been provisioned.");
    }

    private async Task<IReadOnlyCollection<Guid>> ResolveInitialRoleIds(string email, CancellationToken cancellationToken)
    {
        var normalizedBootstrapEmail = bootstrapAdminProvider.BootstrapAdminEmail?.Trim();
        var roleNames = string.Equals(email.Trim(), normalizedBootstrapEmail, StringComparison.OrdinalIgnoreCase)
            ? RoleNames.All
            : [RoleNames.User];

        return await dbContext.Roles
            .Where(role => roleNames.Contains(role.Name))
            .Select(role => role.Id)
            .ToArrayAsync(cancellationToken);
    }
}
