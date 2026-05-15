namespace PromptSharp.Application;

public sealed record UserInvitationInputDto(string Email, IReadOnlyList<string> Roles);
