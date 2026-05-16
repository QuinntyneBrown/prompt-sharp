using System.Runtime.CompilerServices;
using FluentValidation;
using MediatR;

namespace PromptSharp.Application.Common;

public sealed class StreamValidationBehavior<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators) : IStreamPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async IAsyncEnumerable<TResponse> Handle(
        TRequest request,
        StreamHandlerDelegate<TResponse> next,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var failures = await ValidationBehavior<TRequest, TResponse>.ValidateAsync(request, validators, cancellationToken);
        if (failures.Count > 0)
        {
            throw new ValidationException(failures);
        }

        await foreach (var response in next().WithCancellation(cancellationToken))
        {
            yield return response;
        }
    }
}
