using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PromptSharp.Application;
using PromptSharp.Application.Abstractions;
using PromptSharp.Infrastructure;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Application.Tests.Support;

public sealed class ApplicationTestHost : IAsyncDisposable
{
    private ApplicationTestHost(ServiceProvider serviceProvider, string connectionString)
    {
        Services = serviceProvider;
        ConnectionString = connectionString;
    }

    public ServiceProvider Services { get; }

    public string ConnectionString { get; }

    public static async Task<ApplicationTestHost> CreateAsync(
        ICurrentUser? currentUser = null,
        IAiPromptPlanner? planner = null)
    {
        var databaseName = $"PromptSharpAppTests_{Guid.NewGuid():N}";
        var connectionString = $"Server=localhost\\SQLEXPRESS;Database={databaseName};Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True";

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:PromptSharp"] = connectionString,
                ["Jwt:Issuer"] = "PromptSharp",
                ["Jwt:Audience"] = "PromptSharp.Web",
                ["Jwt:SigningKey"] = "test-signing-key-with-enough-length-12345",
                ["Jwt:AccessTokenMinutes"] = "15",
                ["Jwt:RefreshTokenDays"] = "30",
                ["AzureOpenAi:DeploymentName"] = "test-deployment"
            })
            .Build();

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddHttpContextAccessor();
        services.AddApplication();
        services.AddInfrastructure(configuration);

        if (currentUser is not null)
        {
            services.AddSingleton(currentUser);
        }

        if (planner is not null)
        {
            services.AddSingleton(planner);
        }

        var serviceProvider = services.BuildServiceProvider();
        await using var scope = serviceProvider.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
        await dbContext.Database.MigrateAsync();

        return new ApplicationTestHost(serviceProvider, connectionString);
    }

    public async ValueTask DisposeAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
        await Services.DisposeAsync();
    }
}
