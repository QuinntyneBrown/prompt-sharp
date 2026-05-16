using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Projects;

internal static class ProjectQuery
{
    public static async Task<Project> LoadOwnedProjectAsync(
        IPromptSharpDbContext dbContext,
        Guid userId,
        int projectNumber,
        bool track,
        CancellationToken cancellationToken)
    {
        var query = dbContext.Projects
            .Include(project => project.Phases)
            .ThenInclude(phase => phase.Prompts)
            .Where(project => project.UserId == userId && project.ProjectNumber == projectNumber);

        if (!track)
        {
            query = query.AsNoTracking();
        }

        return await query.SingleOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException("Project was not found.");
    }
}
