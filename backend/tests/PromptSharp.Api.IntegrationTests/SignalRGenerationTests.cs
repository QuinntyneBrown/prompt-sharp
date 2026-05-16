using FluentAssertions;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using PromptSharp.Api.IntegrationTests.Support;
using PromptSharp.Application.Generation;
using PromptSharp.Domain.Enums;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Api.IntegrationTests;

public sealed class SignalRGenerationTests(PromptSharpApiFactory factory) : IClassFixture<PromptSharpApiFactory>
{
    [Fact]
    public async Task Authenticated_client_can_stream_generation_for_own_project()
    {
        var client = factory.CreateClient();
        var auth = await client.RegisterAsync($"signalr-{Guid.NewGuid():N}@example.com");
        client.Authorize(auth.AccessToken);
        var project = await client.CreateProjectAsync("SignalR app");

        await using var connection = CreateConnection(factory, auth.AccessToken);
        await connection.StartAsync();

        var updates = new List<ProjectGenerationUpdateDto>();
        await foreach (var update in connection.StreamAsync<ProjectGenerationUpdateDto>("StreamProjectGeneration", project.Id))
        {
            updates.Add(update);
        }

        updates.Should().Contain(update => update.Type == "completed");
        var detail = await client.GetFromJsonAsync<PromptSharp.Application.Projects.ProjectDto>($"/api/v1/projects/{project.Id}");
        detail!.PromptCount.Should().Be(10);
    }

    [Fact]
    public async Task Unauthenticated_hub_connection_is_rejected()
    {
        await using var connection = CreateConnection(factory, null);

        var act = async () => await connection.StartAsync();

        await act.Should().ThrowAsync<HttpRequestException>();
    }

    [Fact]
    public async Task Wrong_owner_cannot_stream_generation()
    {
        var ownerClient = factory.CreateClient();
        var owner = await ownerClient.RegisterAsync($"stream-owner-{Guid.NewGuid():N}@example.com");
        ownerClient.Authorize(owner.AccessToken);
        var project = await ownerClient.CreateProjectAsync("Private SignalR app");

        var otherClient = factory.CreateClient();
        var other = await otherClient.RegisterAsync($"stream-other-{Guid.NewGuid():N}@example.com");

        await using var connection = CreateConnection(factory, other.AccessToken);
        await connection.StartAsync();

        var act = async () =>
        {
            await foreach (var _ in connection.StreamAsync<ProjectGenerationUpdateDto>("StreamProjectGeneration", project.Id))
            {
            }
        };

        await act.Should().ThrowAsync<Exception>();
    }

    [Fact]
    public async Task Cancellation_does_not_persist_partial_success()
    {
        var slowFactory = new PromptSharpApiFactory(new FakeApiPromptPlanner(GeneratedPlanJson.Value, TimeSpan.FromSeconds(5)));
        await slowFactory.InitializeAsync();
        try
        {
            var client = slowFactory.CreateClient();
            var auth = await client.RegisterAsync($"cancel-{Guid.NewGuid():N}@example.com");
            client.Authorize(auth.AccessToken);
            var project = await client.CreateProjectAsync("Cancelable app");

            await using var connection = CreateConnection(slowFactory, auth.AccessToken);
            await connection.StartAsync();

            using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(100));
            var act = async () =>
            {
                await foreach (var _ in connection.StreamAsync<ProjectGenerationUpdateDto>("StreamProjectGeneration", project.Id, cts.Token))
                {
                }
            };

            await act.Should().ThrowAsync<OperationCanceledException>();

            await using var scope = slowFactory.Services.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
            var stored = await dbContext.Projects
                .Include(candidate => candidate.Phases)
                .SingleAsync(candidate => candidate.ProjectNumber == int.Parse(project.Id));

            stored.GenerationStatus.Should().NotBe(GenerationStatus.Succeeded);
            stored.Phases.Should().BeEmpty();
        }
        finally
        {
            await ((IAsyncLifetime)slowFactory).DisposeAsync();
            slowFactory.Dispose();
        }
    }

    private static HubConnection CreateConnection(PromptSharpApiFactory factory, string? accessToken)
    {
        return new HubConnectionBuilder()
            .WithUrl(new Uri(factory.Server.BaseAddress, "/hubs/project-generation"), options =>
            {
                options.Transports = HttpTransportType.LongPolling;
                options.HttpMessageHandlerFactory = _ => factory.Server.CreateHandler();
                if (accessToken is not null)
                {
                    options.AccessTokenProvider = () => Task.FromResult<string?>(accessToken);
                }
            })
            .Build();
    }
}
