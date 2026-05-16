using FluentAssertions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PromptSharp.Application.Auth;
using PromptSharp.Application.Common;
using PromptSharp.Application.Generation;
using PromptSharp.Application.Projects;
using PromptSharp.Application.Tests.Support;
using PromptSharp.Domain.Enums;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Application.Tests;

public sealed class ProjectApplicationTests
{
    [Fact]
    public async Task Project_library_enforces_quota_filters_status_and_returns_detail()
    {
        var currentUser = new FakeCurrentUser();
        await using var host = await ApplicationTestHost.CreateAsync(currentUser);
        await using var scope = host.Services.CreateAsyncScope();
        var sender = scope.ServiceProvider.GetRequiredService<ISender>();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        await RegisterAndSignInAsync(sender, dbContext, currentUser);

        var first = await sender.Send(new CreateProjectCommand("A notes app"));
        var second = await sender.Send(new CreateProjectCommand("A scheduling app"));
        await sender.Send(new UpdateProjectStatusCommand(int.Parse(second.Id), "shipped"));

        var shipped = await sender.Send(new ListProjectsQuery("scheduling", "shipped", 1, 20));
        shipped.Items.Should().ContainSingle(item => item.Id == second.Id);

        var detail = await sender.Send(new GetProjectQuery(int.Parse(first.Id)));
        detail.Id.Should().Be(first.Id);
        detail.Idea.Should().Be("A notes app");

        for (var i = 0; i < 3; i++)
        {
            await sender.Send(new CreateProjectCommand($"Extra app {i}"));
        }

        var overQuota = async () => await sender.Send(new CreateProjectCommand("One too many"));
        await overQuota.Should().ThrowAsync<ConflictException>();
    }

    [Fact]
    public async Task Generation_stream_persists_normalized_plan_and_deterministic_download()
    {
        var currentUser = new FakeCurrentUser();
        var planner = new FakeAiPromptPlanner(GeneratedPlanFixture.ValidJson());
        await using var host = await ApplicationTestHost.CreateAsync(currentUser, planner);
        await using var scope = host.Services.CreateAsyncScope();
        var sender = scope.ServiceProvider.GetRequiredService<ISender>();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        await RegisterAndSignInAsync(sender, dbContext, currentUser);

        var created = await sender.Send(new CreateProjectCommand("A launch planning app"));
        var updates = new List<ProjectGenerationUpdateDto>();
        await foreach (var update in sender.CreateStream(new GenerateProjectPlanStreamCommand(int.Parse(created.Id))))
        {
            updates.Add(update);
        }

        updates.Should().Contain(update => update.Type == "completed");

        var project = await dbContext.Projects
            .Include(candidate => candidate.Phases)
            .ThenInclude(phase => phase.Prompts)
            .SingleAsync();

        project.GenerationStatus.Should().Be(GenerationStatus.Succeeded);
        project.Phases.Should().HaveCount(3);
        project.PromptCount().Should().Be(10);

        var detail = await sender.Send(new GetProjectQuery(int.Parse(created.Id)));
        detail.Phases[0].Ix.Should().Be("01");
        detail.Phases[0].Prompts[0].N.Should().Be("01");

        var download = await sender.Send(new GetProjectDownloadQuery(int.Parse(created.Id)));
        download.Content.Should().Contain("Project No. 0001 - 10 prompts - 3 phases - est. ~3 days");
        download.FileName.Should().Be("promptsharp-0001.txt");
    }

    [Fact]
    public async Task Failed_generation_marks_project_failed_with_sanitized_error()
    {
        var currentUser = new FakeCurrentUser();
        var planner = new FakeAiPromptPlanner(GeneratedPlanFixture.ValidJson(), fail: true);
        await using var host = await ApplicationTestHost.CreateAsync(currentUser, planner);
        await using var scope = host.Services.CreateAsyncScope();
        var sender = scope.ServiceProvider.GetRequiredService<ISender>();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
        await RegisterAndSignInAsync(sender, dbContext, currentUser);

        var created = await sender.Send(new CreateProjectCommand("A failing app"));
        var updates = new List<ProjectGenerationUpdateDto>();
        await foreach (var update in sender.CreateStream(new GenerateProjectPlanStreamCommand(int.Parse(created.Id))))
        {
            updates.Add(update);
        }

        updates.Should().Contain(update => update.Type == "failed");
        var project = await dbContext.Projects.SingleAsync();
        project.GenerationStatus.Should().Be(GenerationStatus.Failed);
        project.GenerationError.Should().Be("planner unavailable");
    }

    private static async Task RegisterAndSignInAsync(ISender sender, PromptSharpDbContext dbContext, FakeCurrentUser currentUser)
    {
        await sender.Send(new RegisterUserCommand("owner@example.com", "PromptSharp123!", "Owner", "Windows Chrome", "127.0.0.1"));
        var user = await dbContext.Users.SingleAsync(user => user.Email == "owner@example.com");
        currentUser.SignIn(user.Id, user.Email);
    }
}
