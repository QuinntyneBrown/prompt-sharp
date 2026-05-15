namespace PromptSharp.Domain;

public sealed class AuditEvent
{
    private AuditEvent()
    {
    }

    private AuditEvent(
        Guid id,
        string actor,
        string action,
        string targetType,
        string targetId,
        string targetName,
        string before,
        string after,
        DateTimeOffset changedAt)
    {
        Id = id;
        Actor = RequireText(actor, nameof(actor));
        Action = RequireText(action, nameof(action));
        TargetType = RequireText(targetType, nameof(targetType));
        TargetId = RequireText(targetId, nameof(targetId));
        TargetName = RequireText(targetName, nameof(targetName));
        Before = string.IsNullOrWhiteSpace(before) ? "None" : before.Trim();
        After = string.IsNullOrWhiteSpace(after) ? "None" : after.Trim();
        ChangedAt = changedAt;
    }

    public Guid Id { get; private set; }

    public string Actor { get; private set; } = string.Empty;

    public string Action { get; private set; } = string.Empty;

    public string TargetType { get; private set; } = string.Empty;

    public string TargetId { get; private set; } = string.Empty;

    public string TargetName { get; private set; } = string.Empty;

    public string Before { get; private set; } = string.Empty;

    public string After { get; private set; } = string.Empty;

    public DateTimeOffset ChangedAt { get; private set; }

    public static AuditEvent Create(
        string actor,
        string action,
        string targetType,
        string targetId,
        string targetName,
        string before,
        string after,
        DateTimeOffset changedAt)
    {
        return new AuditEvent(Guid.NewGuid(), actor, action, targetType, targetId, targetName, before, after, changedAt);
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
