using PromptSharp.Domain.Validation;

namespace PromptSharp.Domain.Entities;

public sealed class PromptItem
{
    private PromptItem()
    {
    }

    private PromptItem(Guid phaseId, int order, string title, string body, string tagsJson)
    {
        Id = Guid.NewGuid();
        PhaseId = phaseId;
        Order = order;
        Title = DomainGuard.Required(title, "Prompt title", 220);
        Body = DomainGuard.Required(body, "Prompt body", 100_000);
        TagsJson = DomainGuard.Required(tagsJson, "Tags JSON", 4000);
    }

    public Guid Id { get; private set; }

    public Guid PhaseId { get; private set; }

    public Phase? Phase { get; private set; }

    public int Order { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string Body { get; private set; } = string.Empty;

    public string TagsJson { get; private set; } = "[]";

    public static PromptItem Create(Guid phaseId, int order, string title, string body, string tagsJson)
    {
        if (phaseId == Guid.Empty)
        {
            throw new DomainRuleException("Phase id is required.");
        }

        if (order < 1)
        {
            throw new DomainRuleException("Prompt order must start at 1.");
        }

        return new PromptItem(phaseId, order, title, body, tagsJson);
    }
}
