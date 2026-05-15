namespace PromptSharp.Domain;

public sealed class ContactSubmission
{
    private ContactSubmission()
    {
    }

    private ContactSubmission(Guid id, string name, string email, string message, DateTimeOffset createdAt)
    {
        Id = id;
        Name = RequireText(name, nameof(name));
        Email = RequireText(email, nameof(email));
        Message = RequireText(message, nameof(message));
        CreatedAt = createdAt;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string Message { get; private set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; private set; }

    public static ContactSubmission Create(string name, string email, string message, DateTimeOffset createdAt)
    {
        return new ContactSubmission(Guid.NewGuid(), name, email, message, createdAt);
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
