namespace PromptSharp.Domain;

public sealed class Role
{
    private Role()
    {
    }

    public Role(Guid id, string name)
    {
        Id = id;
        Name = string.IsNullOrWhiteSpace(name) ? throw new DomainRuleException("Role name is required.") : name.Trim();
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;
}
