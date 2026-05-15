using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

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

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(tutorial =>
                tutorial.Title.Contains(request.Search) ||
                tutorial.Slug.Contains(request.Search) ||
                tutorial.Summary.Contains(request.Search) ||
                tutorial.TutorialTags.Any(tutorialTag => tutorialTag.Tag!.Name.Contains(request.Search)));
        }

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
