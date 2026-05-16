using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Account;

public sealed class DeleteAccountCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IPasswordService passwordService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<DeleteAccountCommand>
{
    public async Task Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var user = await dbContext.Users.SingleOrDefaultAsync(candidate => candidate.Id == userId, cancellationToken)
            ?? throw new NotFoundException("Account was not found.");

        if (!passwordService.VerifyPassword(user, request.CurrentPassword))
        {
            throw new AuthenticationFailedException("Current password is invalid.");
        }

        var nowUtc = dateTimeProvider.UtcNow;
        user.Delete(nowUtc);

        var refreshTokens = await dbContext.RefreshTokens
            .Where(token => token.UserId == user.Id && token.RevokedAtUtc == null)
            .ToListAsync(cancellationToken);

        foreach (var refreshToken in refreshTokens)
        {
            refreshToken.Revoke(nowUtc);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
