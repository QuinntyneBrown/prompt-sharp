namespace PromptSharp.Domain;

public sealed class TutorialEditorialService
{
    public void MakeEditorsPick(Tutorial target, IEnumerable<Tutorial> tutorials, DateTimeOffset now)
    {
        foreach (var tutorial in tutorials.Where(tutorial => tutorial.Id != target.Id && tutorial.IsEditorsPick))
        {
            tutorial.SetEditorsPick(false, now);
        }

        target.SetEditorsPick(true, now);
    }
}
