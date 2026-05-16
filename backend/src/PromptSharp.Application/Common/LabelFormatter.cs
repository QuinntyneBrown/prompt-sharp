namespace PromptSharp.Application.Common;

public static class LabelFormatter
{
    public static string Date(DateTimeOffset value)
    {
        return value.UtcDateTime.ToString("MMMM d, yyyy");
    }

    public static string Relative(DateTimeOffset value, DateTimeOffset now)
    {
        var elapsed = now - value;
        if (elapsed.TotalSeconds < 60)
        {
            return "just now";
        }

        if (elapsed.TotalMinutes < 60)
        {
            return $"{(int)elapsed.TotalMinutes}m ago";
        }

        if (elapsed.TotalHours < 24)
        {
            return $"{(int)elapsed.TotalHours}h ago";
        }

        if (elapsed.TotalDays < 30)
        {
            return $"{(int)elapsed.TotalDays}d ago";
        }

        return Date(value);
    }

    public static string Session(DateTimeOffset? value, DateTimeOffset now)
    {
        if (value is null)
        {
            return "Never";
        }

        if (value.Value.Date == now.Date)
        {
            return $"Today, {value.Value.LocalDateTime:h:mm tt}";
        }

        return value.Value.LocalDateTime.ToString("MMM d, h:mm tt");
    }

    public static string ResetLabel(DateTimeOffset now)
    {
        var nextMonth = new DateTimeOffset(now.Year, now.Month, 1, 0, 0, 0, TimeSpan.Zero).AddMonths(1);
        return nextMonth.ToString("MMMM d");
    }
}
