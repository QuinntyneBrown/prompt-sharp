using FluentValidation;
using MediatR;

namespace PromptSharp.Application.Common;

public sealed class ValidationBehavior<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var failures = await ValidateAsync(request, validators, cancellationToken);
        if (failures.Count > 0)
        {
            throw new ValidationException(failures);
        }

        return await next();
    }

    internal static async Task<IReadOnlyList<FluentValidation.Results.ValidationFailure>> ValidateAsync(
        TRequest request,
        IEnumerable<IValidator<TRequest>> validators,
        CancellationToken cancellationToken)
    {
        var context = new ValidationContext<TRequest>(request);
        var results = await Task.WhenAll(validators.Select(validator => validator.ValidateAsync(context, cancellationToken)));
        return results.SelectMany(result => result.Errors).Where(failure => failure is not null).ToArray();
    }
}
