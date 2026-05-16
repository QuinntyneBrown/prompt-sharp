using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Account;

public sealed record DeleteAccountCommand(string CurrentPassword) : ICommand;
