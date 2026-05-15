using MediatR;
using Microsoft.EntityFrameworkCore;

namespace PromptSharp.Application.Features;

internal sealed class AdminDashboardHandlers(IPromptSharpDbContext dbContext, TimeProvider timeProvider) :
    IRequestHandler<GetAdminDashboardQuery, AdminDashboardDto>
{
    public async Task<AdminDashboardDto> Handle(GetAdminDashboardQuery request, CancellationToken cancellationToken)
    {
        var totalTutorials = await dbContext.Tutorials
            .AsNoTracking()
            .CountAsync(tutorial => !tutorial.IsDeleted, cancellationToken);
        var publishedTutorials = await dbContext.Tutorials
            .AsNoTracking()
            .CountAsync(tutorial => !tutorial.IsDeleted && tutorial.IsPublished, cancellationToken);
        var authorCount = await dbContext.Users.AsNoTracking().CountAsync(cancellationToken);
        var mediaAssetCount = await dbContext.Media.AsNoTracking().CountAsync(cancellationToken);
        var pendingInvitationCount = await dbContext.UserInvitations
            .AsNoTracking()
            .CountAsync(invitation => invitation.AcceptedAt == null, cancellationToken);

        var recentActivity = await dbContext.AuditEvents
            .AsNoTracking()
            .OrderByDescending(entity => entity.ChangedAt)
            .Take(6)
            .Select(entity => new AdminDashboardActivityDto(
                entity.Actor,
                entity.Action,
                entity.TargetName,
                entity.ChangedAt))
            .ToArrayAsync(cancellationToken);

        var recentTutorials = await dbContext.Tutorials
            .AsNoTracking()
            .Where(tutorial => !tutorial.IsDeleted)
            .OrderByDescending(tutorial => tutorial.UpdatedAt)
            .Include(tutorial => tutorial.Category)
            .Include(tutorial => tutorial.Author)
            .Take(5)
            .Select(tutorial => new AdminDashboardRecentTutorialDto(
                tutorial.Id,
                tutorial.Title,
                tutorial.Category == null ? "Uncategorized" : tutorial.Category.Name,
                tutorial.Author == null ? "Unknown" : tutorial.Author.DisplayName,
                tutorial.IsPublished,
                tutorial.UpdatedAt))
            .ToArrayAsync(cancellationToken);

        return new AdminDashboardDto(
            timeProvider.GetUtcNow(),
            totalTutorials,
            publishedTutorials,
            totalTutorials - publishedTutorials,
            authorCount,
            mediaAssetCount,
            pendingInvitationCount,
            recentActivity,
            recentTutorials);
    }
}
