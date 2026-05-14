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
[Route("api/v1/admin/categories")]
public sealed class AdminCategoriesController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<CategoryDto>> Get(CancellationToken cancellationToken)
    {
        return sender.Send(new ListAdminCategoriesQuery(), cancellationToken);
    }

    [HttpPost]
    public Task<CategoryDto> Create(CategoryUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new CreateCategoryCommand(input), cancellationToken);
    }

    [HttpPut("{id:guid}")]
    public Task<CategoryDto> Update(Guid id, CategoryUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new UpdateCategoryCommand(id, input), cancellationToken);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteCategoryCommand(id), cancellationToken);
        return NoContent();
    }
}
