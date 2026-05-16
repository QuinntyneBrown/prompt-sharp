using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Account;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Projects;

public sealed class CreateProjectCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<CreateProjectCommand, ProjectSummaryDto>
{
    public async Task<ProjectSummaryDto> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var user = await dbContext.Users.SingleOrDefaultAsync(candidate => candidate.Id == userId, cancellationToken)
            ?? throw new NotFoundException("Account was not found.");

        var nowUtc = dateTimeProvider.UtcNow;
        var monthStart = new DateTimeOffset(nowUtc.Year, nowUtc.Month, 1, 0, 0, 0, TimeSpan.Zero);
        var projectsUsed = await dbContext.Projects
            .CountAsync(project => project.UserId == userId && project.CreatedAtUtc >= monthStart, cancellationToken);

        if (projectsUsed >= user.MonthlyProjectQuota)
        {
            throw new ConflictException("Monthly project quota has been reached.");
        }

        var project = Project.Create(userId, request.Idea, nowUtc);
        dbContext.Projects.Add(project);
        await dbContext.SaveChangesAsync(cancellationToken);

        return project.ToSummaryDto(nowUtc);
    }
}
