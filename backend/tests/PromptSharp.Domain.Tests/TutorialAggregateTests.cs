using FluentAssertions;
using PromptSharp.Domain;

namespace PromptSharp.Domain.Tests;

public sealed class TutorialAggregateTests
{
    [Fact]
    public void Publish_requires_at_least_one_step()
    {
        var tutorial = CreateTutorial(summary: "Build a small API.");

        var action = () => tutorial.Publish(DateTimeOffset.UtcNow);

        action.Should().Throw<DomainRuleException>()
            .WithMessage("*at least one step*");
    }

    [Fact]
    public void Publish_requires_a_non_empty_summary()
    {
        var tutorial = CreateTutorial(summary: "");
        tutorial.ReplaceSteps([new TutorialStepDraft("Create project", "Run dotnet new webapi.")], DateTimeOffset.UtcNow);

        var action = () => tutorial.Publish(DateTimeOffset.UtcNow);

        action.Should().Throw<DomainRuleException>()
            .WithMessage("*summary*");
    }

    [Fact]
    public void Published_tutorial_slug_is_immutable()
    {
        var tutorial = CreateTutorial();
        tutorial.ReplaceSteps([new TutorialStepDraft("Create project", "Run dotnet new webapi.")], DateTimeOffset.UtcNow);
        tutorial.Publish(DateTimeOffset.UtcNow);

        var action = () => tutorial.SetSlug("new-slug");

        action.Should().Throw<DomainRuleException>()
            .WithMessage("*immutable*");
    }

    [Fact]
    public void Reorder_steps_requires_every_step_once()
    {
        var tutorial = CreateTutorial();
        tutorial.ReplaceSteps(
            [
                new TutorialStepDraft("One", "First"),
                new TutorialStepDraft("Two", "Second")
            ],
            DateTimeOffset.UtcNow);

        var firstStepId = tutorial.Steps.First().Id;
        var action = () => tutorial.ReorderSteps([firstStepId], DateTimeOffset.UtcNow);

        action.Should().Throw<DomainRuleException>()
            .WithMessage("*every step exactly once*");
    }

    [Fact]
    public void Replace_steps_assigns_contiguous_order()
    {
        var tutorial = CreateTutorial();

        tutorial.ReplaceSteps(
            [
                new TutorialStepDraft("One", "First"),
                new TutorialStepDraft("Two", "Second"),
                new TutorialStepDraft("Three", "Third")
            ],
            DateTimeOffset.UtcNow);

        tutorial.Steps.Select(step => step.Order).Should().Equal(1, 2, 3);
    }

    private static Tutorial CreateTutorial(string summary = "Build a small API.")
    {
        return Tutorial.Create(
            "build-api",
            "Build API",
            summary,
            DifficultyLevel.Beginner,
            25,
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTimeOffset.UtcNow);
    }
}
