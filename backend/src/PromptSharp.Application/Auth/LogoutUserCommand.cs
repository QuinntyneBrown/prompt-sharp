using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Auth;

public sealed record LogoutUserCommand(string RefreshToken) : ICommand;
