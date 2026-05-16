using MediatR;
using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Common;

public sealed class TransactionBehavior<TRequest, TResponse>(
    ITransactionRunner transactionRunner) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!IsWriteCommand())
        {
            return await next();
        }

        return await transactionRunner.RunAsync<TResponse>(() => next(), cancellationToken);
    }

    private static bool IsWriteCommand()
    {
        return typeof(TRequest).GetInterfaces().Any(type =>
            type == typeof(ICommand) ||
            type.IsGenericType && type.GetGenericTypeDefinition() == typeof(ICommand<>));
    }
}
