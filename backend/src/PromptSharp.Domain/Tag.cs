namespace PromptSharp.Domain;

public sealed class Tag
{
    private Tag()
    {
    }

    private Tag(Guid id, string slug, string name)
    {
        Id = id;
        Update(slug, name);
    }

    public Guid Id { get; private set; }

    public string Slug { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public byte[] RowVersion { get; private set; } = [];

    public static Tag Create(string slug, string name) => new(Guid.NewGuid(), slug, name);

    public void Update(string slug, string name)
    {
        Slug = RequireText(slug, nameof(slug));
        Name = RequireText(name, nameof(name));
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
