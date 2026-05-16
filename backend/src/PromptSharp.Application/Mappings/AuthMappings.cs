using PromptSharp.Application.Account;
using PromptSharp.Application.Auth;

namespace PromptSharp.Application.Mappings;

public static class AuthMappings
{
    public static AuthResponseDto ToAuthResponse(
        string accessToken,
        DateTimeOffset accessTokenExpiresAtUtc,
        string refreshToken,
        UserDto user)
    {
        return new AuthResponseDto(accessToken, accessTokenExpiresAtUtc, refreshToken, user);
    }
}
