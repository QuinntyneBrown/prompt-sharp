using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PromptSharp.Application;
using PromptSharp.Application.Features;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Authorize(Policy = "RequireAdmin")]
[Route("api/v1/admin/dashboard")]
public sealed class AdminDashboardController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<AdminDashboardDto> Get(CancellationToken cancellationToken)
    {
        return sender.Send(new GetAdminDashboardQuery(), cancellationToken);
    }
}
