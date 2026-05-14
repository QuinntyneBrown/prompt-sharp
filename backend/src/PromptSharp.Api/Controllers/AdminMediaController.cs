using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application;
using PromptSharp.Application.Features;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Authorize(Policy = "RequireEditor")]
[EnableRateLimiting("writes")]
[Route("api/v1/admin/media")]
public sealed class AdminMediaController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<MediaDto>> Get(CancellationToken cancellationToken)
    {
        return sender.Send(new ListMediaQuery(), cancellationToken);
    }

    [HttpPost]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<MediaDto> Upload(IFormFile file, CancellationToken cancellationToken)
    {
        await using var stream = file.OpenReadStream();
        return await sender.Send(new UploadMediaCommand(file.FileName, file.ContentType, file.Length, stream), cancellationToken);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteMediaCommand(id), cancellationToken);
        return NoContent();
    }
}
