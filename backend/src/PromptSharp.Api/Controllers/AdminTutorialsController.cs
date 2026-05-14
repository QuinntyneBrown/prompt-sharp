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
