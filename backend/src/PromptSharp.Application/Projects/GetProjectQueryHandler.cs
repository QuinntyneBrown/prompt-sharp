using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;

namespace PromptSharp.Application.Projects;

public sealed class GetProjectQueryHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<GetProjectQuery, ProjectDto>
{
    public async Task<ProjectDto> Handle(GetProjectQuery request, CancellationToken cancellationToken)
    {
        var project = await ProjectQuery.LoadOwnedProjectAsync(dbContext, currentUser.RequireUserId(), request.ProjectNumber, true, cancellationToken);
        return project.ToDto(dateTimeProvider.UtcNow);
    }
}
