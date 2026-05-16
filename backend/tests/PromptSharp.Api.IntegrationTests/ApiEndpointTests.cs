using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using PromptSharp.Api.IntegrationTests.Support;
using PromptSharp.Application.Account;
using PromptSharp.Application.Auth;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Api.IntegrationTests;

public sealed class ApiEndpointTests(PromptSharpApiFactory factory) : IClassFixture<PromptSharpApiFactory>
{
    [Fact]
    public async Task Auth_endpoints_happy_path_and_account_endpoint_work()
    {
        var client = factory.CreateClient();
        var registered = await client.RegisterAsync($"auth-{Guid.NewGuid():N}@example.com");

        registered.AccessToken.Should().NotBeNullOrWhiteSpace();
        registered.RefreshToken.Should().NotBeNullOrWhiteSpace();

        client.Authorize(registered.AccessToken);
        var account = await client.GetFromJsonAsync<UserDto>("/api/v1/account");
        account!.Email.Should().Be(registered.User.Email);

        var refreshResponse = await client.PostAsJsonAsync("/api/v1/auth/refresh", new RefreshTokenRequestDto(registered.RefreshToken));
        refreshResponse.EnsureSuccessStatusCode();
        var refreshed = await refreshResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        refreshed!.RefreshToken.Should().NotBe(registered.RefreshToken);

        var logoutResponse = await client.PostAsJsonAsync("/api/v1/auth/logout", new LogoutRequestDto(refreshed.RefreshToken));
        logoutResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Protected_endpoints_return_401_without_token()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/account");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Users_cannot_access_another_users_project()
    {
        var ownerClient = factory.CreateClient();
        var otherClient = factory.CreateClient();

        var owner = await ownerClient.RegisterAsync($"owner-{Guid.NewGuid():N}@example.com");
        ownerClient.Authorize(owner.AccessToken);
        var project = await ownerClient.CreateProjectAsync("Private app");

        var other = await otherClient.RegisterAsync($"other-{Guid.NewGuid():N}@example.com");
        otherClient.Authorize(other.AccessToken);

        var response = await otherClient.GetAsync($"/api/v1/projects/{project.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task OpenApi_endpoint_exists()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/openapi/v1.json");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Health_ready_fails_when_database_is_unavailable()
    {
        var localFactory = new PromptSharpApiFactory();
        await localFactory.InitializeAsync();
        try
        {
            await using var scope = localFactory.Services.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
            await dbContext.Database.EnsureDeletedAsync();

            var response = await localFactory.CreateClient().GetAsync("/health/ready");

            response.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable);
        }
        finally
        {
            await ((IAsyncLifetime)localFactory).DisposeAsync();
            localFactory.Dispose();
        }
    }
}
