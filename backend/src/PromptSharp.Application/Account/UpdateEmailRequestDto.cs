namespace PromptSharp.Application.Account;

public sealed record UpdateEmailRequestDto(string Email, string CurrentPassword);
