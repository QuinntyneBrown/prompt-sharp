using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application;
using PromptSharp.Application.Features;
using PromptSharp.Domain;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Route("api/v1/tags")]
[EnableRateLimiting("public")]
public sealed class TagsController(ISender sender) : ControllerBase
{
    [HttpGet("{slug}/tutorials")]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public Task<PagedResult<TutorialListItemDto>> GetTutorials(string slug, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
    {
        return sender.Send(new GetTagTutorialsQuery(slug, page, pageSize), cancellationToken);
    }
}
