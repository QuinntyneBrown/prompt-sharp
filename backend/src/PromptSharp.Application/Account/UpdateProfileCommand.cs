using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Account;

public sealed record UpdateProfileCommand(string DisplayName) : ICommand<UserDto>;
