using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Api.Controllers;

[ApiController]
public sealed class HealthController(PromptSharpDbContext dbContext) : ControllerBase
{
    [HttpGet("/health/live")]
    public IActionResult Live()
    {
        return Ok(new { status = "Healthy" });
    }

    [HttpGet("/health/ready")]
    public async Task<IActionResult> Ready(CancellationToken cancellationToken)
    {
        return await dbContext.Database.CanConnectAsync(cancellationToken)
            ? Ok(new { status = "Healthy" })
            : StatusCode(StatusCodes.Status503ServiceUnavailable, new { status = "Unhealthy" });
    }
}
