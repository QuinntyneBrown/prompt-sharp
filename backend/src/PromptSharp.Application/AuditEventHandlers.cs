using MediatR;
using Microsoft.EntityFrameworkCore;

namespace PromptSharp.Application.Features;

internal sealed class AuditEventHandlers(IPromptSharpDbContext dbContext) :
    IRequestHandler<ListAuditEventsQuery, IReadOnlyList<AuditEventDto>>
{
    public async Task<IReadOnlyList<AuditEventDto>> Handle(ListAuditEventsQuery request, CancellationToken cancellationToken)
    {
        var query = dbContext.AuditEvents.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Actor))
        {
            query = query.Where(auditEvent => auditEvent.Actor.Contains(request.Actor));
        }

        if (!string.IsNullOrWhiteSpace(request.Action))
        {
            query = query.Where(auditEvent => auditEvent.Action == request.Action);
        }

        return await query
            .OrderByDescending(auditEvent => auditEvent.ChangedAt)
            .Take(100)
            .Select(auditEvent => new AuditEventDto(
                auditEvent.Id,
                auditEvent.Actor,
                auditEvent.Action,
                auditEvent.TargetType,
                auditEvent.TargetId,
                auditEvent.TargetName,
                auditEvent.Before,
                auditEvent.After,
                auditEvent.ChangedAt))
            .ToArrayAsync(cancellationToken);
    }
}
