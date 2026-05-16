namespace PromptSharp.Application.Account;

public sealed record UpdatePasswordRequestDto(string CurrentPassword, string NewPassword);
