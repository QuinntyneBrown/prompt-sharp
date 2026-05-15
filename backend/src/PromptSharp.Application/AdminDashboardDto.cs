namespace PromptSharp.Application;

public sealed record AdminDashboardDto(
    DateTimeOffset GeneratedAt,
    int TotalTutorials,
    int PublishedTutorials,
    int DraftTutorials,
    int AuthorCount,
    int MediaAssetCount,
    int PendingInvitationCount,
    IReadOnlyList<AdminDashboardActivityDto> RecentActivity,
    IReadOnlyList<AdminDashboardRecentTutorialDto> RecentTutorials);

public sealed record AdminDashboardActivityDto(
    string Actor,
    string Action,
    string TargetName,
    DateTimeOffset ChangedAt);

public sealed record AdminDashboardRecentTutorialDto(
    Guid Id,
    string Title,
    string CategoryName,
    string AuthorName,
    bool IsPublished,
    DateTimeOffset UpdatedAt);
