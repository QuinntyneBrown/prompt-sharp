using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Account;

public sealed class GetAccountQueryHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<GetAccountQuery, UserDto>
{
    public async Task<UserDto> Handle(GetAccountQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var user = await dbContext.Users.SingleOrDefaultAsync(candidate => candidate.Id == userId, cancellationToken)
            ?? throw new NotFoundException("Account was not found.");

        return await AccountDtoFactory.CreateAsync(user, dbContext, dateTimeProvider.UtcNow, cancellationToken);
    }
}
