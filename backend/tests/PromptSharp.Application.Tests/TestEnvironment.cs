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

internal static class TestEnvironment
{
    public static bool RunTestcontainers =>
        string.Equals(Environment.GetEnvironmentVariable("RUN_TESTCONTAINERS"), "true", StringComparison.OrdinalIgnoreCase) &&
        RuntimeInformation.ProcessArchitecture != Architecture.Arm64;
}
