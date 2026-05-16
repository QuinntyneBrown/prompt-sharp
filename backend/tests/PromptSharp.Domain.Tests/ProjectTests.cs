using FluentAssertions;
using PromptSharp.Domain.Entities;
using PromptSharp.Domain.Validation;

namespace PromptSharp.Domain.Tests;

public sealed class ProjectTests
{
    [Fact]
    public void Create_rejects_empty_idea()
    {
        var act = () => Project.Create(Guid.NewGuid(), "", DateTimeOffset.UtcNow);

        act.Should().Throw<DomainRuleException>().WithMessage("*Idea*");
    }

    [Fact]
    public void Phase_prompt_order_must_be_contiguous()
    {
        var phase = Phase.Create(Guid.NewGuid(), 1, "Foundation");
        phase.AddPrompt(1, "First", "Body", "[]");
        phase.AddPrompt(3, "Third", "Body", "[]");

        var act = phase.EnsureContiguousPromptOrder;

        act.Should().Throw<DomainRuleException>().WithMessage("*Prompt order*");
    }
}
