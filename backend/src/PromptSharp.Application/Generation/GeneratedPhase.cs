namespace PromptSharp.Application.Generation;

public sealed record GeneratedPhase(string Title, IReadOnlyList<GeneratedPrompt> Prompts);
