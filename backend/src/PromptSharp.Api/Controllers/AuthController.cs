using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptSharp.Application.Auth;

namespace PromptSharp.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
[EnableRateLimiting("auth")]
public sealed class AuthController(ISender sender) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto request, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new RegisterUserCommand(
            request.Email,
            request.Password,
            request.DisplayName,
            Request.Headers.UserAgent.ToString(),
            HttpContext.Connection.RemoteIpAddress?.ToString()), cancellationToken);

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto request, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new LoginUserCommand(
            request.Email,
            request.Password,
            Request.Headers.UserAgent.ToString(),
            HttpContext.Connection.RemoteIpAddress?.ToString()), cancellationToken);

        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> Refresh(RefreshTokenRequestDto request, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new RefreshAuthTokenCommand(
            request.RefreshToken,
            Request.Headers.UserAgent.ToString(),
            HttpContext.Connection.RemoteIpAddress?.ToString()), cancellationToken);

        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(LogoutRequestDto request, CancellationToken cancellationToken)
    {
        await sender.Send(new LogoutUserCommand(request.RefreshToken), cancellationToken);
        return NoContent();
    }
}
