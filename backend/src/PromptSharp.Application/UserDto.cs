using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record UserDto(
    Guid Id,
    string Sub,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    DateTimeOffset CreatedAt,
    DateTimeOffset LastSeenAt,
    IReadOnlyList<string> Roles);
