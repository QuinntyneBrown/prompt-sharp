using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record ProgressUpsertDto(Guid? CurrentStepId, IReadOnlyList<Guid> CompletedStepIds);
