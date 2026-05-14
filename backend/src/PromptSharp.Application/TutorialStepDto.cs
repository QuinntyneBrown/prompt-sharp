using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record TutorialStepDto(
    Guid Id,
    int Order,
    string Title,
    string BodyMarkdown,
    string? CodeSnippet,
    string? CodeLanguage,
    Guid? ImageMediaId);
