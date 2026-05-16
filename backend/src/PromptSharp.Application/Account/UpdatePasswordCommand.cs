using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Account;

public sealed record UpdatePasswordCommand(string CurrentPassword, string NewPassword) : ICommand;
