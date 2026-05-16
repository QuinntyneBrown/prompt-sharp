using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Projects;

public sealed record GetProjectDownloadQuery(int ProjectNumber) : IQuery<ProjectDownloadDto>;
