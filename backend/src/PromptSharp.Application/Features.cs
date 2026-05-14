using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

public sealed record GetTutorialsQuery(
    string? Category = null,
    string? Tag = null,
    DifficultyLevel? Difficulty = null,
    int Page = 1,
    int PageSize = 20,
    string? Sort = null) : IQuery<PagedResult<TutorialListItemDto>>;

public sealed record GetTutorialBySlugQuery(string Slug) : IQuery<TutorialDetailDto>;

public sealed record GetFeaturedTutorialsQuery() : IQuery<IReadOnlyList<TutorialListItemDto>>;

public sealed record GetEditorsPickQuery() : IQuery<TutorialListItemDto?>;

public sealed record GetCategoriesQuery() : IQuery<IReadOnlyList<CategoryDto>>;

public sealed record GetCategoryTutorialsQuery(string Slug, int Page = 1, int PageSize = 20) : IQuery<PagedResult<TutorialListItemDto>>;

public sealed record GetTagTutorialsQuery(string Slug, int Page = 1, int PageSize = 20) : IQuery<PagedResult<TutorialListItemDto>>;

public sealed record EnsureUserExistsCommand(
    string Sub,
    string Email,
    string DisplayName,
    string? AvatarUrl) : ICommand<UserDto>;

[AuthorizeRequest]
public sealed record GetMeQuery() : IQuery<UserDto>;

[AuthorizeRequest]
public sealed record GetBookmarksQuery() : IQuery<IReadOnlyList<BookmarkDto>>;

[AuthorizeRequest]
public sealed record AddBookmarkCommand(Guid TutorialId) : ICommand;

[AuthorizeRequest]
public sealed record DeleteBookmarkCommand(Guid TutorialId) : ICommand;

[AuthorizeRequest]
public sealed record GetProgressQuery(Guid TutorialId) : IQuery<TutorialProgressDto>;

[AuthorizeRequest]
public sealed record PutProgressCommand(Guid TutorialId, ProgressUpsertDto Input) : ICommand<TutorialProgressDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record ListAdminTutorialsQuery(int Page = 1, int PageSize = 20, string? Search = null) : IQuery<PagedResult<TutorialListItemDto>>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record GetAdminTutorialQuery(Guid Id) : IQuery<TutorialDetailDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record CreateTutorialCommand(TutorialUpsertDto Input) : ICommand<TutorialDetailDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record UpdateTutorialCommand(Guid Id, TutorialUpsertDto Input) : ICommand<TutorialDetailDto>;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record DeleteTutorialCommand(Guid Id) : ICommand;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record PublishTutorialCommand(Guid Id) : ICommand<TutorialDetailDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record FeatureTutorialCommand(Guid Id, bool IsFeatured = true) : ICommand<TutorialDetailDto>;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record SetEditorsPickCommand(Guid Id) : ICommand<TutorialDetailDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record ReplaceTutorialStepsCommand(Guid Id, IReadOnlyList<TutorialStepUpsertDto> Steps) : ICommand<TutorialDetailDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record ListAdminCategoriesQuery() : IQuery<IReadOnlyList<CategoryDto>>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record CreateCategoryCommand(CategoryUpsertDto Input) : ICommand<CategoryDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record UpdateCategoryCommand(Guid Id, CategoryUpsertDto Input) : ICommand<CategoryDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record DeleteCategoryCommand(Guid Id) : ICommand;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record ListAdminTagsQuery() : IQuery<IReadOnlyList<TagDto>>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record CreateTagCommand(TagUpsertDto Input) : ICommand<TagDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record UpdateTagCommand(Guid Id, TagUpsertDto Input) : ICommand<TagDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record DeleteTagCommand(Guid Id) : ICommand;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record ListMediaQuery() : IQuery<IReadOnlyList<MediaDto>>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record UploadMediaCommand(string FileName, string ContentType, long SizeBytes, Stream Content) : ICommand<MediaDto>;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record DeleteMediaCommand(Guid Id) : ICommand;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record ListUsersQuery() : IQuery<IReadOnlyList<UserDto>>;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record UpdateUserRolesCommand(Guid Id, UserRolesUpsertDto Input) : ICommand<UserDto>;

internal sealed class CatalogQueryHandlers(IPromptSharpDbContext dbContext) :
    IRequestHandler<GetTutorialsQuery, PagedResult<TutorialListItemDto>>,
    IRequestHandler<GetTutorialBySlugQuery, TutorialDetailDto>,
    IRequestHandler<GetFeaturedTutorialsQuery, IReadOnlyList<TutorialListItemDto>>,
    IRequestHandler<GetEditorsPickQuery, TutorialListItemDto?>,
    IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryDto>>,
    IRequestHandler<GetCategoryTutorialsQuery, PagedResult<TutorialListItemDto>>,
    IRequestHandler<GetTagTutorialsQuery, PagedResult<TutorialListItemDto>>
{
    public async Task<PagedResult<TutorialListItemDto>> Handle(GetTutorialsQuery request, CancellationToken cancellationToken)
    {
        var query = dbContext.Tutorials
            .AsNoTracking()
            .Where(tutorial => tutorial.IsPublished);

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(tutorial => tutorial.Category!.Slug == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Tag))
        {
            query = query.Where(tutorial => tutorial.TutorialTags.Any(tutorialTag => tutorialTag.Tag!.Slug == request.Tag));
        }

        if (request.Difficulty is not null)
        {
            query = query.Where(tutorial => tutorial.DifficultyLevel == request.Difficulty);
        }

        query = ApplySort(query, request.Sort);
        return await ToPagedList(query, request.Page, request.PageSize, cancellationToken);
    }

    public async Task<TutorialDetailDto> Handle(GetTutorialBySlugQuery request, CancellationToken cancellationToken)
    {
        var tutorial = await DetailsQuery()
            .AsNoTracking()
            .SingleOrDefaultAsync(tutorial => tutorial.Slug == request.Slug && tutorial.IsPublished, cancellationToken);

        return tutorial is null
            ? throw new NotFoundException($"Tutorial '{request.Slug}' was not found.")
            : TutorialMapper.ToDetail(tutorial);
    }

    public async Task<IReadOnlyList<TutorialListItemDto>> Handle(GetFeaturedTutorialsQuery request, CancellationToken cancellationToken)
    {
        var tutorials = await CatalogQuery()
            .Where(tutorial => tutorial.IsPublished && tutorial.IsFeatured)
            .OrderByDescending(tutorial => tutorial.UpdatedAt)
            .Take(8)
            .ToListAsync(cancellationToken);

        return tutorials.Select(TutorialMapper.ToListItem).ToArray();
    }

    public async Task<TutorialListItemDto?> Handle(GetEditorsPickQuery request, CancellationToken cancellationToken)
    {
        var tutorial = await CatalogQuery()
            .SingleOrDefaultAsync(tutorial => tutorial.IsPublished && tutorial.IsEditorsPick, cancellationToken);

        return tutorial is null ? null : TutorialMapper.ToListItem(tutorial);
    }

    public async Task<IReadOnlyList<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await dbContext.Categories
            .AsNoTracking()
            .OrderBy(category => category.Order)
            .ThenBy(category => category.Name)
            .Select(category => new CategoryDto(
                category.Id,
                category.Slug,
                category.Name,
                category.Order,
                dbContext.Tutorials.Count(tutorial => tutorial.IsPublished && tutorial.CategoryId == category.Id)))
            .ToListAsync(cancellationToken);

        return categories;
    }

    public Task<PagedResult<TutorialListItemDto>> Handle(GetCategoryTutorialsQuery request, CancellationToken cancellationToken)
    {
        return Handle(new GetTutorialsQuery(Category: request.Slug, Page: request.Page, PageSize: request.PageSize), cancellationToken);
    }

    public Task<PagedResult<TutorialListItemDto>> Handle(GetTagTutorialsQuery request, CancellationToken cancellationToken)
    {
        return Handle(new GetTutorialsQuery(Tag: request.Slug, Page: request.Page, PageSize: request.PageSize), cancellationToken);
    }

    private IQueryable<Tutorial> CatalogQuery()
    {
        return dbContext.Tutorials
            .AsNoTracking()
            .Include(tutorial => tutorial.Category)
            .Include(tutorial => tutorial.TutorialTags)
            .ThenInclude(tutorialTag => tutorialTag.Tag)
            .Include(tutorial => tutorial.Steps);
    }

    private IQueryable<Tutorial> DetailsQuery()
    {
        return dbContext.Tutorials
            .Include(tutorial => tutorial.Category)
            .Include(tutorial => tutorial.Author)
            .Include(tutorial => tutorial.TutorialTags)
            .ThenInclude(tutorialTag => tutorialTag.Tag)
            .Include(tutorial => tutorial.Steps);
    }

    private async Task<PagedResult<TutorialListItemDto>> ToPagedList(
        IQueryable<Tutorial> source,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var total = await source.CountAsync(cancellationToken);
        var tutorials = await source
            .Include(tutorial => tutorial.Category)
            .Include(tutorial => tutorial.TutorialTags)
            .ThenInclude(tutorialTag => tutorialTag.Tag)
            .Include(tutorial => tutorial.Steps)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<TutorialListItemDto>(
            tutorials.Select(TutorialMapper.ToListItem).ToArray(),
            page,
            pageSize,
            total);
    }

    private static IQueryable<Tutorial> ApplySort(IQueryable<Tutorial> query, string? sort)
    {
        return sort?.Trim().ToLowerInvariant() switch
        {
            "title" => query.OrderBy(tutorial => tutorial.Title),
            "difficulty" => query.OrderBy(tutorial => tutorial.DifficultyLevel).ThenBy(tutorial => tutorial.Title),
            "minutes" => query.OrderBy(tutorial => tutorial.EstimatedMinutes).ThenBy(tutorial => tutorial.Title),
            "updated" => query.OrderByDescending(tutorial => tutorial.UpdatedAt),
            _ => query.OrderByDescending(tutorial => tutorial.CreatedAt)
        };
    }
}

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

internal sealed class AdminTutorialHandlers(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    TimeProvider timeProvider) :
    IRequestHandler<ListAdminTutorialsQuery, PagedResult<TutorialListItemDto>>,
    IRequestHandler<GetAdminTutorialQuery, TutorialDetailDto>,
    IRequestHandler<CreateTutorialCommand, TutorialDetailDto>,
    IRequestHandler<UpdateTutorialCommand, TutorialDetailDto>,
    IRequestHandler<DeleteTutorialCommand>,
    IRequestHandler<PublishTutorialCommand, TutorialDetailDto>,
    IRequestHandler<FeatureTutorialCommand, TutorialDetailDto>,
    IRequestHandler<SetEditorsPickCommand, TutorialDetailDto>,
    IRequestHandler<ReplaceTutorialStepsCommand, TutorialDetailDto>
{
    public async Task<PagedResult<TutorialListItemDto>> Handle(ListAdminTutorialsQuery request, CancellationToken cancellationToken)
    {
        var query = dbContext.Tutorials.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(tutorial =>
                tutorial.Title.Contains(request.Search) ||
                tutorial.Slug.Contains(request.Search) ||
                tutorial.Summary.Contains(request.Search));
        }

        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var total = await query.CountAsync(cancellationToken);
        var tutorials = await query
            .OrderByDescending(tutorial => tutorial.UpdatedAt)
            .Include(tutorial => tutorial.Category)
            .Include(tutorial => tutorial.TutorialTags)
            .ThenInclude(tutorialTag => tutorialTag.Tag)
            .Include(tutorial => tutorial.Steps)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<TutorialListItemDto>(
            tutorials.Select(TutorialMapper.ToListItem).ToArray(),
            page,
            pageSize,
            total);
    }

    public Task<TutorialDetailDto> Handle(GetAdminTutorialQuery request, CancellationToken cancellationToken)
    {
        return LoadDetail(request.Id, cancellationToken);
    }

    public async Task<TutorialDetailDto> Handle(CreateTutorialCommand request, CancellationToken cancellationToken)
    {
        await EnsureSlugIsUnique(request.Input.Slug, null, cancellationToken);
        await EnsureCategoryExists(request.Input.CategoryId, cancellationToken);
        await EnsureTagsExist(request.Input.TagIds, cancellationToken);

        var author = await RequireCurrentUser(cancellationToken);
        var now = timeProvider.GetUtcNow();
        var tutorial = Tutorial.Create(
            request.Input.Slug,
            request.Input.Title,
            request.Input.Summary,
            request.Input.DifficultyLevel,
            request.Input.EstimatedMinutes,
            request.Input.CategoryId,
            author.Id,
            now);

        tutorial.SetTags(request.Input.TagIds);
        dbContext.Tutorials.Add(tutorial);
        return await SaveAndLoadDetail(tutorial.Id, cancellationToken);
    }

    public async Task<TutorialDetailDto> Handle(UpdateTutorialCommand request, CancellationToken cancellationToken)
    {
        await EnsureSlugIsUnique(request.Input.Slug, request.Id, cancellationToken);
        await EnsureCategoryExists(request.Input.CategoryId, cancellationToken);
        await EnsureTagsExist(request.Input.TagIds, cancellationToken);

        var tutorial = await LoadForWrite(request.Id, cancellationToken);
        tutorial.UpdateDetails(
            request.Input.Slug,
            request.Input.Title,
            request.Input.Summary,
            request.Input.DifficultyLevel,
            request.Input.EstimatedMinutes,
            request.Input.CategoryId,
            timeProvider.GetUtcNow());
        tutorial.SetTags(request.Input.TagIds);
        return await SaveAndLoadDetail(tutorial.Id, cancellationToken);
    }

    public async Task Handle(DeleteTutorialCommand request, CancellationToken cancellationToken)
    {
        var tutorial = await LoadForWrite(request.Id, cancellationToken);
        tutorial.SoftDelete(timeProvider.GetUtcNow());
    }

    public async Task<TutorialDetailDto> Handle(PublishTutorialCommand request, CancellationToken cancellationToken)
    {
        var tutorial = await LoadForWrite(request.Id, cancellationToken);
        tutorial.Publish(timeProvider.GetUtcNow());
        return await SaveAndLoadDetail(tutorial.Id, cancellationToken);
    }

    public async Task<TutorialDetailDto> Handle(FeatureTutorialCommand request, CancellationToken cancellationToken)
    {
        var tutorial = await LoadForWrite(request.Id, cancellationToken);
        tutorial.SetFeatured(request.IsFeatured, timeProvider.GetUtcNow());
        return await SaveAndLoadDetail(tutorial.Id, cancellationToken);
    }

    public async Task<TutorialDetailDto> Handle(SetEditorsPickCommand request, CancellationToken cancellationToken)
    {
        var tutorials = await dbContext.Tutorials.ToListAsync(cancellationToken);
        var target = tutorials.SingleOrDefault(tutorial => tutorial.Id == request.Id)
            ?? throw new NotFoundException($"Tutorial '{request.Id}' was not found.");

        var now = timeProvider.GetUtcNow();
        new TutorialEditorialService().MakeEditorsPick(target, tutorials, now);
        return await SaveAndLoadDetail(target.Id, cancellationToken);
    }

    public async Task<TutorialDetailDto> Handle(ReplaceTutorialStepsCommand request, CancellationToken cancellationToken)
    {
        var tutorial = await LoadForWrite(request.Id, cancellationToken);
        tutorial.ReplaceSteps(
            request.Steps.Select(step => new TutorialStepDraft(
                step.Title,
                step.BodyMarkdown,
                step.CodeSnippet,
                step.CodeLanguage,
                step.ImageMediaId)),
            timeProvider.GetUtcNow());

        return await SaveAndLoadDetail(tutorial.Id, cancellationToken);
    }

    private async Task<User> RequireCurrentUser(CancellationToken cancellationToken)
    {
        if (!currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(currentUser.Subject))
        {
            throw new ForbiddenException("Authentication is required.");
        }

        return await dbContext.Users.SingleOrDefaultAsync(user => user.Sub == currentUser.Subject, cancellationToken)
            ?? throw new NotFoundException("Current user has not been provisioned.");
    }

    private async Task<Tutorial> LoadForWrite(Guid id, CancellationToken cancellationToken)
    {
        return await dbContext.Tutorials
            .Include(tutorial => tutorial.Steps)
            .Include(tutorial => tutorial.TutorialTags)
            .SingleOrDefaultAsync(tutorial => tutorial.Id == id, cancellationToken)
            ?? throw new NotFoundException($"Tutorial '{id}' was not found.");
    }

    private async Task<TutorialDetailDto> LoadDetail(Guid id, CancellationToken cancellationToken)
    {
        var tutorial = await dbContext.Tutorials
            .Include(entity => entity.Category)
            .Include(entity => entity.Author)
            .Include(entity => entity.Steps)
            .Include(entity => entity.TutorialTags)
            .ThenInclude(tutorialTag => tutorialTag.Tag)
            .SingleAsync(entity => entity.Id == id, cancellationToken);

        return TutorialMapper.ToDetail(tutorial);
    }

    private async Task<TutorialDetailDto> SaveAndLoadDetail(Guid id, CancellationToken cancellationToken)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
        return await LoadDetail(id, cancellationToken);
    }

    private async Task EnsureSlugIsUnique(string slug, Guid? existingTutorialId, CancellationToken cancellationToken)
    {
        var isDuplicate = await dbContext.Tutorials.AnyAsync(
            tutorial => tutorial.Slug == slug && tutorial.Id != existingTutorialId,
            cancellationToken);

        if (isDuplicate)
        {
            throw new ConflictException($"Tutorial slug '{slug}' is already in use.");
        }
    }

    private async Task EnsureCategoryExists(Guid categoryId, CancellationToken cancellationToken)
    {
        var exists = await dbContext.Categories.AnyAsync(category => category.Id == categoryId, cancellationToken);
        if (!exists)
        {
            throw new ValidationException("Category does not exist.");
        }
    }

    private async Task EnsureTagsExist(IReadOnlyCollection<Guid> tagIds, CancellationToken cancellationToken)
    {
        if (tagIds.Count == 0)
        {
            return;
        }

        var existingCount = await dbContext.Tags.CountAsync(tag => tagIds.Contains(tag.Id), cancellationToken);
        if (existingCount != tagIds.Distinct().Count())
        {
            throw new ValidationException("One or more tags do not exist.");
        }
    }
}

internal sealed class TaxonomyHandlers(IPromptSharpDbContext dbContext) :
    IRequestHandler<ListAdminCategoriesQuery, IReadOnlyList<CategoryDto>>,
    IRequestHandler<CreateCategoryCommand, CategoryDto>,
    IRequestHandler<UpdateCategoryCommand, CategoryDto>,
    IRequestHandler<DeleteCategoryCommand>,
    IRequestHandler<ListAdminTagsQuery, IReadOnlyList<TagDto>>,
    IRequestHandler<CreateTagCommand, TagDto>,
    IRequestHandler<UpdateTagCommand, TagDto>,
    IRequestHandler<DeleteTagCommand>
{
    public async Task<IReadOnlyList<CategoryDto>> Handle(ListAdminCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Categories
            .AsNoTracking()
            .OrderBy(category => category.Order)
            .Select(category => new CategoryDto(
                category.Id,
                category.Slug,
                category.Name,
                category.Order,
                dbContext.Tutorials.Count(tutorial => tutorial.CategoryId == category.Id)))
            .ToArrayAsync(cancellationToken);
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        await EnsureCategorySlugIsUnique(request.Input.Slug, null, cancellationToken);
        var category = Category.Create(request.Input.Slug, request.Input.Name, request.Input.Order);
        dbContext.Categories.Add(category);
        return new CategoryDto(category.Id, category.Slug, category.Name, category.Order, 0);
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        await EnsureCategorySlugIsUnique(request.Input.Slug, request.Id, cancellationToken);
        var category = await dbContext.Categories.SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"Category '{request.Id}' was not found.");

        category.Update(request.Input.Slug, request.Input.Name, request.Input.Order);
        var count = await dbContext.Tutorials.CountAsync(tutorial => tutorial.CategoryId == category.Id, cancellationToken);
        return new CategoryDto(category.Id, category.Slug, category.Name, category.Order, count);
    }

    public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await dbContext.Categories.SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"Category '{request.Id}' was not found.");

        var inUse = await dbContext.Tutorials.AnyAsync(tutorial => tutorial.CategoryId == request.Id, cancellationToken);
        if (inUse)
        {
            throw new ConflictException("Cannot delete a category that still has tutorials.");
        }

        dbContext.Categories.Remove(category);
    }

    public async Task<IReadOnlyList<TagDto>> Handle(ListAdminTagsQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Tags
            .AsNoTracking()
            .OrderBy(tag => tag.Name)
            .Select(tag => new TagDto(tag.Id, tag.Slug, tag.Name))
            .ToArrayAsync(cancellationToken);
    }

    public async Task<TagDto> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        await EnsureTagSlugIsUnique(request.Input.Slug, null, cancellationToken);
        var tag = Tag.Create(request.Input.Slug, request.Input.Name);
        dbContext.Tags.Add(tag);
        return new TagDto(tag.Id, tag.Slug, tag.Name);
    }

    public async Task<TagDto> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
    {
        await EnsureTagSlugIsUnique(request.Input.Slug, request.Id, cancellationToken);
        var tag = await dbContext.Tags.SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"Tag '{request.Id}' was not found.");

        tag.Update(request.Input.Slug, request.Input.Name);
        return new TagDto(tag.Id, tag.Slug, tag.Name);
    }

    public async Task Handle(DeleteTagCommand request, CancellationToken cancellationToken)
    {
        var tag = await dbContext.Tags.SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"Tag '{request.Id}' was not found.");

        dbContext.Tags.Remove(tag);
    }

    private async Task EnsureCategorySlugIsUnique(string slug, Guid? existingCategoryId, CancellationToken cancellationToken)
    {
        var isDuplicate = await dbContext.Categories.AnyAsync(
            category => category.Slug == slug && category.Id != existingCategoryId,
            cancellationToken);

        if (isDuplicate)
        {
            throw new ConflictException($"Category slug '{slug}' is already in use.");
        }
    }

    private async Task EnsureTagSlugIsUnique(string slug, Guid? existingTagId, CancellationToken cancellationToken)
    {
        var isDuplicate = await dbContext.Tags.AnyAsync(
            tag => tag.Slug == slug && tag.Id != existingTagId,
            cancellationToken);

        if (isDuplicate)
        {
            throw new ConflictException($"Tag slug '{slug}' is already in use.");
        }
    }
}

internal sealed class MediaHandlers(
    IPromptSharpDbContext dbContext,
    IMediaStore mediaStore,
    ICurrentUser currentUser,
    TimeProvider timeProvider) :
    IRequestHandler<ListMediaQuery, IReadOnlyList<MediaDto>>,
    IRequestHandler<UploadMediaCommand, MediaDto>,
    IRequestHandler<DeleteMediaCommand>
{
    public async Task<IReadOnlyList<MediaDto>> Handle(ListMediaQuery request, CancellationToken cancellationToken)
    {
        var media = await dbContext.Media
            .AsNoTracking()
            .OrderByDescending(media => media.UploadedAt)
            .ToArrayAsync(cancellationToken);

        return media.Select(TutorialMapper.ToMediaDto).ToArray();
    }

    public async Task<MediaDto> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        var stored = await mediaStore.SaveAsync(request.FileName, request.ContentType, request.Content, cancellationToken);
        var media = Media.Create(stored.Url, stored.FileName, stored.ContentType, stored.SizeBytes, user.Id, timeProvider.GetUtcNow());
        dbContext.Media.Add(media);
        return TutorialMapper.ToMediaDto(media);
    }

    public async Task Handle(DeleteMediaCommand request, CancellationToken cancellationToken)
    {
        var media = await dbContext.Media.SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"Media '{request.Id}' was not found.");

        await mediaStore.DeleteAsync(media.Url, cancellationToken);
        dbContext.Media.Remove(media);
    }

    private async Task<User> RequireCurrentUser(CancellationToken cancellationToken)
    {
        if (!currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(currentUser.Subject))
        {
            throw new ForbiddenException("Authentication is required.");
        }

        return await dbContext.Users.SingleOrDefaultAsync(user => user.Sub == currentUser.Subject, cancellationToken)
            ?? throw new NotFoundException("Current user has not been provisioned.");
    }
}

internal sealed class UserAdminHandlers(IPromptSharpDbContext dbContext) :
    IRequestHandler<ListUsersQuery, IReadOnlyList<UserDto>>,
    IRequestHandler<UpdateUserRolesCommand, UserDto>
{
    public async Task<IReadOnlyList<UserDto>> Handle(ListUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await dbContext.Users
            .AsNoTracking()
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .OrderBy(user => user.DisplayName)
            .ToListAsync(cancellationToken);

        return users.Select(TutorialMapper.ToUserDto).ToArray();
    }

    public async Task<UserDto> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"User '{request.Id}' was not found.");

        var requestedRoles = request.Input.Roles.Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
        var roles = await dbContext.Roles
            .Where(role => requestedRoles.Contains(role.Name))
            .ToArrayAsync(cancellationToken);

        if (roles.Length != requestedRoles.Length)
        {
            throw new ValidationException("One or more roles do not exist.");
        }

        user.ReplaceRoles(roles.Select(role => role.Id));
        await dbContext.SaveChangesAsync(cancellationToken);

        var updated = await dbContext.Users
            .AsNoTracking()
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleAsync(entity => entity.Id == request.Id, cancellationToken);

        return TutorialMapper.ToUserDto(updated);
    }
}

internal sealed class TutorialUpsertDtoValidator : AbstractValidator<TutorialUpsertDto>
{
    public TutorialUpsertDtoValidator()
    {
        RuleFor(dto => dto.Slug).NotEmpty().MaximumLength(160);
        RuleFor(dto => dto.Title).NotEmpty().MaximumLength(220);
        RuleFor(dto => dto.Summary).NotNull().MaximumLength(1_000);
        RuleFor(dto => dto.EstimatedMinutes).GreaterThan(0).LessThanOrEqualTo(480);
        RuleFor(dto => dto.CategoryId).NotEmpty();
        RuleFor(dto => dto.TagIds).NotNull();
    }
}

internal sealed class CreateTutorialCommandValidator : AbstractValidator<CreateTutorialCommand>
{
    public CreateTutorialCommandValidator() => RuleFor(command => command.Input).SetValidator(new TutorialUpsertDtoValidator());
}

internal sealed class UpdateTutorialCommandValidator : AbstractValidator<UpdateTutorialCommand>
{
    public UpdateTutorialCommandValidator() => RuleFor(command => command.Input).SetValidator(new TutorialUpsertDtoValidator());
}

internal sealed class ReplaceTutorialStepsCommandValidator : AbstractValidator<ReplaceTutorialStepsCommand>
{
    public ReplaceTutorialStepsCommandValidator()
    {
        RuleFor(command => command.Steps).NotNull();
        RuleForEach(command => command.Steps).ChildRules(step =>
        {
            step.RuleFor(value => value.Title).NotEmpty().MaximumLength(220);
            step.RuleFor(value => value.BodyMarkdown).NotEmpty();
            step.RuleFor(value => value.CodeLanguage).MaximumLength(40);
        });
    }
}

internal sealed class CategoryCommandValidators :
    AbstractValidator<CategoryUpsertDto>
{
    public CategoryCommandValidators()
    {
        RuleFor(dto => dto.Slug).NotEmpty().MaximumLength(160);
        RuleFor(dto => dto.Name).NotEmpty().MaximumLength(160);
    }
}

internal sealed class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator() => RuleFor(command => command.Input).SetValidator(new CategoryCommandValidators());
}

internal sealed class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator() => RuleFor(command => command.Input).SetValidator(new CategoryCommandValidators());
}

internal sealed class TagCommandValidators : AbstractValidator<TagUpsertDto>
{
    public TagCommandValidators()
    {
        RuleFor(dto => dto.Slug).NotEmpty().MaximumLength(160);
        RuleFor(dto => dto.Name).NotEmpty().MaximumLength(160);
    }
}

internal sealed class CreateTagCommandValidator : AbstractValidator<CreateTagCommand>
{
    public CreateTagCommandValidator() => RuleFor(command => command.Input).SetValidator(new TagCommandValidators());
}

internal sealed class UpdateTagCommandValidator : AbstractValidator<UpdateTagCommand>
{
    public UpdateTagCommandValidator() => RuleFor(command => command.Input).SetValidator(new TagCommandValidators());
}

internal sealed class UploadMediaCommandValidator : AbstractValidator<UploadMediaCommand>
{
    private static readonly string[] AllowedContentTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

    public UploadMediaCommandValidator()
    {
        RuleFor(command => command.FileName).NotEmpty().MaximumLength(260);
        RuleFor(command => command.SizeBytes).GreaterThan(0).LessThanOrEqualTo(5 * 1024 * 1024);
        RuleFor(command => command.ContentType).Must(contentType => AllowedContentTypes.Contains(contentType))
            .WithMessage("Unsupported media content type.");
    }
}

internal sealed class PutProgressCommandValidator : AbstractValidator<PutProgressCommand>
{
    public PutProgressCommandValidator()
    {
        RuleFor(command => command.TutorialId).NotEmpty();
        RuleFor(command => command.Input.CompletedStepIds).NotNull();
    }
}

internal sealed class UpdateUserRolesCommandValidator : AbstractValidator<UpdateUserRolesCommand>
{
    public UpdateUserRolesCommandValidator()
    {
        RuleFor(command => command.Input.Roles).NotEmpty();
        RuleForEach(command => command.Input.Roles).Must(role => RoleNames.All.Contains(role))
            .WithMessage("Unsupported role.");
    }
}

internal static class TutorialMapper
{
    public static TutorialListItemDto ToListItem(Tutorial tutorial)
    {
        return new TutorialListItemDto(
            tutorial.Id,
            tutorial.Slug,
            tutorial.Title,
            tutorial.Summary,
            tutorial.DifficultyLevel,
            tutorial.EstimatedMinutes,
            tutorial.IsPublished,
            tutorial.IsFeatured,
            tutorial.IsEditorsPick,
            tutorial.Category?.Slug ?? string.Empty,
            tutorial.Category?.Name ?? string.Empty,
            tutorial.TutorialTags
                .Select(tutorialTag => tutorialTag.Tag?.Name)
                .Where(name => !string.IsNullOrWhiteSpace(name))
                .Select(name => name!)
                .Order(StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            tutorial.Steps.Count);
    }

    public static TutorialDetailDto ToDetail(Tutorial tutorial)
    {
        return new TutorialDetailDto(
            tutorial.Id,
            tutorial.Slug,
            tutorial.Title,
            tutorial.Summary,
            tutorial.DifficultyLevel,
            tutorial.EstimatedMinutes,
            tutorial.IsPublished,
            tutorial.IsFeatured,
            tutorial.IsEditorsPick,
            tutorial.CategoryId,
            tutorial.Category?.Slug ?? string.Empty,
            tutorial.Category?.Name ?? string.Empty,
            tutorial.AuthorId,
            tutorial.Author?.DisplayName ?? string.Empty,
            tutorial.CreatedAt,
            tutorial.UpdatedAt,
            tutorial.Steps
                .OrderBy(step => step.Order)
                .Select(step => new TutorialStepDto(
                    step.Id,
                    step.Order,
                    step.Title,
                    step.BodyMarkdown,
                    step.CodeSnippet,
                    step.CodeLanguage,
                    step.ImageMediaId))
                .ToArray(),
            tutorial.TutorialTags
                .Where(tutorialTag => tutorialTag.Tag is not null)
                .Select(tutorialTag => new TagDto(tutorialTag.Tag!.Id, tutorialTag.Tag.Slug, tutorialTag.Tag.Name))
                .OrderBy(tag => tag.Name)
                .ToArray());
    }

    public static UserDto ToUserDto(User user)
    {
        return new UserDto(
            user.Id,
            user.Sub,
            user.Email,
            user.DisplayName,
            user.AvatarUrl,
            user.CreatedAt,
            user.LastSeenAt,
            user.UserRoles
                .Select(userRole => userRole.Role?.Name)
                .Where(name => !string.IsNullOrWhiteSpace(name))
                .Select(name => name!)
                .Order(StringComparer.OrdinalIgnoreCase)
                .ToArray());
    }

    public static TutorialProgressDto ToProgressDto(TutorialProgress progress)
    {
        return new TutorialProgressDto(
            progress.UserId,
            progress.TutorialId,
            progress.CurrentStepId,
            progress.CompletedStepIds.ToArray(),
            progress.UpdatedAt);
    }

    public static MediaDto ToMediaDto(Media media)
    {
        return new MediaDto(
            media.Id,
            media.Url,
            media.FileName,
            media.ContentType,
            media.SizeBytes,
            media.UploadedById,
            media.UploadedAt);
    }
}
