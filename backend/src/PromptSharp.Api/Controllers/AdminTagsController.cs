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
[Route("api/v1/admin/tags")]
public sealed class AdminTagsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<TagDto>> Get(CancellationToken cancellationToken)
    {
        return sender.Send(new ListAdminTagsQuery(), cancellationToken);
    }

    [HttpPost]
    public Task<TagDto> Create(TagUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new CreateTagCommand(input), cancellationToken);
    }

    [HttpPut("{id:guid}")]
    public Task<TagDto> Update(Guid id, TagUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new UpdateTagCommand(id, input), cancellationToken);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteTagCommand(id), cancellationToken);
        return NoContent();
    }
}
