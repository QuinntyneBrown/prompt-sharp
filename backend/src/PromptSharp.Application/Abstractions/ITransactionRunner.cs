namespace PromptSharp.Application.Abstractions;

public interface ITransactionRunner
{
    Task<TResponse> RunAsync<TResponse>(Func<Task<TResponse>> operation, CancellationToken cancellationToken);
}
