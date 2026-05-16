using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;
using PromptSharp.Domain.Enums;

namespace PromptSharp.Application.Projects;

public sealed class ListProjectsQueryHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<ListProjectsQuery, ProjectListResponseDto>
{
    public async Task<ProjectListResponseDto> Handle(ListProjectsQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var query = dbContext.Projects
            .AsNoTracking()
            .Include(project => project.Phases)
            .ThenInclude(phase => phase.Prompts)
            .Where(project => project.UserId == userId);

        if (string.IsNullOrWhiteSpace(request.Status))
        {
            query = query.Where(project => project.Status != ProjectStatus.Archived);
        }
        else if (!request.Status.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var status = ProjectMappings.ParseStatus(request.Status);
            query = query.Where(project => project.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = $"%{request.Search.Trim()}%";
            query = query.Where(project =>
                EF.Functions.Like(project.Idea, search) ||
                project.Phases.Any(phase => phase.Prompts.Any(prompt =>
                    EF.Functions.Like(prompt.Title, search) ||
                    EF.Functions.Like(prompt.Body, search) ||
                    EF.Functions.Like(prompt.TagsJson, search))));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(project => project.CreatedAtUtc)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new ProjectListResponseDto(
            items.Select(project => project.ToSummaryDto(dateTimeProvider.UtcNow)).ToArray(),
            request.Page,
            request.PageSize,
            total);
    }
}
