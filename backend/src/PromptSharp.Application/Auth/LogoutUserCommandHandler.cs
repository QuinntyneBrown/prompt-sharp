using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Auth;

public sealed class LogoutUserCommandHandler(
    IPromptSharpDbContext dbContext,
    ITokenService tokenService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<LogoutUserCommand>
{
    public async Task Handle(LogoutUserCommand request, CancellationToken cancellationToken)
    {
        var tokenHash = tokenService.HashRefreshToken(request.RefreshToken);
        var token = await dbContext.RefreshTokens
            .SingleOrDefaultAsync(candidate => candidate.TokenHash == tokenHash, cancellationToken);

        token?.Revoke(dateTimeProvider.UtcNow);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
