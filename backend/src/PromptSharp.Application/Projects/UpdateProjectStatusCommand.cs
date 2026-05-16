using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Projects;

public sealed record UpdateProjectStatusCommand(int ProjectNumber, string Status) : ICommand<ProjectDto>;
