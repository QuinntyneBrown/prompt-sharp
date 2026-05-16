namespace PromptSharp.Application.Projects;

public sealed record ProjectDto(
    string Id,
    string Idea,
    string CreatedLabel,
    int PromptCount,
    int PhaseCount,
    string Estimate,
    string Status,
    IReadOnlyList<PhaseDto> Phases);
