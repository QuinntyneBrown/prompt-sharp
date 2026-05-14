namespace PromptSharp.Domain;

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
