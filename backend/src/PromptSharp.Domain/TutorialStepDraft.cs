namespace PromptSharp.Domain;

public sealed record TutorialStepDraft(
    string Title,
    string BodyMarkdown,
    string? CodeSnippet = null,
    string? CodeLanguage = null,
    Guid? ImageMediaId = null);
