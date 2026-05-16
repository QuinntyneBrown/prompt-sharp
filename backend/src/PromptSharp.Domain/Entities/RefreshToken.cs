using PromptSharp.Domain.Validation;

namespace PromptSharp.Domain.Entities;

public sealed class RefreshToken
{
    private RefreshToken()
    {
    }

    private RefreshToken(
        Guid userId,
        string tokenHash,
        DateTimeOffset createdAtUtc,
        DateTimeOffset expiresAtUtc,
        string? userAgent,
        string? ipAddress)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        TokenHash = DomainGuard.Required(tokenHash, "Token hash", 512);
        CreatedAtUtc = createdAtUtc;
        ExpiresAtUtc = expiresAtUtc;
        UserAgent = string.IsNullOrWhiteSpace(userAgent) ? null : userAgent.Trim();
        IpAddress = string.IsNullOrWhiteSpace(ipAddress) ? null : ipAddress.Trim();
    }

    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public User? User { get; private set; }

    public string TokenHash { get; private set; } = string.Empty;

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public DateTimeOffset ExpiresAtUtc { get; private set; }

    public DateTimeOffset? RevokedAtUtc { get; private set; }

    public string? UserAgent { get; private set; }

    public string? IpAddress { get; private set; }

    public static RefreshToken Create(
        Guid userId,
        string tokenHash,
        DateTimeOffset createdAtUtc,
        DateTimeOffset expiresAtUtc,
        string? userAgent,
        string? ipAddress)
    {
        if (expiresAtUtc <= createdAtUtc)
        {
            throw new DomainRuleException("Refresh token expiry must be after creation.");
        }

        return new RefreshToken(userId, tokenHash, createdAtUtc, expiresAtUtc, userAgent, ipAddress);
    }

    public bool CanBeUsed(DateTimeOffset nowUtc)
    {
        return RevokedAtUtc is null && ExpiresAtUtc > nowUtc;
    }

    public void Revoke(DateTimeOffset revokedAtUtc)
    {
        if (RevokedAtUtc is null)
        {
            RevokedAtUtc = revokedAtUtc;
        }
    }
}
