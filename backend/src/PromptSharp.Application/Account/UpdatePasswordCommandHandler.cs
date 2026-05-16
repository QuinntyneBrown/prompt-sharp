using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Account;

public sealed class UpdatePasswordCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IPasswordService passwordService) : IRequestHandler<UpdatePasswordCommand>
{
    public async Task Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var user = await dbContext.Users.SingleOrDefaultAsync(candidate => candidate.Id == userId, cancellationToken)
            ?? throw new NotFoundException("Account was not found.");

        if (!passwordService.VerifyPassword(user, request.CurrentPassword))
        {
            throw new AuthenticationFailedException("Current password is invalid.");
        }

        user.UpdatePasswordHash(passwordService.HashPassword(user, request.NewPassword));
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
