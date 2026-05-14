using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

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
