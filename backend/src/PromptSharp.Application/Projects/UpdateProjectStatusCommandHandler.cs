using MediatR;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;

namespace PromptSharp.Application.Projects;

public sealed class UpdateProjectStatusCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<UpdateProjectStatusCommand, ProjectDto>
{
    public async Task<ProjectDto> Handle(UpdateProjectStatusCommand request, CancellationToken cancellationToken)
    {
        var project = await ProjectQuery.LoadOwnedProjectAsync(dbContext, currentUser.RequireUserId(), request.ProjectNumber, true, cancellationToken);
        project.UpdateStatus(ProjectMappings.ParseStatus(request.Status), dateTimeProvider.UtcNow);
        await dbContext.SaveChangesAsync(cancellationToken);
        return project.ToDto(dateTimeProvider.UtcNow);
    }
}
