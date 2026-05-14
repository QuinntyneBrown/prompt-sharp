using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PromptSharp.Domain;
using PromptSharp.Infrastructure;
using Testcontainers.MsSql;

namespace PromptSharp.Api.IntegrationTests;

internal static class TestEnvironment
{
    public static bool RunTestcontainers =>
        string.Equals(Environment.GetEnvironmentVariable("RUN_TESTCONTAINERS"), "true", StringComparison.OrdinalIgnoreCase) &&
        RuntimeInformation.ProcessArchitecture != Architecture.Arm64;
}
