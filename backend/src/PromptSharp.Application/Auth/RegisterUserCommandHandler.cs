using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Account;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Auth;

public sealed class RegisterUserCommandHandler(
    IPromptSharpDbContext dbContext,
    IPasswordService passwordService,
    ITokenService tokenService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<RegisterUserCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var emailExists = await dbContext.Users.AnyAsync(
            user => user.NormalizedEmail == normalizedEmail && user.DeletedAtUtc == null,
            cancellationToken);

        if (emailExists)
        {
            throw new ConflictException("An account already exists for that email address.");
        }

        var nowUtc = dateTimeProvider.UtcNow;
        var user = User.Create(request.Email, request.DisplayName, "password-hash-pending", nowUtc);
        user.UpdatePasswordHash(passwordService.HashPassword(user, request.Password));
        user.MarkSignedIn(nowUtc, request.UserAgent);

        var refreshToken = tokenService.CreateRefreshToken();
        dbContext.Users.Add(user);
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
