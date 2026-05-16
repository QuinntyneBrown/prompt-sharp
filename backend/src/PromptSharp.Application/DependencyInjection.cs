using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using PromptSharp.Application.Common;
using PromptSharp.Application.Rendering;

namespace PromptSharp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(configuration => configuration.RegisterServicesFromAssembly(typeof(ApplicationAssembly).Assembly));
        services.AddValidatorsFromAssembly(typeof(ApplicationAssembly).Assembly);
        services.AddScoped<ProjectMarkdownRenderer>();

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
        services.AddTransient(typeof(IStreamPipelineBehavior<,>), typeof(StreamValidationBehavior<,>));
        services.AddTransient(typeof(IStreamPipelineBehavior<,>), typeof(StreamLoggingBehavior<,>));

        return services;
    }
}
