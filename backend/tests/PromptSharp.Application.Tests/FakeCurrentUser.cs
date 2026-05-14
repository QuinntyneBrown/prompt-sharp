using FluentAssertions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PromptSharp.Application;
using PromptSharp.Application.Features;
using PromptSharp.Domain;
using PromptSharp.Infrastructure;
using System.Runtime.InteropServices;
using Testcontainers.MsSql;

namespace PromptSharp.Application.Tests;

internal sealed class FakeCurrentUser(string subject, IReadOnlyCollection<string> roles) : ICurrentUser
{
    public bool IsAuthenticated => true;

    public string? Subject => subject;

    public string? Email => "editor@promptsharp.local";

    public string? DisplayName => "Editor";

    public string? AvatarUrl => null;

    public IReadOnlyCollection<string> Roles => roles;
}
