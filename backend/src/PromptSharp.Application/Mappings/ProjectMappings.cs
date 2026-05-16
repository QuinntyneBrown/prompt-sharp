using System.Text.Json;
using PromptSharp.Application.Common;
using PromptSharp.Application.Projects;
using PromptSharp.Domain.Entities;
using PromptSharp.Domain.Enums;

namespace PromptSharp.Application.Mappings;

public static class ProjectMappings
{
    public static ProjectSummaryDto ToSummaryDto(this Project project, DateTimeOffset nowUtc)
    {
        return new ProjectSummaryDto(
            FormatProjectNumber(project.ProjectNumber),
            project.Idea,
            project.PromptCount(),
            LabelFormatter.Relative(project.CreatedAtUtc, nowUtc),
            ToDtoStatus(project.Status));
    }

    public static ProjectDto ToDto(this Project project, DateTimeOffset nowUtc)
    {
        var phases = project.Phases
            .OrderBy(phase => phase.Order)
            .Select(ToDto)
            .ToArray();

        return new ProjectDto(
            FormatProjectNumber(project.ProjectNumber),
            project.Idea,
            LabelFormatter.Relative(project.CreatedAtUtc, nowUtc),
            project.PromptCount(),
            phases.Length,
            project.Estimate ?? "Generating",
            ToDtoStatus(project.Status),
            phases);
    }

    public static string FormatProjectNumber(int projectNumber)
    {
        return projectNumber.ToString("D4");
    }

    public static string ToDtoStatus(ProjectStatus status)
    {
        return status switch
        {
            ProjectStatus.InProgress => "in progress",
            ProjectStatus.Shipped => "shipped",
            ProjectStatus.Archived => "archived",
            _ => "in progress"
        };
    }

    public static ProjectStatus ParseStatus(string status)
    {
        return status.Trim().ToLowerInvariant() switch
        {
            "in progress" => ProjectStatus.InProgress,
            "shipped" => ProjectStatus.Shipped,
            "archived" => ProjectStatus.Archived,
            _ => throw new ArgumentOutOfRangeException(nameof(status), "Unknown project status.")
        };
    }

    private static PhaseDto ToDto(Phase phase)
    {
        var prompts = phase.Prompts
            .OrderBy(prompt => prompt.Order)
            .Select(ToDto)
            .ToArray();

        return new PhaseDto(phase.Order.ToString("D2"), phase.Title, prompts);
    }

    private static PromptDto ToDto(PromptItem prompt)
    {
        return new PromptDto(
            prompt.Order.ToString("D2"),
            prompt.Title,
            prompt.Body,
            ReadTags(prompt.TagsJson));
    }

    private static IReadOnlyList<string> ReadTags(string tagsJson)
    {
        try
        {
            return JsonSerializer.Deserialize<string[]>(tagsJson) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }
}
