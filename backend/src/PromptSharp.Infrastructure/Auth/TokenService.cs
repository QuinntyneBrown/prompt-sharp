using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PromptSharp.Application.Abstractions;
using PromptSharp.Domain.Entities;
using PromptSharp.Infrastructure.Options;

namespace PromptSharp.Infrastructure.Auth;

public sealed class TokenService(IOptions<JwtOptions> options, IDateTimeProvider dateTimeProvider) : ITokenService
{
    public TokenIssueResult CreateAccessToken(User user)
    {
        var jwtOptions = options.Value;
        if (string.IsNullOrWhiteSpace(jwtOptions.SigningKey) || jwtOptions.SigningKey.Length < 32)
        {
            throw new InvalidOperationException("Jwt:SigningKey must be at least 32 characters.");
        }

        var expiresAtUtc = dateTimeProvider.UtcNow.AddMinutes(jwtOptions.AccessTokenMinutes);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name, user.DisplayName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey));
        var token = new JwtSecurityToken(
            jwtOptions.Issuer,
            jwtOptions.Audience,
            claims,
            notBefore: dateTimeProvider.UtcNow.UtcDateTime,
            expires: expiresAtUtc.UtcDateTime,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new TokenIssueResult(new JwtSecurityTokenHandler().WriteToken(token), expiresAtUtc);
    }

    public RefreshTokenIssueResult CreateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        var token = Convert.ToBase64String(bytes);
        return new RefreshTokenIssueResult(token, dateTimeProvider.UtcNow.AddDays(options.Value.RefreshTokenDays));
    }

    public string HashRefreshToken(string refreshToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken));
        return Convert.ToHexString(bytes);
    }
}
