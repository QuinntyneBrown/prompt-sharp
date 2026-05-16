using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Tests.Support;

public sealed class FakeCurrentUser : ICurrentUser
{
    public bool IsAuthenticated => UserId is not null;

    public Guid? UserId { get; private set; }

    public string? Email { get; private set; }

    public string? UserAgent { get; private set; } = "Windows Chrome";

    public string? IpAddress { get; private set; } = "127.0.0.1";

    public void SignIn(Guid userId, string email)
    {
        UserId = userId;
        Email = email;
    }
}
