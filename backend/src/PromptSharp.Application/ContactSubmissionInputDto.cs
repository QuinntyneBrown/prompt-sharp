namespace PromptSharp.Application;

public sealed record ContactSubmissionInputDto(
    string Name,
    string Email,
    string Message);
