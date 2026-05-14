namespace PromptSharp.Domain;

public sealed class User
{
    private readonly List<UserRole> _userRoles = [];

    private User()
    {
    }

    private User(Guid id, string sub, string email, string displayName, string? avatarUrl, DateTimeOffset now)
    {
        Id = id;
        Sub = RequireText(sub, nameof(sub));
        Email = RequireText(email, nameof(email));
        DisplayName = RequireText(displayName, nameof(displayName));
        AvatarUrl = string.IsNullOrWhiteSpace(avatarUrl) ? null : avatarUrl.Trim();
        CreatedAt = now;
        LastSeenAt = now;
    }

    public Guid Id { get; private set; }

    public string Sub { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string DisplayName { get; private set; } = string.Empty;

    public string? AvatarUrl { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset LastSeenAt { get; private set; }

    public IReadOnlyCollection<UserRole> UserRoles => _userRoles;

    public static User Create(string sub, string email, string displayName, string? avatarUrl, DateTimeOffset now)
    {
        return new User(Guid.NewGuid(), sub, email, displayName, avatarUrl, now);
    }

    public void UpdateProfile(string email, string displayName, string? avatarUrl, DateTimeOffset now)
    {
        Email = RequireText(email, nameof(email));
        DisplayName = RequireText(displayName, nameof(displayName));
        AvatarUrl = string.IsNullOrWhiteSpace(avatarUrl) ? null : avatarUrl.Trim();
        LastSeenAt = now;
    }

    public void MarkSeen(DateTimeOffset now) => LastSeenAt = now;

    public void ReplaceRoles(IEnumerable<Guid> roleIds)
    {
        _userRoles.Clear();
        foreach (var roleId in roleIds.Distinct())
        {
            _userRoles.Add(new UserRole(Id, roleId));
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
