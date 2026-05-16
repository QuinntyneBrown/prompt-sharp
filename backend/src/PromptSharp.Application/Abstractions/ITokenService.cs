using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Abstractions;

public interface ITokenService
{
    TokenIssueResult CreateAccessToken(User user);

    RefreshTokenIssueResult CreateRefreshToken();

    string HashRefreshToken(string refreshToken);
}
