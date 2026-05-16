using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Account;

public sealed record UpdateEmailCommand(string Email, string CurrentPassword) : ICommand<UserDto>;
