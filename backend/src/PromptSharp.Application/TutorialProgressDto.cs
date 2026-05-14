using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record TutorialProgressDto(
    Guid UserId,
    Guid TutorialId,
    Guid? CurrentStepId,
    IReadOnlyList<Guid> CompletedStepIds,
    DateTimeOffset UpdatedAt);
