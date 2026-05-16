using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Auth;

public sealed record RegisterUserCommand(
    string Email,
    string Password,
    string DisplayName,
    string? UserAgent,
    string? IpAddress) : ICommand<AuthResponseDto>;
