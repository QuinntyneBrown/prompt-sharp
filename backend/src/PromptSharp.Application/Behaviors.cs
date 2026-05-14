using System.Diagnostics;
using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PromptSharp.Application.Behaviors;

public sealed class LoggingBehavior<TRequest, TResponse>(
    ILogger<LoggingBehavior<TRequest, TResponse>> logger,
    ICurrentUser currentUser)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();
        try
        {
            return await next();
        }
        finally
        {
            stopwatch.Stop();
            logger.LogInformation(
                "Handled {RequestName} for {Subject} in {ElapsedMilliseconds}ms",
                typeof(TRequest).Name,
                currentUser.Subject ?? "anonymous",
                stopwatch.ElapsedMilliseconds);
        }
    }
}

public sealed class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var validatorArray = validators.ToArray();
        if (validatorArray.Length == 0)
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);
        var failures = await Task.WhenAll(validatorArray.Select(validator => validator.ValidateAsync(context, cancellationToken)));
        var errors = failures
            .SelectMany(result => result.Errors)
            .Where(error => error is not null)
            .ToArray();

        if (errors.Length > 0)
        {
            throw new ValidationException(errors);
        }

        return await next();
    }
}

public sealed class AuthorizationBehavior<TRequest, TResponse>(ICurrentUser currentUser)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requirements = request.GetType().GetCustomAttributes<AuthorizeRequestAttribute>(inherit: true).ToArray();
        if (requirements.Length == 0)
        {
            return await next();
        }

        if (!currentUser.IsAuthenticated)
        {
            throw new ForbiddenException("Authentication is required.");
        }

        foreach (var requirement in requirements)
        {
            if (requirement.Roles.Count == 0)
            {
                continue;
            }

            if (!requirement.Roles.Any(currentUser.IsInRole))
            {
                throw new ForbiddenException("The current user is not allowed to perform this action.");
            }
        }

        return await next();
    }
}

public sealed class TransactionBehavior<TRequest, TResponse>(IPromptSharpDbContext dbContext)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (request is not ICommandMarker)
        {
            return await next();
        }

        if (dbContext.Database.CurrentTransaction is not null)
        {
            var nestedResponse = await next();
            await dbContext.SaveChangesAsync(cancellationToken);
            return nestedResponse;
        }

        var executionStrategy = dbContext.Database.CreateExecutionStrategy();
        return await executionStrategy.ExecuteAsync(async () =>
        {
            await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
            var response = await next();
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            return response;
        });
    }
}

public static class MediatorRequestStartupValidator
{
    public static void AssertAllRequestsDeclareIntent(params Assembly[] assemblies)
    {
        var offenders = assemblies
            .SelectMany(assembly => assembly.ExportedTypes)
            .Where(type => type is { IsAbstract: false, IsInterface: false } && !type.IsGenericTypeDefinition)
            .Where(ImplementsMediatRRequest)
            .Where(type => !typeof(IRequestIntent).IsAssignableFrom(type))
            .Select(type => type.FullName)
            .OrderBy(name => name)
            .ToArray();

        if (offenders.Length > 0)
        {
            throw new InvalidOperationException(
                "MediatR requests must implement IQuery<T>, ICommand, or ICommand<T>: " + string.Join(", ", offenders));
        }
    }

    private static bool ImplementsMediatRRequest(Type type)
    {
        return type.GetInterfaces().Any(candidate =>
            candidate == typeof(IRequest) ||
            (candidate.IsGenericType && candidate.GetGenericTypeDefinition() == typeof(IRequest<>)));
    }
}
