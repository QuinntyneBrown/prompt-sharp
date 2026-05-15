using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application;
using PromptSharp.Application.Features;

namespace PromptSharp.Api.Controllers;

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

    [HttpGet("invitations")]
    public Task<IReadOnlyList<UserInvitationDto>> GetInvitations(CancellationToken cancellationToken)
    {
        return sender.Send(new ListUserInvitationsQuery(), cancellationToken);
    }

    [HttpPost("invitations")]
    public Task<UserInvitationDto> Invite(UserInvitationInputDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new InviteUserCommand(input), cancellationToken);
    }

    [HttpPut("{id:guid}/roles")]
    public Task<UserDto> UpdateRoles(Guid id, UserRolesUpsertDto input, CancellationToken cancellationToken)
    {
        return sender.Send(new UpdateUserRolesCommand(id, input), cancellationToken);
    }
}
