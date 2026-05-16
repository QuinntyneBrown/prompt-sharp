using PromptSharp.Application.Projects;

namespace PromptSharp.Application.Generation;

public sealed record ProjectGenerationUpdateDto(
    string Type,
    string Message,
    string? PhaseIx,
    string? PromptNumber,
    string? Delta,
    ProjectDto? Project);
