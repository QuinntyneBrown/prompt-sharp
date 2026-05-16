using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Projects;

public sealed record GetProjectQuery(int ProjectNumber) : IQuery<ProjectDto>;
