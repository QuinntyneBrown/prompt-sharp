using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Auth;

public sealed record LoginUserCommand(
    string Email,
    string Password,
    string? UserAgent,
    string? IpAddress) : ICommand<AuthResponseDto>;
