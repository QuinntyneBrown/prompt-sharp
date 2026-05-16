using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Account;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Auth;

public sealed class LoginUserCommandHandler(
    IPromptSharpDbContext dbContext,
    IPasswordService passwordService,
    ITokenService tokenService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<LoginUserCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var user = await dbContext.Users.SingleOrDefaultAsync(
            candidate => candidate.NormalizedEmail == normalizedEmail,
            cancellationToken);

        if (user is null || !user.CanSignIn() || !passwordService.VerifyPassword(user, request.Password))
        {
            throw new AuthenticationFailedException("Invalid email or password.");
        }

        var nowUtc = dateTimeProvider.UtcNow;
        user.MarkSignedIn(nowUtc, request.UserAgent);

        var refreshToken = tokenService.CreateRefreshToken();
        dbContext.RefreshTokens.Add(RefreshToken.Create(
            user.Id,
            tokenService.HashRefreshToken(refreshToken.Token),
            nowUtc,
            refreshToken.ExpiresAtUtc,
            request.UserAgent,
            request.IpAddress));

        await dbContext.SaveChangesAsync(cancellationToken);

        var accessToken = tokenService.CreateAccessToken(user);
        var userDto = await AccountDtoFactory.CreateAsync(user, dbContext, nowUtc, cancellationToken);
        return AuthMappings.ToAuthResponse(accessToken.AccessToken, accessToken.ExpiresAtUtc, refreshToken.Token, userDto);
    }
}
