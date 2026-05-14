namespace PromptSharp.Domain;

public sealed class Category
{
    private Category()
    {
    }

    private Category(Guid id, string slug, string name, int order)
    {
        Id = id;
        Update(slug, name, order);
    }

    public Guid Id { get; private set; }

    public string Slug { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public int Order { get; private set; }

    public byte[] RowVersion { get; private set; } = [];

    public static Category Create(string slug, string name, int order) => new(Guid.NewGuid(), slug, name, order);

    public void Update(string slug, string name, int order)
    {
        Slug = RequireText(slug, nameof(slug));
        Name = RequireText(name, nameof(name));
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
