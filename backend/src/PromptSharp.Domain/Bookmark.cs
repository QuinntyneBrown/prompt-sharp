namespace PromptSharp.Domain;

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
