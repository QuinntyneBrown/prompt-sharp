using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PromptSharp.Application.Generation;
using System.Security.Claims;

namespace PromptSharp.Api.Hubs;

[Authorize]
public sealed class ProjectGenerationHub(ISender sender) : Hub
{
    public IAsyncEnumerable<ProjectGenerationUpdateDto> StreamProjectGeneration(
        string projectNumber,
        CancellationToken cancellationToken)
    {
        if (!int.TryParse(projectNumber, out var parsedProjectNumber) || parsedProjectNumber < 1)
        {
            throw new HubException("Project number is invalid.");
        }

        var sub = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? Context.User?.FindFirstValue("sub");
        if (!Guid.TryParse(sub, out var userId))
        {
            throw new HubException("Authenticated user id is missing.");
        }

        return sender.CreateStream(new GenerateProjectPlanStreamCommand(parsedProjectNumber, userId), cancellationToken);
    }
}
