using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application;
using PromptSharp.Application.Features;
using PromptSharp.Domain;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Route("api/v1/tutorials")]
[EnableRateLimiting("public")]
public sealed class TutorialsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public Task<PagedResult<TutorialListItemDto>> GetTutorials(
        [FromQuery] string? category,
        [FromQuery] string? tag,
        [FromQuery] DifficultyLevel? difficulty,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sort = null,
        CancellationToken cancellationToken = default)
    {
        return sender.Send(new GetTutorialsQuery(category, tag, difficulty, page, pageSize, sort), cancellationToken);
    }

    [HttpGet("featured")]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public Task<IReadOnlyList<TutorialListItemDto>> GetFeatured(CancellationToken cancellationToken)
    {
        return sender.Send(new GetFeaturedTutorialsQuery(), cancellationToken);
    }

    [HttpGet("editors-pick")]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public Task<TutorialListItemDto?> GetEditorsPick(CancellationToken cancellationToken)
    {
        return sender.Send(new GetEditorsPickQuery(), cancellationToken);
    }

    [HttpGet("{slug}")]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public Task<TutorialDetailDto> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        return sender.Send(new GetTutorialBySlugQuery(slug), cancellationToken);
    }
}
