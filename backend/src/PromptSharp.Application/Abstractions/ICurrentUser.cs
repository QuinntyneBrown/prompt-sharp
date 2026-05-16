namespace PromptSharp.Application.Abstractions;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    Guid? UserId { get; }

    string? Email { get; }

    string? UserAgent { get; }

    string? IpAddress { get; }
}
