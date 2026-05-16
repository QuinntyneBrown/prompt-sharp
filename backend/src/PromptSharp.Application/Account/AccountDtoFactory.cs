using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Mappings;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Account;

internal static class AccountDtoFactory
{
    public static async Task<UserDto> CreateAsync(
        User user,
        IPromptSharpDbContext dbContext,
        DateTimeOffset nowUtc,
        CancellationToken cancellationToken)
    {
        var monthStart = new DateTimeOffset(nowUtc.Year, nowUtc.Month, 1, 0, 0, 0, TimeSpan.Zero);
        var projectsUsed = await dbContext.Projects
            .CountAsync(project => project.UserId == user.Id && project.CreatedAtUtc >= monthStart, cancellationToken);

        return user.ToUserDto(projectsUsed, nowUtc);
    }
}
