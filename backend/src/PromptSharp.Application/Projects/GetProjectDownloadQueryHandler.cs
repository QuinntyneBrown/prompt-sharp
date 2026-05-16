using MediatR;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;
using PromptSharp.Application.Rendering;

namespace PromptSharp.Application.Projects;

public sealed class GetProjectDownloadQueryHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    ProjectMarkdownRenderer markdownRenderer) : IRequestHandler<GetProjectDownloadQuery, ProjectDownloadDto>
{
    public async Task<ProjectDownloadDto> Handle(GetProjectDownloadQuery request, CancellationToken cancellationToken)
    {
        var project = await ProjectQuery.LoadOwnedProjectAsync(dbContext, currentUser.RequireUserId(), request.ProjectNumber, true, cancellationToken);
        var content = string.IsNullOrWhiteSpace(project.Markdown) ? markdownRenderer.Render(project) : project.Markdown;
        return new ProjectDownloadDto($"promptsharp-{project.ProjectNumber:D4}.txt", "text/plain", content);
    }
}
