using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PromptSharp.Domain;
using PromptSharp.Infrastructure;
using Testcontainers.MsSql;

namespace PromptSharp.Api.IntegrationTests;

public sealed class PromptSharpApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly MsSqlContainer? _container = TestEnvironment.RunTestcontainers
        ? new MsSqlBuilder("mcr.microsoft.com/mssql/server:2022-latest")
            .WithPassword("PromptSharp_test_2026!")
            .Build()
        : null;

    public bool IsEnabled => _container is not null;

    public async Task InitializeAsync()
    {
        if (_container is not null)
        {
            await _container.StartAsync();
        }
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        if (_container is not null)
        {
            await _container.DisposeAsync();
        }

        await base.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        if (_container is null)
        {
            return;
        }

        builder.UseEnvironment("Development");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<PromptSharpDbContext>>();
            services.AddDbContext<PromptSharpDbContext>(options => options.UseSqlServer(_container.GetConnectionString()));
            services.AddAuthentication(TestAuthHandler.AuthenticationScheme)
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.AuthenticationScheme, _ => { });
            services.PostConfigure<AuthenticationOptions>(options =>
            {
                options.DefaultAuthenticateScheme = TestAuthHandler.AuthenticationScheme;
                options.DefaultChallengeScheme = TestAuthHandler.AuthenticationScheme;
                options.DefaultForbidScheme = TestAuthHandler.AuthenticationScheme;
            });
        });
    }

    public async Task SeedUserAsync(string subject, params string[] roles)
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        foreach (var roleName in RoleNames.All)
        {
            if (!await dbContext.Roles.AnyAsync(role => role.Name == roleName))
            {
                dbContext.Roles.Add(new Role(Guid.NewGuid(), roleName));
            }
        }

        await dbContext.SaveChangesAsync();
        var roleIds = await dbContext.Roles.Where(role => roles.Contains(role.Name)).Select(role => role.Id).ToArrayAsync();
        var user = User.Create(subject, $"{subject}@promptsharp.local", subject, null, DateTimeOffset.UtcNow);
        user.ReplaceRoles(roleIds);
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
    }
}
