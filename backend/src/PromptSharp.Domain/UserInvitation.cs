namespace PromptSharp.Domain;

public sealed class UserInvitation
{
    private readonly List<string> _roles = [];

    private UserInvitation()
    {
    }

    private UserInvitation(Guid id, string email, IEnumerable<string> roles, string invitedBy, DateTimeOffset createdAt)
    {
        Id = id;
        Email = RequireText(email, nameof(email)).ToLowerInvariant();
        InvitedBy = RequireText(invitedBy, nameof(invitedBy));
        CreatedAt = createdAt;
        ReplaceRoles(roles);
    }

    public Guid Id { get; private set; }

    public string Email { get; private set; } = string.Empty;

    public IReadOnlyList<string> Roles => _roles;

    public string InvitedBy { get; private set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? AcceptedAt { get; private set; }

    public static UserInvitation Create(string email, IEnumerable<string> roles, string invitedBy, DateTimeOffset createdAt)
    {
        return new UserInvitation(Guid.NewGuid(), email, roles, invitedBy, createdAt);
    }

    public void Refresh(IEnumerable<string> roles, string invitedBy, DateTimeOffset now)
    {
        InvitedBy = RequireText(invitedBy, nameof(invitedBy));
        CreatedAt = now;
        ReplaceRoles(roles);
    }

    private void ReplaceRoles(IEnumerable<string> roles)
    {
        _roles.Clear();
        foreach (var role in roles.Select(role => RequireText(role, nameof(roles))).Distinct(StringComparer.OrdinalIgnoreCase))
        {
            _roles.Add(role);
        }
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
