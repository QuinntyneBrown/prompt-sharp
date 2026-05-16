using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Rendering;

public sealed class ProjectMarkdownRenderer
{
    public string Render(Project project)
    {
        return Render(project, null);
    }

    public string Render(Project project, string? estimateOverride)
    {
        var lines = new List<string>
        {
            $"# {project.Idea}",
            string.Empty,
            $"Project No. {project.ProjectNumber:D4} - {project.PromptCount()} prompts - {project.Phases.Count} phases - est. {estimateOverride ?? project.Estimate ?? "Generating"}",
            string.Empty
        };

        foreach (var phase in project.Phases.OrderBy(phase => phase.Order))
        {
            lines.Add($"## Phase {phase.Order:D2} - {phase.Title}");
            lines.Add(string.Empty);

            foreach (var prompt in phase.Prompts.OrderBy(prompt => prompt.Order))
            {
                lines.Add($"### {prompt.Order:D2}. {prompt.Title}");
                var tags = ProjectTagSerializer.Deserialize(prompt.TagsJson);
                if (tags.Count > 0)
                {
                    lines.Add($"Tags: {string.Join(", ", tags)}");
                }

                lines.Add(string.Empty);
                lines.Add(prompt.Body);
                lines.Add(string.Empty);
            }
        }

        return string.Join(Environment.NewLine, lines).TrimEnd() + Environment.NewLine;
    }
}
