namespace PromptSharp.Application;

public sealed record ContactSubmissionDto(
    Guid Id,
    string Name,
    string Email,
    string Message,
    DateTimeOffset CreatedAt);
