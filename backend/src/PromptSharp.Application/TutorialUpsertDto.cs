using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record TutorialUpsertDto(
    string Slug,
    string Title,
    string Summary,
    DifficultyLevel DifficultyLevel,
    int EstimatedMinutes,
    Guid CategoryId,
    IReadOnlyList<Guid> TagIds);
