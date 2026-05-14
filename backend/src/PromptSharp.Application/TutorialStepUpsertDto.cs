using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record TutorialStepUpsertDto(
    string Title,
    string BodyMarkdown,
    string? CodeSnippet,
    string? CodeLanguage,
    Guid? ImageMediaId);
