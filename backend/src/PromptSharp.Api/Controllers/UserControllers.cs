using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application;
using PromptSharp.Application.Features;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Authorize(Policy = "RequireUser")]
[Route("api/v1/me")]
public sealed class MeController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<UserDto> GetMe(CancellationToken cancellationToken)
    {
        return sender.Send(new GetMeQuery(), cancellationToken);
    }

    [HttpGet("bookmarks")]
    public Task<IReadOnlyList<BookmarkDto>> GetBookmarks(CancellationToken cancellationToken)
    {
        return sender.Send(new GetBookmarksQuery(), cancellationToken);
    }

    [HttpPost("bookmarks/{tutorialId:guid}")]
    [EnableRateLimiting("writes")]
    public async Task<IActionResult> AddBookmark(Guid tutorialId, CancellationToken cancellationToken)
    {
        await sender.Send(new AddBookmarkCommand(tutorialId), cancellationToken);
        return NoContent();
    }

    [HttpDelete("bookmarks/{tutorialId:guid}")]
    [EnableRateLimiting("writes")]
    public async Task<IActionResult> DeleteBookmark(Guid tutorialId, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteBookmarkCommand(tutorialId), cancellationToken);
        return NoContent();
    }

    [HttpGet("progress/{tutorialId:guid}")]
    public Task<TutorialProgressDto> GetProgress(Guid tutorialId, CancellationToken cancellationToken)
    {
        return sender.Send(new GetProgressQuery(tutorialId), cancellationToken);
    }

    [HttpPut("progress/{tutorialId:guid}")]
    [EnableRateLimiting("writes")]
    public Task<TutorialProgressDto> PutProgress(Guid tutorialId, ProgressUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new PutProgressCommand(tutorialId, input), cancellationToken);
    }
}
