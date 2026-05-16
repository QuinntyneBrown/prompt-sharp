using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PromptSharp.Application.Account;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/account")]
public sealed class AccountController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<UserDto>> Get(CancellationToken cancellationToken)
    {
        return Ok(await sender.Send(new GetAccountQuery(), cancellationToken));
    }

    [HttpPatch("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile(UpdateProfileRequestDto request, CancellationToken cancellationToken)
    {
        return Ok(await sender.Send(new UpdateProfileCommand(request.DisplayName), cancellationToken));
    }

    [HttpPatch("email")]
    public async Task<ActionResult<UserDto>> UpdateEmail(UpdateEmailRequestDto request, CancellationToken cancellationToken)
    {
        return Ok(await sender.Send(new UpdateEmailCommand(request.Email, request.CurrentPassword), cancellationToken));
    }

    [HttpPatch("password")]
    public async Task<IActionResult> UpdatePassword(UpdatePasswordRequestDto request, CancellationToken cancellationToken)
    {
        await sender.Send(new UpdatePasswordCommand(request.CurrentPassword, request.NewPassword), cancellationToken);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(DeleteAccountRequestDto request, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteAccountCommand(request.CurrentPassword), cancellationToken);
        return NoContent();
    }
}
