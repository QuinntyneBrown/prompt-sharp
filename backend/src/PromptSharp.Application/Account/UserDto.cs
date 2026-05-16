namespace PromptSharp.Application.Account;

public sealed record UserDto(
    string Name,
    string Email,
    string MemberSinceLabel,
    PlanDto Plan,
    SessionDto Session);
