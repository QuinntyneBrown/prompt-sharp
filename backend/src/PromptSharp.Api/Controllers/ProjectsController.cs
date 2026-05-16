using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application.Projects;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Route("api/v1")]
public sealed class ProjectsController(ISender sender) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("suggestions")]
    public async Task<ActionResult<IReadOnlyList<SuggestionDto>>> Suggestions(CancellationToken cancellationToken)
    {
        return Ok(await sender.Send(new GetSuggestionsQuery(), cancellationToken));
    }

    [Authorize]
    [HttpGet("projects")]
    public async Task<ActionResult<ProjectListResponseDto>> List(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        return Ok(await sender.Send(new ListProjectsQuery(search, status, page, pageSize), cancellationToken));
    }

    [Authorize]
    [HttpPost("projects")]
    [EnableRateLimiting("project-create")]
    public async Task<ActionResult<ProjectSummaryDto>> Create(CreateProjectRequestDto request, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new CreateProjectCommand(request.Idea), cancellationToken);
        return CreatedAtAction(nameof(Get), new { projectNumber = response.Id }, response);
    }

    [Authorize]
    [HttpGet("projects/{projectNumber:int}")]
    public async Task<ActionResult<ProjectDto>> Get(int projectNumber, CancellationToken cancellationToken)
    {
        return Ok(await sender.Send(new GetProjectQuery(projectNumber), cancellationToken));
    }

    [Authorize]
    [HttpGet("projects/{projectNumber:int}/download")]
    public async Task<IActionResult> Download(int projectNumber, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetProjectDownloadQuery(projectNumber), cancellationToken);
        return File(System.Text.Encoding.UTF8.GetBytes(response.Content), response.ContentType, response.FileName);
    }

    [Authorize]
    [HttpPatch("projects/{projectNumber:int}/status")]
    public async Task<ActionResult<ProjectDto>> UpdateStatus(
        int projectNumber,
        UpdateProjectStatusRequestDto request,
        CancellationToken cancellationToken)
    {
        return Ok(await sender.Send(new UpdateProjectStatusCommand(projectNumber, request.Status), cancellationToken));
    }

    [Authorize]
    [HttpDelete("projects/{projectNumber:int}")]
    public async Task<IActionResult> Delete(int projectNumber, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteProjectCommand(projectNumber), cancellationToken);
        return NoContent();
    }
}
