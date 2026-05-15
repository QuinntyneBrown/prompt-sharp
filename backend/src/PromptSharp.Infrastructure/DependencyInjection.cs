using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PromptSharp.Application;
using PromptSharp.Infrastructure.Services;

namespace PromptSharp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AppSettingsOptions>(configuration.GetSection(AppSettingsOptions.SectionName));

        services.AddDbContext<PromptSharpDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("PromptSharpDb");
            options.UseSqlServer(connectionString, sqlServerOptions => sqlServerOptions.EnableRetryOnFailure());
        });

        services.AddScoped<IPromptSharpDbContext>(provider => provider.GetRequiredService<PromptSharpDbContext>());
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, HttpCurrentUser>();
        services.AddScoped<IClaimsTransformation, DatabaseClaimsTransformation>();
        services.AddScoped<IMediaStore>(provider =>
        {
            var options = provider.GetRequiredService<IOptions<AppSettingsOptions>>().Value;
            return string.Equals(options.Media.Provider, "AzureBlob", StringComparison.OrdinalIgnoreCase)
                ? ActivatorUtilities.CreateInstance<AzureBlobMediaStore>(provider)
                : ActivatorUtilities.CreateInstance<LocalMediaStore>(provider);
        });
        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<IBootstrapAdminProvider>(provider => provider.GetRequiredService<IOptions<AppSettingsOptions>>().Value);
        services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

        return services;
    }
}
