using PromptSharp.Domain.Enums;
using PromptSharp.Domain.Validation;

namespace PromptSharp.Domain.Entities;

public sealed class Project
{
    private readonly List<Phase> _phases = [];

    private Project()
    {
    }

    private Project(Guid userId, string idea, DateTimeOffset createdAtUtc)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Idea = DomainGuard.Required(idea, "Idea", 4000);
        Status = ProjectStatus.InProgress;
        GenerationStatus = GenerationStatus.Queued;
        CreatedAtUtc = createdAtUtc;
        UpdatedAtUtc = createdAtUtc;
    }

    public Guid Id { get; private set; }

    public int ProjectNumber { get; private set; }

    public Guid UserId { get; private set; }

    public User? User { get; private set; }

    public string Idea { get; private set; } = string.Empty;

    public ProjectStatus Status { get; private set; }

    public GenerationStatus GenerationStatus { get; private set; }

    public string? Estimate { get; private set; }

    public string? Markdown { get; private set; }

    public string? RawAiResponse { get; private set; }

    public string? GenerationError { get; private set; }

    public string? SkillBundleVersion { get; private set; }

    public string? SkillBundleHash { get; private set; }

    public string? AzureDeploymentName { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public DateTimeOffset UpdatedAtUtc { get; private set; }

    public DateTimeOffset? GeneratedAtUtc { get; private set; }

    public DateTimeOffset? ArchivedAtUtc { get; private set; }

    public IReadOnlyCollection<Phase> Phases => _phases.AsReadOnly();

    public static Project Create(Guid userId, string idea, DateTimeOffset createdAtUtc)
    {
        if (userId == Guid.Empty)
        {
            throw new DomainRuleException("User id is required.");
        }

        return new Project(userId, idea, createdAtUtc);
    }

    public void MarkRunning(DateTimeOffset nowUtc)
    {
        GenerationStatus = GenerationStatus.Running;
        GenerationError = null;
        UpdatedAtUtc = nowUtc;
    }

    public void MarkGenerated(
        string estimate,
        string rawAiResponse,
        string markdown,
        string skillBundleVersion,
        string skillBundleHash,
        string? azureDeploymentName,
        DateTimeOffset generatedAtUtc)
    {
        Estimate = DomainGuard.Required(estimate, "Estimate", 80);
        RawAiResponse = DomainGuard.Required(rawAiResponse, "Raw AI response", 1_000_000);
        Markdown = DomainGuard.Required(markdown, "Markdown", 1_000_000);
        SkillBundleVersion = DomainGuard.Required(skillBundleVersion, "Skill bundle version", 128);
        SkillBundleHash = DomainGuard.Required(skillBundleHash, "Skill bundle hash", 128);
        AzureDeploymentName = string.IsNullOrWhiteSpace(azureDeploymentName) ? null : azureDeploymentName.Trim();
        GenerationStatus = GenerationStatus.Succeeded;
        GenerationError = null;
        GeneratedAtUtc = generatedAtUtc;
        UpdatedAtUtc = generatedAtUtc;
    }

    public void MarkFailed(string sanitizedError, DateTimeOffset failedAtUtc)
    {
        GenerationStatus = GenerationStatus.Failed;
        GenerationError = DomainGuard.Required(sanitizedError, "Generation error", 1000);
        UpdatedAtUtc = failedAtUtc;
    }

    public void ReplacePhases(IEnumerable<Phase> phases)
    {
        _phases.Clear();
        _phases.AddRange(phases.OrderBy(phase => phase.Order));
        EnsureContiguousPhaseOrder();
    }

    public void UpdateStatus(ProjectStatus status, DateTimeOffset nowUtc)
    {
        Status = status;
        ArchivedAtUtc = status == ProjectStatus.Archived ? nowUtc : null;
        UpdatedAtUtc = nowUtc;
    }

    public int PromptCount()
    {
        return _phases.Sum(phase => phase.Prompts.Count);
    }

    public void EnsureContiguousPhaseOrder()
    {
        var expected = 1;
        foreach (var phase in _phases.OrderBy(phase => phase.Order))
        {
            if (phase.Order != expected)
            {
                throw new DomainRuleException("Phase order must start at 1 and contain no gaps.");
            }

            phase.EnsureContiguousPromptOrder();
            expected++;
        }
    }
}
