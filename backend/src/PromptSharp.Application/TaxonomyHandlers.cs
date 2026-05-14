using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

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
