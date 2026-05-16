using PromptSharp.Application.Account;

namespace PromptSharp.Application.Auth;

public sealed record AuthResponseDto(
    string AccessToken,
    DateTimeOffset AccessTokenExpiresAtUtc,
    string RefreshToken,
    UserDto User);
