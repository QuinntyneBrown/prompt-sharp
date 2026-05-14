namespace PromptSharp.Domain;

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
