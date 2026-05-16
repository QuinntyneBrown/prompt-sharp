using PromptSharp.Domain.Validation;

namespace PromptSharp.Domain.Entities;

public sealed class User
{
    private User()
    {
    }

    private User(string email, string displayName, string passwordHash, DateTimeOffset createdAtUtc)
    {
        Id = Guid.NewGuid();
        Email = DomainGuard.Email(email);
        NormalizedEmail = DomainGuard.NormalizeEmail(email);
        DisplayName = DomainGuard.Required(displayName, "Display name", 160);
        PasswordHash = DomainGuard.Required(passwordHash, "Password hash", 2048);
        PlanName = "Free";
        MonthlyProjectQuota = 5;
        CreatedAtUtc = createdAtUtc;
    }

    public Guid Id { get; private set; }

    public string Email { get; private set; } = string.Empty;

    public string NormalizedEmail { get; private set; } = string.Empty;

    public string DisplayName { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public string PlanName { get; private set; } = "Free";

    public int MonthlyProjectQuota { get; private set; } = 5;

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public DateTimeOffset? LastSignInAtUtc { get; private set; }

    public string? LastUserAgent { get; private set; }

    public DateTimeOffset? DeletedAtUtc { get; private set; }

    public IReadOnlyCollection<Project> Projects => _projects.AsReadOnly();

    public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

    private readonly List<Project> _projects = [];

    private readonly List<RefreshToken> _refreshTokens = [];

    public static User Create(string email, string displayName, string passwordHash, DateTimeOffset createdAtUtc)
    {
        return new User(email, displayName, passwordHash, createdAtUtc);
    }

    public bool CanSignIn()
    {
        return DeletedAtUtc is null;
    }

    public void MarkSignedIn(DateTimeOffset signedInAtUtc, string? userAgent)
    {
        if (!CanSignIn())
        {
            throw new DomainRuleException("Deleted users cannot sign in.");
        }

        LastSignInAtUtc = signedInAtUtc;
        LastUserAgent = string.IsNullOrWhiteSpace(userAgent) ? null : userAgent.Trim();
    }

    public void UpdateProfile(string displayName)
    {
        DisplayName = DomainGuard.Required(displayName, "Display name", 160);
    }

    public void UpdateEmail(string email)
    {
        Email = DomainGuard.Email(email);
        NormalizedEmail = DomainGuard.NormalizeEmail(email);
    }

    public void UpdatePasswordHash(string passwordHash)
    {
        PasswordHash = DomainGuard.Required(passwordHash, "Password hash", 2048);
    }

    public void Delete(DateTimeOffset deletedAtUtc)
    {
        DeletedAtUtc = deletedAtUtc;
    }
}
