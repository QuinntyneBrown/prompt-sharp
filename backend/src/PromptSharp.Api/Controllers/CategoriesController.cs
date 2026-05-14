using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application;
using PromptSharp.Application.Features;
using PromptSharp.Domain;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Route("api/v1/categories")]
[EnableRateLimiting("public")]
public sealed class CategoriesController(ISender sender) : ControllerBase
{
    [HttpGet]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public Task<IReadOnlyList<CategoryDto>> GetCategories(CancellationToken cancellationToken)
    {
        return sender.Send(new GetCategoriesQuery(), cancellationToken);
    }

    [HttpGet("{slug}/tutorials")]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public Task<PagedResult<TutorialListItemDto>> GetTutorials(string slug, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
    {
        return sender.Send(new GetCategoryTutorialsQuery(slug, page, pageSize), cancellationToken);
    }
}
