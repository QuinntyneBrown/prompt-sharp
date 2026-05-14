using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
public sealed class AuthorizeRequestAttribute : Attribute
{
    public AuthorizeRequestAttribute(params string[] roles)
    {
        Roles = roles;
    }

    public IReadOnlyCollection<string> Roles { get; }
}
