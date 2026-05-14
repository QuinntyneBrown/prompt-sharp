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
[Route("api/v1/admin/tutorials")]
public sealed class AdminTutorialsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<PagedResult<TutorialListItemDto>> GetTutorials([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, CancellationToken cancellationToken = default)
    {
        return sender.Send(new ListAdminTutorialsQuery(page, pageSize, search), cancellationToken);
    }

    [HttpPost]
    public async Task<ActionResult<TutorialDetailDto>> Create(TutorialUpsertDto input, CancellationToken cancellationToken)
    {
        var tutorial = await sender.Send(new CreateTutorialCommand(input), cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = tutorial.Id }, tutorial);
    }

    [HttpGet("{id:guid}")]
    public Task<TutorialDetailDto> Get(Guid id, CancellationToken cancellationToken)
    {
        return sender.Send(new GetAdminTutorialQuery(id), cancellationToken);
    }

    [HttpPut("{id:guid}")]
    public Task<TutorialDetailDto> Update(Guid id, TutorialUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new UpdateTutorialCommand(id, input), cancellationToken);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteTutorialCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/publish")]
    public Task<TutorialDetailDto> Publish(Guid id, CancellationToken cancellationToken)
    {
        return sender.Send(new PublishTutorialCommand(id), cancellationToken);
    }

    [HttpPost("{id:guid}/feature")]
    public Task<TutorialDetailDto> Feature(Guid id, CancellationToken cancellationToken)
    {
        return sender.Send(new FeatureTutorialCommand(id), cancellationToken);
    }

    [HttpPost("{id:guid}/editors-pick")]
    [Authorize(Policy = "RequireAdmin")]
    public Task<TutorialDetailDto> EditorsPick(Guid id, CancellationToken cancellationToken)
    {
        return sender.Send(new SetEditorsPickCommand(id), cancellationToken);
    }

    [HttpPut("{id:guid}/steps")]
    public Task<TutorialDetailDto> ReplaceSteps(Guid id, IReadOnlyList<TutorialStepUpsertDto> steps, CancellationToken cancellationToken)
    {
        return sender.Send(new ReplaceTutorialStepsCommand(id, steps), cancellationToken);
    }
}

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

[ApiController]
[Authorize(Policy = "RequireAdmin")]
[EnableRateLimiting("writes")]
[Route("api/v1/admin/users")]
public sealed class AdminUsersController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<UserDto>> Get(CancellationToken cancellationToken)
    {
        return sender.Send(new ListUsersQuery(), cancellationToken);
    }

    [HttpPut("{id:guid}/roles")]
    public Task<UserDto> UpdateRoles(Guid id, UserRolesUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new UpdateUserRolesCommand(id, input), cancellationToken);
    }
}
