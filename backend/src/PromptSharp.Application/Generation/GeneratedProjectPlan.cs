namespace PromptSharp.Application.Generation;

public sealed record GeneratedProjectPlan(string Estimate, IReadOnlyList<GeneratedPhase> Phases);
