using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;

namespace PromptSharp.Infrastructure.Persistence;

public sealed class EfCoreTransactionRunner(PromptSharpDbContext dbContext) : ITransactionRunner
{
    public async Task<TResponse> RunAsync<TResponse>(
        Func<Task<TResponse>> operation,
        CancellationToken cancellationToken)
    {
        if (dbContext.Database.CurrentTransaction is not null)
        {
            return await operation();
        }

        var strategy = dbContext.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
            var response = await operation();
            await transaction.CommitAsync(cancellationToken);
            return response;
        });
    }
}
