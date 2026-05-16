namespace PromptSharp.Application.Projects;

public sealed record PromptDto(string N, string Title, string Body, IReadOnlyList<string> Tags);
