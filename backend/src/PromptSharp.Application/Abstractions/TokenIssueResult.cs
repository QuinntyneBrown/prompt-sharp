namespace PromptSharp.Application.Abstractions;

public sealed record TokenIssueResult(string AccessToken, DateTimeOffset ExpiresAtUtc);
