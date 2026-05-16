using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Domain.Entities;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Infrastructure.Services;

public sealed class DatabaseSeeder(
    PromptSharpDbContext dbContext,
    IPasswordService passwordService,
    IDateTimeProvider dateTimeProvider) : IDatabaseSeeder
{
    public async Task SeedDevelopmentDataAsync(CancellationToken cancellationToken)
    {
        const string email = "dev@promptsharp.local";
        var normalizedEmail = email.ToUpperInvariant();

        if (await dbContext.Users.AnyAsync(user => user.NormalizedEmail == normalizedEmail, cancellationToken))
        {
            return;
        }

        var nowUtc = dateTimeProvider.UtcNow;
        var user = User.Create(email, "PromptSharp Dev", "password-hash-pending", nowUtc);
        user.UpdatePasswordHash(passwordService.HashPassword(user, "PromptSharp123!"));

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
