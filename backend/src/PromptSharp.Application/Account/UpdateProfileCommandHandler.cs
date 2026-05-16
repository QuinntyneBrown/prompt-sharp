using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Account;

public sealed class UpdateProfileCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<UpdateProfileCommand, UserDto>
{
    public async Task<UserDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var user = await dbContext.Users.SingleOrDefaultAsync(candidate => candidate.Id == userId, cancellationToken)
            ?? throw new NotFoundException("Account was not found.");

        user.UpdateProfile(request.DisplayName);
        await dbContext.SaveChangesAsync(cancellationToken);

        return await AccountDtoFactory.CreateAsync(user, dbContext, dateTimeProvider.UtcNow, cancellationToken);
    }
}
