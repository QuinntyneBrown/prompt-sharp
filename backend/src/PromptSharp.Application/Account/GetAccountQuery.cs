using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Account;

public sealed record GetAccountQuery : IQuery<UserDto>;
