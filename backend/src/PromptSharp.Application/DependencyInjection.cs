using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using PromptSharp.Application.Behaviors;

namespace PromptSharp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(configuration =>
        {
            configuration.RegisterServicesFromAssembly(ApplicationAssembly.Assembly);
        });

        services.AddValidatorsFromAssembly(ApplicationAssembly.Assembly, includeInternalTypes: true);

        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));

        return services;
    }
}
