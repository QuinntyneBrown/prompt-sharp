using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Auth;

public sealed record RefreshAuthTokenCommand(
    string RefreshToken,
    string? UserAgent,
    string? IpAddress) : ICommand<AuthResponseDto>;
