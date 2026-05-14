using System.Diagnostics;
using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PromptSharp.Application.Behaviors;

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
