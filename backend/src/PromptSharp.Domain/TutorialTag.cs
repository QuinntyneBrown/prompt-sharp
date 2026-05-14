namespace PromptSharp.Domain;

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
