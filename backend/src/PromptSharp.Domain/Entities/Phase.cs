using PromptSharp.Domain.Validation;

namespace PromptSharp.Domain.Entities;

public sealed class Phase
{
    private readonly List<PromptItem> _prompts = [];

    private Phase()
    {
    }

    private Phase(Guid projectId, int order, string title, IEnumerable<PromptItem> prompts)
    {
        Id = Guid.NewGuid();
        ProjectId = projectId;
        Order = order;
        Title = DomainGuard.Required(title, "Phase title", 160);
        _prompts.AddRange(prompts.OrderBy(prompt => prompt.Order));
        EnsureContiguousPromptOrder();
    }

    public Guid Id { get; private set; }

    public Guid ProjectId { get; private set; }

    public Project? Project { get; private set; }

    public int Order { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public IReadOnlyCollection<PromptItem> Prompts => _prompts.AsReadOnly();

    public static Phase Create(Guid projectId, int order, string title, IEnumerable<PromptItem> prompts)
    {
        if (projectId == Guid.Empty)
        {
            throw new DomainRuleException("Project id is required.");
        }

        if (order < 1)
        {
            throw new DomainRuleException("Phase order must start at 1.");
        }

        return new Phase(projectId, order, title, prompts);
    }

    public static Phase Create(Guid projectId, int order, string title)
    {
        return Create(projectId, order, title, []);
    }

    public PromptItem AddPrompt(int order, string title, string body, string tagsJson)
    {
        var prompt = PromptItem.Create(Id, order, title, body, tagsJson);
        _prompts.Add(prompt);
        return prompt;
    }

    public void EnsureContiguousPromptOrder()
    {
        var expected = 1;
        foreach (var prompt in _prompts.OrderBy(prompt => prompt.Order))
        {
            if (prompt.Order != expected)
            {
                throw new DomainRuleException("Prompt order must start at 1 and contain no gaps.");
            }

            expected++;
        }
    }
}
