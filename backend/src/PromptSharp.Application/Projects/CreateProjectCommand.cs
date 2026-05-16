using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Projects;

public sealed record CreateProjectCommand(string Idea) : ICommand<ProjectSummaryDto>;
