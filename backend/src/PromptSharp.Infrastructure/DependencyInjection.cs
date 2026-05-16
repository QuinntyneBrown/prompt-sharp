using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PromptSharp.Application.Abstractions;
using PromptSharp.Infrastructure.Ai;
using PromptSharp.Infrastructure.Auth;
using PromptSharp.Infrastructure.Options;
using PromptSharp.Infrastructure.Persistence;
using PromptSharp.Infrastructure.Services;
using PromptSharp.Infrastructure.Skills;

namespace PromptSharp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.Configure<AzureOpenAiOptions>(configuration.GetSection("AzureOpenAi"));
        services.Configure<AgentSkillOptions>(configuration.GetSection("AgentSkills"));

        services.AddDbContext<PromptSharpDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("PromptSharp")));

        services.AddScoped<IPromptSharpDbContext>(provider => provider.GetRequiredService<PromptSharpDbContext>());
        services.AddScoped<ITransactionRunner, EfCoreTransactionRunner>();
        services.AddScoped<IDateTimeProvider, SystemDateTimeProvider>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICurrentUser, HttpCurrentUser>();
        services.AddScoped<IAgentSkillCatalog, FileAgentSkillCatalog>();
        services.AddScoped<IAiPromptPlanner, AzureOpenAiPromptPlanner>();
        services.AddScoped<IAzureDeploymentNameProvider, ConfiguredAzureDeploymentNameProvider>();
        services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

        return services;
    }
}
