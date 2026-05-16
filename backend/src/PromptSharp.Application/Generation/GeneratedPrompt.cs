namespace PromptSharp.Application.Generation;

public sealed record GeneratedPrompt(string Title, string Body, IReadOnlyList<string>? Tags);
