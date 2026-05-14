using System.Security.Claims;
using System.Text;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using PromptSharp.Application;
using PromptSharp.Domain;

namespace PromptSharp.Infrastructure.Services;

public sealed class DatabaseSeeder(
    PromptSharpDbContext dbContext,
    IOptions<AppSettingsOptions> options,
    TimeProvider timeProvider) : IDatabaseSeeder
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        foreach (var roleName in RoleNames.All)
        {
            if (!await dbContext.Roles.AnyAsync(role => role.Name == roleName, cancellationToken))
            {
                dbContext.Roles.Add(new Role(Guid.NewGuid(), roleName));
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        await SeedBootstrapAdmin(cancellationToken);
    }

    private async Task SeedBootstrapAdmin(CancellationToken cancellationToken)
    {
        var email = options.Value.BootstrapAdminEmail?.Trim();
        if (string.IsNullOrWhiteSpace(email))
        {
            return;
        }

        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .SingleOrDefaultAsync(entity => entity.Email == email, cancellationToken);

        if (user is null)
        {
            user = User.Create($"bootstrap:{email}", email, "Bootstrap Admin", null, timeProvider.GetUtcNow());
            dbContext.Users.Add(user);
        }

        var roleIds = await dbContext.Roles
            .Where(role => RoleNames.All.Contains(role.Name))
            .Select(role => role.Id)
            .ToArrayAsync(cancellationToken);

        user.ReplaceRoles(roleIds);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
