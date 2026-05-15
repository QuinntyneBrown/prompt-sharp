namespace PromptSharp.Application;

public sealed record UserInvitationDto(
    Guid Id,
    string Email,
    IReadOnlyList<string> Roles,
    string InvitedBy,
    DateTimeOffset CreatedAt,
    DateTimeOffset? AcceptedAt);
