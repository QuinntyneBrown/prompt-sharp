using System.Runtime.CompilerServices;
using MediatR;
using Microsoft.Extensions.Logging;

namespace PromptSharp.Application.Common;

public sealed class StreamLoggingBehavior<TRequest, TResponse>(
    ILogger<StreamLoggingBehavior<TRequest, TResponse>> logger) : IStreamPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async IAsyncEnumerable<TResponse> Handle(
        TRequest request,
        StreamHandlerDelegate<TResponse> next,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        logger.LogDebug("Streaming {RequestName}", typeof(TRequest).Name);
        await foreach (var response in next().WithCancellation(cancellationToken))
        {
            yield return response;
        }

        logger.LogDebug("Streamed {RequestName}", typeof(TRequest).Name);
    }
}
