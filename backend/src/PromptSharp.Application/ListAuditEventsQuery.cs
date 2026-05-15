using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record ListAuditEventsQuery(string? Actor = null, string? Action = null) : IQuery<IReadOnlyList<AuditEventDto>>;
