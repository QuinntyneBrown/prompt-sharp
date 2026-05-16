using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PromptSharp.Application.Abstractions;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Api.IntegrationTests.Support;

public sealed class PromptSharpApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly IAiPromptPlanner _planner;
    private readonly string _databaseName;

    public PromptSharpApiFactory()
        : this(new FakeApiPromptPlanner(GeneratedPlanJson.Value))
    {
    }

    internal PromptSharpApiFactory(IAiPromptPlanner planner)
    {
        _planner = planner;
        _databaseName = $"PromptSharpApiTests_{Guid.NewGuid():N}";
        ConnectionString = $"Server=localhost\\SQLEXPRESS;Database={_databaseName};Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True";
    }

    public string ConnectionString { get; }

    public async Task InitializeAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
        await dbContext.Database.MigrateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration(configuration =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:PromptSharp"] = ConnectionString,
                ["Jwt:Issuer"] = "PromptSharp",
                ["Jwt:Audience"] = "PromptSharp.Web",
                ["Jwt:SigningKey"] = "development-only-signing-key-change-before-use",
                ["Jwt:AccessTokenMinutes"] = "15",
                ["Jwt:RefreshTokenDays"] = "30",
                ["AzureOpenAi:DeploymentName"] = "test-deployment"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<PromptSharpDbContext>>();
            services.RemoveAll<IAiPromptPlanner>();
            services.AddDbContext<PromptSharpDbContext>(options => options.UseSqlServer(ConnectionString));
            services.AddSingleton(_planner);
        });
    }
}
