using MediatR;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Projects;

public sealed class DeleteProjectCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser) : IRequestHandler<DeleteProjectCommand>
{
    public async Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await ProjectQuery.LoadOwnedProjectAsync(dbContext, currentUser.RequireUserId(), request.ProjectNumber, true, cancellationToken);
        dbContext.Projects.Remove(project);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
