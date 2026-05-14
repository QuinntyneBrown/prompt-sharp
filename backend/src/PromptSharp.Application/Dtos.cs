using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record PagedResult<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record TutorialListItemDto(
    Guid Id,
    string Slug,
    string Title,
    string Summary,
    DifficultyLevel DifficultyLevel,
    int EstimatedMinutes,
    bool IsPublished,
    bool IsFeatured,
    bool IsEditorsPick,
    string CategorySlug,
    string CategoryName,
    IReadOnlyList<string> Tags,
    int StepCount);

public sealed record TutorialDetailDto(
    Guid Id,
    string Slug,
    string Title,
    string Summary,
    DifficultyLevel DifficultyLevel,
    int EstimatedMinutes,
    bool IsPublished,
    bool IsFeatured,
    bool IsEditorsPick,
    Guid CategoryId,
    string CategorySlug,
    string CategoryName,
    Guid AuthorId,
    string AuthorName,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyList<TutorialStepDto> Steps,
    IReadOnlyList<TagDto> Tags);

public sealed record TutorialStepDto(
    Guid Id,
    int Order,
    string Title,
    string BodyMarkdown,
    string? CodeSnippet,
    string? CodeLanguage,
    Guid? ImageMediaId);

public sealed record CategoryDto(
    Guid Id,
    string Slug,
    string Name,
    int Order,
    int TutorialCount);

public sealed record TagDto(Guid Id, string Slug, string Name);

public sealed record UserDto(
    Guid Id,
    string Sub,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    DateTimeOffset CreatedAt,
    DateTimeOffset LastSeenAt,
    IReadOnlyList<string> Roles);

public sealed record BookmarkDto(TutorialListItemDto Tutorial, DateTimeOffset CreatedAt);

public sealed record TutorialProgressDto(
    Guid UserId,
    Guid TutorialId,
    Guid? CurrentStepId,
    IReadOnlyList<Guid> CompletedStepIds,
    DateTimeOffset UpdatedAt);

public sealed record MediaDto(
    Guid Id,
    string Url,
    string FileName,
    string ContentType,
    long SizeBytes,
    Guid UploadedById,
    DateTimeOffset UploadedAt);

public sealed record TutorialUpsertDto(
    string Slug,
    string Title,
    string Summary,
    DifficultyLevel DifficultyLevel,
    int EstimatedMinutes,
    Guid CategoryId,
    IReadOnlyList<Guid> TagIds);

public sealed record TutorialStepUpsertDto(
    string Title,
    string BodyMarkdown,
    string? CodeSnippet,
    string? CodeLanguage,
    Guid? ImageMediaId);

public sealed record CategoryUpsertDto(string Slug, string Name, int Order);

public sealed record TagUpsertDto(string Slug, string Name);

public sealed record ProgressUpsertDto(Guid? CurrentStepId, IReadOnlyList<Guid> CompletedStepIds);

public sealed record UserRolesUpsertDto(IReadOnlyList<string> Roles);
