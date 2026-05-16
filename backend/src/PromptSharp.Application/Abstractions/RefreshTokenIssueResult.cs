namespace PromptSharp.Application.Abstractions;

public sealed record RefreshTokenIssueResult(string Token, DateTimeOffset ExpiresAtUtc);
