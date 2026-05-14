namespace PromptSharp.Domain;

public enum DifficultyLevel
{
    Beginner = 0,
    Intermediate = 1,
    Advanced = 2
}

public static class RoleNames
{
    public const string Admin = "Admin";
    public const string Editor = "Editor";
    public const string User = "User";

    public static readonly string[] All = [Admin, Editor, User];
}

public sealed class DomainRuleException(string message) : Exception(message);

public sealed class Tutorial
{
    private readonly List<TutorialStep> _steps = [];
    private readonly List<TutorialTag> _tutorialTags = [];

    private Tutorial()
    {
    }

    private Tutorial(
        Guid id,
        string slug,
        string title,
        string summary,
        DifficultyLevel difficultyLevel,
        int estimatedMinutes,
        Guid categoryId,
        Guid authorId,
        DateTimeOffset now)
    {
        Id = id;
        Slug = NormalizeRequired(slug, nameof(slug));
        Title = NormalizeRequired(title, nameof(title));
        Summary = summary.Trim();
        DifficultyLevel = difficultyLevel;
        EstimatedMinutes = RequirePositive(estimatedMinutes, nameof(estimatedMinutes));
        CategoryId = categoryId;
        AuthorId = authorId;
        CreatedAt = now;
        UpdatedAt = now;
    }

    public Guid Id { get; private set; }

    public string Slug { get; private set; } = string.Empty;

    public string Title { get; private set; } = string.Empty;

    public string Summary { get; private set; } = string.Empty;

    public DifficultyLevel DifficultyLevel { get; private set; }

    public int EstimatedMinutes { get; private set; }

    public bool IsPublished { get; private set; }

    public bool IsFeatured { get; private set; }

    public bool IsEditorsPick { get; private set; }

    public bool IsDeleted { get; private set; }

    public Guid CategoryId { get; private set; }

    public Guid AuthorId { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public byte[] RowVersion { get; private set; } = [];

    public Category? Category { get; private set; }

    public User? Author { get; private set; }

    public IReadOnlyCollection<TutorialStep> Steps => _steps.OrderBy(step => step.Order).ToArray();

    public IReadOnlyCollection<TutorialTag> TutorialTags => _tutorialTags;

    public static Tutorial Create(
        string slug,
        string title,
        string summary,
        DifficultyLevel difficultyLevel,
        int estimatedMinutes,
        Guid categoryId,
        Guid authorId,
        DateTimeOffset now)
    {
        return new Tutorial(
            Guid.NewGuid(),
            slug,
            title,
            summary,
            difficultyLevel,
            estimatedMinutes,
            categoryId,
            authorId,
            now);
    }

    public void UpdateDetails(
        string slug,
        string title,
        string summary,
        DifficultyLevel difficultyLevel,
        int estimatedMinutes,
        Guid categoryId,
        DateTimeOffset now)
    {
        SetSlug(slug);
        Title = NormalizeRequired(title, nameof(title));
        Summary = summary.Trim();
        DifficultyLevel = difficultyLevel;
        EstimatedMinutes = RequirePositive(estimatedMinutes, nameof(estimatedMinutes));
        CategoryId = categoryId;
        Touch(now);
    }

    public void SetSlug(string slug)
    {
        var normalized = NormalizeRequired(slug, nameof(slug));
        if (IsPublished && !string.Equals(Slug, normalized, StringComparison.Ordinal))
        {
            throw new DomainRuleException("Tutorial slug is immutable once the tutorial is published.");
        }

        Slug = normalized;
    }

    public void ReplaceSteps(IEnumerable<TutorialStepDraft> drafts, DateTimeOffset now)
    {
        var orderedDrafts = drafts.ToArray();
        _steps.Clear();

        for (var index = 0; index < orderedDrafts.Length; index++)
        {
            var draft = orderedDrafts[index];
            _steps.Add(TutorialStep.Create(
                Guid.NewGuid(),
                Id,
                index + 1,
                draft.Title,
                draft.BodyMarkdown,
                draft.CodeSnippet,
                draft.CodeLanguage,
                draft.ImageMediaId));
        }

        AssertContiguousSteps();
        Touch(now);
    }

    public void ReorderSteps(IReadOnlyList<Guid> stepIds, DateTimeOffset now)
    {
        if (stepIds.Count != _steps.Count || stepIds.Distinct().Count() != _steps.Count)
        {
            throw new DomainRuleException("Step order must include every step exactly once.");
        }

        var stepsById = _steps.ToDictionary(step => step.Id);
        for (var index = 0; index < stepIds.Count; index++)
        {
            if (!stepsById.TryGetValue(stepIds[index], out var step))
            {
                throw new DomainRuleException("Step order contains a step that does not belong to the tutorial.");
            }

            step.SetOrder(index + 1);
        }

        AssertContiguousSteps();
        Touch(now);
    }

    public void SetTags(IEnumerable<Guid> tagIds)
    {
        _tutorialTags.Clear();
        foreach (var tagId in tagIds.Distinct())
        {
            _tutorialTags.Add(new TutorialTag(Id, tagId));
        }
    }

    public void Publish(DateTimeOffset now)
    {
        if (_steps.Count == 0)
        {
            throw new DomainRuleException("A tutorial must have at least one step before it can be published.");
        }

        if (string.IsNullOrWhiteSpace(Summary))
        {
            throw new DomainRuleException("A tutorial must have a non-empty summary before it can be published.");
        }

        IsPublished = true;
        Touch(now);
    }

    public void Unpublish(DateTimeOffset now)
    {
        IsPublished = false;
        IsEditorsPick = false;
        Touch(now);
    }

    public void SetFeatured(bool isFeatured, DateTimeOffset now)
    {
        IsFeatured = isFeatured;
        Touch(now);
    }

    public void SetEditorsPick(bool isEditorsPick, DateTimeOffset now)
    {
        if (isEditorsPick && !IsPublished)
        {
            throw new DomainRuleException("Only a published tutorial can be the editor's pick.");
        }

        IsEditorsPick = isEditorsPick;
        Touch(now);
    }

    public void SoftDelete(DateTimeOffset now)
    {
        IsDeleted = true;
        IsPublished = false;
        IsFeatured = false;
        IsEditorsPick = false;
        Touch(now);
    }

    public void Touch(DateTimeOffset now) => UpdatedAt = now;

    private void AssertContiguousSteps()
    {
        var expected = 1;
        foreach (var step in _steps.OrderBy(step => step.Order))
        {
            if (step.Order != expected)
            {
                throw new DomainRuleException("Tutorial steps must be contiguous and ordered from 1 to N.");
            }

            expected++;
        }
    }

    private static string NormalizeRequired(string value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainRuleException($"{name} is required.");
        }

        return value.Trim();
    }

    private static int RequirePositive(int value, string name)
    {
        if (value <= 0)
        {
            throw new DomainRuleException($"{name} must be greater than zero.");
        }

        return value;
    }
}

public sealed record TutorialStepDraft(
    string Title,
    string BodyMarkdown,
    string? CodeSnippet = null,
    string? CodeLanguage = null,
    Guid? ImageMediaId = null);

public sealed class TutorialStep
{
    private TutorialStep()
    {
    }

    private TutorialStep(
        Guid id,
        Guid tutorialId,
        int order,
        string title,
        string bodyMarkdown,
        string? codeSnippet,
        string? codeLanguage,
        Guid? imageMediaId)
    {
        Id = id;
        TutorialId = tutorialId;
        SetOrder(order);
        Title = RequireText(title, nameof(title));
        BodyMarkdown = RequireText(bodyMarkdown, nameof(bodyMarkdown));
        CodeSnippet = string.IsNullOrWhiteSpace(codeSnippet) ? null : codeSnippet;
        CodeLanguage = string.IsNullOrWhiteSpace(codeLanguage) ? null : codeLanguage.Trim();
        ImageMediaId = imageMediaId;
    }

    public Guid Id { get; private set; }

    public Guid TutorialId { get; private set; }

    public int Order { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string BodyMarkdown { get; private set; } = string.Empty;

    public string? CodeSnippet { get; private set; }

    public string? CodeLanguage { get; private set; }

    public Guid? ImageMediaId { get; private set; }

    public Tutorial? Tutorial { get; private set; }

    public Media? ImageMedia { get; private set; }

    public static TutorialStep Create(
        Guid id,
        Guid tutorialId,
        int order,
        string title,
        string bodyMarkdown,
        string? codeSnippet,
        string? codeLanguage,
        Guid? imageMediaId)
    {
        return new TutorialStep(id, tutorialId, order, title, bodyMarkdown, codeSnippet, codeLanguage, imageMediaId);
    }

    public void SetOrder(int order)
    {
        if (order <= 0)
        {
            throw new DomainRuleException("Step order must be greater than zero.");
        }

        Order = order;
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

public sealed class Category
{
    private Category()
    {
    }

    private Category(Guid id, string slug, string name, int order)
    {
        Id = id;
        Update(slug, name, order);
    }

    public Guid Id { get; private set; }

    public string Slug { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public int Order { get; private set; }

    public byte[] RowVersion { get; private set; } = [];

    public static Category Create(string slug, string name, int order) => new(Guid.NewGuid(), slug, name, order);

    public void Update(string slug, string name, int order)
    {
        Slug = RequireText(slug, nameof(slug));
        Name = RequireText(name, nameof(name));
        Order = order;
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

public sealed class Tag
{
    private Tag()
    {
    }

    private Tag(Guid id, string slug, string name)
    {
        Id = id;
        Update(slug, name);
    }

    public Guid Id { get; private set; }

    public string Slug { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public byte[] RowVersion { get; private set; } = [];

    public static Tag Create(string slug, string name) => new(Guid.NewGuid(), slug, name);

    public void Update(string slug, string name)
    {
        Slug = RequireText(slug, nameof(slug));
        Name = RequireText(name, nameof(name));
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

public sealed class TutorialTag
{
    private TutorialTag()
    {
    }

    public TutorialTag(Guid tutorialId, Guid tagId)
    {
        TutorialId = tutorialId;
        TagId = tagId;
    }

    public Guid TutorialId { get; private set; }

    public Guid TagId { get; private set; }

    public Tutorial? Tutorial { get; private set; }

    public Tag? Tag { get; private set; }
}

public sealed class Media
{
    private Media()
    {
    }

    private Media(Guid id, string url, string fileName, string contentType, long sizeBytes, Guid uploadedById, DateTimeOffset uploadedAt)
    {
        Id = id;
        Url = RequireText(url, nameof(url));
        FileName = RequireText(fileName, nameof(fileName));
        ContentType = RequireText(contentType, nameof(contentType));
        SizeBytes = sizeBytes > 0 ? sizeBytes : throw new DomainRuleException("Media size must be greater than zero.");
        UploadedById = uploadedById;
        UploadedAt = uploadedAt;
    }

    public Guid Id { get; private set; }

    public string Url { get; private set; } = string.Empty;

    public string FileName { get; private set; } = string.Empty;

    public string ContentType { get; private set; } = string.Empty;

    public long SizeBytes { get; private set; }

    public Guid UploadedById { get; private set; }

    public DateTimeOffset UploadedAt { get; private set; }

    public User? UploadedBy { get; private set; }

    public static Media Create(string url, string fileName, string contentType, long sizeBytes, Guid uploadedById, DateTimeOffset uploadedAt)
    {
        return new Media(Guid.NewGuid(), url, fileName, contentType, sizeBytes, uploadedById, uploadedAt);
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

public sealed class Role
{
    private Role()
    {
    }

    public Role(Guid id, string name)
    {
        Id = id;
        Name = string.IsNullOrWhiteSpace(name) ? throw new DomainRuleException("Role name is required.") : name.Trim();
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;
}

public sealed class UserRole
{
    private UserRole()
    {
    }

    public UserRole(Guid userId, Guid roleId)
    {
        UserId = userId;
        RoleId = roleId;
    }

    public Guid UserId { get; private set; }

    public Guid RoleId { get; private set; }

    public User? User { get; private set; }

    public Role? Role { get; private set; }
}

public sealed class Bookmark
{
    private Bookmark()
    {
    }

    public Bookmark(Guid userId, Guid tutorialId, DateTimeOffset createdAt)
    {
        UserId = userId;
        TutorialId = tutorialId;
        CreatedAt = createdAt;
    }

    public Guid UserId { get; private set; }

    public Guid TutorialId { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public User? User { get; private set; }

    public Tutorial? Tutorial { get; private set; }
}

public sealed class TutorialProgress
{
    private TutorialProgress()
    {
    }

    public TutorialProgress(Guid userId, Guid tutorialId, Guid? currentStepId, IEnumerable<Guid> completedStepIds, DateTimeOffset updatedAt)
    {
        UserId = userId;
        TutorialId = tutorialId;
        Update(currentStepId, completedStepIds, updatedAt);
    }

    public Guid UserId { get; private set; }

    public Guid TutorialId { get; private set; }

    public Guid? CurrentStepId { get; private set; }

    public List<Guid> CompletedStepIds { get; private set; } = [];

    public DateTimeOffset UpdatedAt { get; private set; }

    public User? User { get; private set; }

    public Tutorial? Tutorial { get; private set; }

    public void Update(Guid? currentStepId, IEnumerable<Guid> completedStepIds, DateTimeOffset updatedAt)
    {
        CurrentStepId = currentStepId;
        CompletedStepIds = completedStepIds.Distinct().ToList();
        UpdatedAt = updatedAt;
    }
}
