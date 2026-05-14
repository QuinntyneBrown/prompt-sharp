using System.Diagnostics;
using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PromptSharp.Application.Behaviors;

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
