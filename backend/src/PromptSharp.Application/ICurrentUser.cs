using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    string? Subject { get; }

    string? Email { get; }

    string? DisplayName { get; }

    string? AvatarUrl { get; }

    IReadOnlyCollection<string> Roles { get; }

    bool IsInRole(string role) => Roles.Any(current => string.Equals(current, role, StringComparison.OrdinalIgnoreCase));
}
