using System.Text.RegularExpressions;

namespace PromptSharp.Domain.Validation;

public static partial class DomainGuard
{
    public static string Required(string value, string name, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainRuleException($"{name} is required.");
        }

        var normalized = value.Trim();
        if (normalized.Length > maxLength)
        {
            throw new DomainRuleException($"{name} must be {maxLength} characters or fewer.");
        }

        return normalized;
    }

    public static string Email(string value)
    {
        var email = Required(value, "Email", 320);
        if (!EmailRegex().IsMatch(email))
        {
            throw new DomainRuleException("Email is invalid.");
        }

        return email;
    }

    public static string NormalizeEmail(string value)
    {
        return Email(value).ToUpperInvariant();
    }

    [GeneratedRegex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", RegexOptions.CultureInvariant)]
    private static partial Regex EmailRegex();
}
