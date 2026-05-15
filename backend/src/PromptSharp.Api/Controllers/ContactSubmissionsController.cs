using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Route("api/v1/contact-submissions")]
[EnableRateLimiting("writes")]
public sealed class ContactSubmissionsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ContactSubmissionDto>> Submit(
        ContactSubmissionInputDto input,
        CancellationToken cancellationToken)
    {
        var submission = await sender.Send(new SubmitContactSubmissionCommand(input), cancellationToken);
        return CreatedAtAction(nameof(Submit), new { id = submission.Id }, submission);
    }
}
