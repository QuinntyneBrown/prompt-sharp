namespace PromptSharp.Domain;

public sealed class TutorialStep
{
    private TutorialStep()
    {
    }

    private TutorialStep(
        Guid id,
        Guid tutorialId,
        int order,
        string title,
        string bodyMarkdown,
        string? codeSnippet,
        string? codeLanguage,
        Guid? imageMediaId)
    {
        Id = id;
        TutorialId = tutorialId;
        SetOrder(order);
        Title = RequireText(title, nameof(title));
        BodyMarkdown = RequireText(bodyMarkdown, nameof(bodyMarkdown));
        CodeSnippet = string.IsNullOrWhiteSpace(codeSnippet) ? null : codeSnippet;
        CodeLanguage = string.IsNullOrWhiteSpace(codeLanguage) ? null : codeLanguage.Trim();
        ImageMediaId = imageMediaId;
    }

    public Guid Id { get; private set; }

    public Guid TutorialId { get; private set; }

    public int Order { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string BodyMarkdown { get; private set; } = string.Empty;

    public string? CodeSnippet { get; private set; }

    public string? CodeLanguage { get; private set; }

    public Guid? ImageMediaId { get; private set; }

    public Tutorial? Tutorial { get; private set; }

    public Media? ImageMedia { get; private set; }

    public static TutorialStep Create(
        Guid id,
        Guid tutorialId,
        int order,
        string title,
        string bodyMarkdown,
        string? codeSnippet,
        string? codeLanguage,
        Guid? imageMediaId)
    {
        return new TutorialStep(id, tutorialId, order, title, bodyMarkdown, codeSnippet, codeLanguage, imageMediaId);
    }

    public void SetOrder(int order)
    {
        if (order <= 0)
        {
            throw new DomainRuleException("Step order must be greater than zero.");
        }

        Order = order;
    }

    private static string RequireText(string value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainRuleException($"{name} is required.");
        }

        return value.Trim();
    }
}
