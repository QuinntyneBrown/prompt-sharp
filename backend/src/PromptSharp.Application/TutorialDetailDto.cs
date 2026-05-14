using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record TutorialDetailDto(
    Guid Id,
    string Slug,
    string Title,
    string Summary,
    DifficultyLevel DifficultyLevel,
    int EstimatedMinutes,
    bool IsPublished,
    bool IsFeatured,
    bool IsEditorsPick,
    Guid CategoryId,
    string CategorySlug,
    string CategoryName,
    Guid AuthorId,
    string AuthorName,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyList<TutorialStepDto> Steps,
    IReadOnlyList<TagDto> Tags);
