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

public sealed class TestcontainersApplicationTests : IAsyncLifetime
{
    private readonly MsSqlContainer? _container = TestEnvironment.RunTestcontainers
        ? new MsSqlBuilder("mcr.microsoft.com/mssql/server:2022-latest")
            .WithPassword("PromptSharp_test_2026!")
            .Build()
        : null;

    public async Task InitializeAsync()
    {
        if (_container is not null)
        {
            await _container.StartAsync();
        }
    }

    public async Task DisposeAsync()
    {
        if (_container is not null)
        {
            await _container.DisposeAsync();
        }
    }

    [Fact]
    public async Task Create_tutorial_command_persists_catalog_content_in_sql_server()
    {
        if (_container is null)
        {
            return;
        }

        await using var provider = BuildProvider(_container.GetConnectionString());
        await SeedEditorUser(provider);

        var sender = provider.GetRequiredService<ISender>();
        var dbContext = provider.GetRequiredService<PromptSharpDbContext>();
        var category = await dbContext.Categories.SingleAsync();
        var tag = await dbContext.Tags.SingleAsync();

        var created = await sender.Send(new CreateTutorialCommand(new TutorialUpsertDto(
            "build-an-api",
            "Build an API",
            "Create a production-style API.",
            DifficultyLevel.Beginner,
            30,
            category.Id,
            [tag.Id])));

        created.Slug.Should().Be("build-an-api");
        created.Tags.Should().ContainSingle(tagDto => tagDto.Slug == "dotnet");
        (await dbContext.Tutorials.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task Editors_pick_command_clears_previous_pick_in_one_transaction()
    {
        if (_container is null)
        {
            return;
        }

        await using var provider = BuildProvider(_container.GetConnectionString());
        await SeedEditorUser(provider);

        var dbContext = provider.GetRequiredService<PromptSharpDbContext>();
        var sender = provider.GetRequiredService<ISender>();
        var category = await dbContext.Categories.SingleAsync();
        var tag = await dbContext.Tags.SingleAsync();

        var first = await sender.Send(new CreateTutorialCommand(new TutorialUpsertDto(
            "first",
            "First",
            "First summary",
            DifficultyLevel.Beginner,
            20,
            category.Id,
            [tag.Id])));
        await sender.Send(new ReplaceTutorialStepsCommand(first.Id, [new TutorialStepUpsertDto("Step", "Do it.", null, null, null)]));
        await sender.Send(new PublishTutorialCommand(first.Id));
        await sender.Send(new SetEditorsPickCommand(first.Id));

        var second = await sender.Send(new CreateTutorialCommand(new TutorialUpsertDto(
            "second",
            "Second",
            "Second summary",
            DifficultyLevel.Beginner,
            20,
            category.Id,
            [tag.Id])));
        await sender.Send(new ReplaceTutorialStepsCommand(second.Id, [new TutorialStepUpsertDto("Step", "Do it.", null, null, null)]));
        await sender.Send(new PublishTutorialCommand(second.Id));
        await sender.Send(new SetEditorsPickCommand(second.Id));

        var picks = await dbContext.Tutorials
            .Where(tutorial => tutorial.IsEditorsPick)
            .Select(tutorial => tutorial.Slug)
            .ToArrayAsync();

        picks.Should().Equal("second");
    }

    private static ServiceProvider BuildProvider(string connectionString)
    {
        var services = new ServiceCollection();
        services.AddLogging(builder => builder.AddConsole());
        services.AddApplication();
        services.AddDbContext<PromptSharpDbContext>(options => options.UseSqlServer(connectionString));
        services.AddScoped<IPromptSharpDbContext>(provider => provider.GetRequiredService<PromptSharpDbContext>());
        services.AddSingleton<TimeProvider>(TimeProvider.System);
        services.AddSingleton<ICurrentUser>(new FakeCurrentUser("editor-sub", ["Editor", "Admin"]));
        services.AddSingleton<IBootstrapAdminProvider>(new FakeBootstrapAdminProvider());

        var provider = services.BuildServiceProvider(validateScopes: true);
        provider.GetRequiredService<PromptSharpDbContext>().Database.Migrate();
        return provider;
    }

    private static async Task SeedEditorUser(IServiceProvider provider)
    {
        var dbContext = provider.GetRequiredService<PromptSharpDbContext>();
        var roles = RoleNames.All.Select(roleName => new Role(Guid.NewGuid(), roleName)).ToArray();
        dbContext.Roles.AddRange(roles);
        var user = User.Create("editor-sub", "editor@promptsharp.local", "Editor", null, DateTimeOffset.UtcNow);
        user.ReplaceRoles(roles.Where(role => role.Name is RoleNames.Editor or RoleNames.Admin).Select(role => role.Id));
        dbContext.Users.Add(user);
        dbContext.Categories.Add(Category.Create("dotnet", ".NET", 1));
        dbContext.Tags.Add(Tag.Create("dotnet", ".NET"));
        await dbContext.SaveChangesAsync();
    }
}

file sealed class FakeCurrentUser(string subject, IReadOnlyCollection<string> roles) : ICurrentUser
{
    public bool IsAuthenticated => true;

    public string? Subject => subject;

    public string? Email => "editor@promptsharp.local";

    public string? DisplayName => "Editor";

    public string? AvatarUrl => null;

    public IReadOnlyCollection<string> Roles => roles;
}

file sealed class FakeBootstrapAdminProvider : IBootstrapAdminProvider
{
    public string? BootstrapAdminEmail => null;
}

file static class TestEnvironment
{
    public static bool RunTestcontainers =>
        string.Equals(Environment.GetEnvironmentVariable("RUN_TESTCONTAINERS"), "true", StringComparison.OrdinalIgnoreCase) &&
        RuntimeInformation.ProcessArchitecture != Architecture.Arm64;
}
