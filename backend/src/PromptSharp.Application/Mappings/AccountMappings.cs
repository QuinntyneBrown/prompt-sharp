using PromptSharp.Application.Account;
using PromptSharp.Application.Common;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Mappings;

public static class AccountMappings
{
    public static UserDto ToUserDto(this User user, int projectsUsed, DateTimeOffset nowUtc)
    {
        return new UserDto(
            user.DisplayName,
            user.Email,
            LabelFormatter.Date(user.CreatedAtUtc),
            new PlanDto(user.PlanName, "tier", projectsUsed, user.MonthlyProjectQuota, LabelFormatter.ResetLabel(nowUtc)),
            new SessionDto(LabelFormatter.Session(user.LastSignInAtUtc, nowUtc), NormalizeDevice(user.LastUserAgent)));
    }

    private static string NormalizeDevice(string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            return "Unknown device";
        }

        var value = userAgent.ToLowerInvariant();
        var operatingSystem = value.Contains("windows", StringComparison.Ordinal) ? "Windows" :
            value.Contains("mac", StringComparison.Ordinal) ? "macOS" :
            value.Contains("linux", StringComparison.Ordinal) ? "Linux" :
            value.Contains("android", StringComparison.Ordinal) ? "Android" :
            value.Contains("iphone", StringComparison.Ordinal) || value.Contains("ipad", StringComparison.Ordinal) ? "iOS" :
            "Device";

        var browser = value.Contains("edg/", StringComparison.Ordinal) ? "Edge" :
            value.Contains("chrome", StringComparison.Ordinal) ? "Chrome" :
            value.Contains("firefox", StringComparison.Ordinal) ? "Firefox" :
            value.Contains("safari", StringComparison.Ordinal) ? "Safari" :
            "Browser";

        return $"{operatingSystem} - {browser}";
    }
}
