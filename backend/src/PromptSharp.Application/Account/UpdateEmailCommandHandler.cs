using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Account;

public sealed class UpdateEmailCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IPasswordService passwordService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<UpdateEmailCommand, UserDto>
{
    public async Task<UserDto> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var user = await dbContext.Users.SingleOrDefaultAsync(candidate => candidate.Id == userId, cancellationToken)
            ?? throw new NotFoundException("Account was not found.");

        if (!passwordService.VerifyPassword(user, request.CurrentPassword))
        {
            throw new AuthenticationFailedException("Current password is invalid.");
        }

        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var emailExists = await dbContext.Users.AnyAsync(
            candidate => candidate.Id != user.Id && candidate.NormalizedEmail == normalizedEmail && candidate.DeletedAtUtc == null,
            cancellationToken);

        if (emailExists)
        {
            throw new ConflictException("An account already exists for that email address.");
        }

        user.UpdateEmail(request.Email);
        await dbContext.SaveChangesAsync(cancellationToken);

        return await AccountDtoFactory.CreateAsync(user, dbContext, dateTimeProvider.UtcNow, cancellationToken);
    }
}
