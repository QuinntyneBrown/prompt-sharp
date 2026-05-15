using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PromptSharp.Application;
using PromptSharp.Application.Features;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Authorize(Policy = "RequireAdmin")]
[Route("api/v1/admin/audit-log")]
public sealed class AdminAuditLogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<AuditEventDto>> Get(
        [FromQuery] string? actor = null,
        [FromQuery] string? action = null,
        CancellationToken cancellationToken = default)
    {
        return sender.Send(new ListAuditEventsQuery(actor, action), cancellationToken);
    }
}
