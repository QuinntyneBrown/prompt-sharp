namespace PromptSharp.Application.Projects;

public sealed record PhaseDto(string Ix, string Title, IReadOnlyList<PromptDto> Prompts);
