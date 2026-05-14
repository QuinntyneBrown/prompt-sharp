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

public static class HttpClientAuthExtensions
{
    public static void AuthenticateAs(this HttpClient client, string subject, params string[] roles)
    {
        client.DefaultRequestHeaders.Remove("X-Test-Sub");
        client.DefaultRequestHeaders.Remove("X-Test-Roles");
        client.DefaultRequestHeaders.Add("X-Test-Sub", subject);
        client.DefaultRequestHeaders.Add("X-Test-Roles", string.Join(",", roles));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(TestAuthHandler.AuthenticationScheme);
    }
}
