using FluentAssertions;
using PromptSharp.Domain.Entities;
using PromptSharp.Domain.Validation;

namespace PromptSharp.Domain.Tests;

public sealed class UserTests
{
    [Fact]
    public void Create_rejects_invalid_email()
    {
        var act = () => User.Create("not-an-email", "Quinn", "hash", DateTimeOffset.UtcNow);

        act.Should().Throw<DomainRuleException>().WithMessage("*Email*");
    }

    [Fact]
    public void Deleted_user_cannot_sign_in()
    {
        var user = User.Create("quinn@example.com", "Quinn", "hash", DateTimeOffset.UtcNow);
        user.Delete(DateTimeOffset.UtcNow);

        var act = () => user.MarkSignedIn(DateTimeOffset.UtcNow, "agent");

        act.Should().Throw<DomainRuleException>().WithMessage("*Deleted users*");
    }
}
