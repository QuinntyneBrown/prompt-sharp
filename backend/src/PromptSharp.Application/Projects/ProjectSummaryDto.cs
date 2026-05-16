namespace PromptSharp.Application.Projects;

public sealed record ProjectSummaryDto(
    string Id,
    string Idea,
    int PromptCount,
    string WhenLabel,
    string Status);
