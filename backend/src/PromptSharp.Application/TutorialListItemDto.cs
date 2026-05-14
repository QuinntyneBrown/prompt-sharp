using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record TutorialListItemDto(
    Guid Id,
    string Slug,
    string Title,
    string Summary,
    DifficultyLevel DifficultyLevel,
    int EstimatedMinutes,
    bool IsPublished,
    bool IsFeatured,
    bool IsEditorsPick,
    string CategorySlug,
    string CategoryName,
    IReadOnlyList<string> Tags,
    int StepCount);
