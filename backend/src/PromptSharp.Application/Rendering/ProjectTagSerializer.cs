using System.Text.Json;

namespace PromptSharp.Application.Rendering;

public static class ProjectTagSerializer
{
    public static string Serialize(IEnumerable<string> tags)
    {
        var normalized = tags
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return JsonSerializer.Serialize(normalized);
    }

    public static IReadOnlyList<string> Deserialize(string tagsJson)
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
