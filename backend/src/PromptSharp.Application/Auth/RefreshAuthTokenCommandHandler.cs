using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Account;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Auth;

public sealed class RefreshAuthTokenCommandHandler(
    IPromptSharpDbContext dbContext,
    ITokenService tokenService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<RefreshAuthTokenCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(RefreshAuthTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenHash = tokenService.HashRefreshToken(request.RefreshToken);
        var existingToken = await dbContext.RefreshTokens
            .Include(token => token.User)
            .SingleOrDefaultAsync(token => token.TokenHash == tokenHash, cancellationToken);

        var nowUtc = dateTimeProvider.UtcNow;
        if (existingToken is null || existingToken.User is null || !existingToken.CanBeUsed(nowUtc) || !existingToken.User.CanSignIn())
        {
            throw new AuthenticationFailedException("Refresh token is invalid.");
        }

        existingToken.Revoke(nowUtc);
        var newRefreshToken = tokenService.CreateRefreshToken();
        dbContext.RefreshTokens.Add(RefreshToken.Create(
            existingToken.UserId,
            tokenService.HashRefreshToken(newRefreshToken.Token),
            nowUtc,
            newRefreshToken.ExpiresAtUtc,
            request.UserAgent,
            request.IpAddress));

        await dbContext.SaveChangesAsync(cancellationToken);

        var accessToken = tokenService.CreateAccessToken(existingToken.User);
        var userDto = await AccountDtoFactory.CreateAsync(existingToken.User, dbContext, nowUtc, cancellationToken);
        return AuthMappings.ToAuthResponse(accessToken.AccessToken, accessToken.ExpiresAtUtc, newRefreshToken.Token, userDto);
    }
}
