using System.Diagnostics;
using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PromptSharp.Application.Behaviors;

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
