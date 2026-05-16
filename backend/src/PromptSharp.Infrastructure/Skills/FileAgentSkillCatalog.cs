using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using PromptSharp.Application.Abstractions;
using PromptSharp.Infrastructure.Options;

namespace PromptSharp.Infrastructure.Skills;

public sealed class FileAgentSkillCatalog(IOptions<AgentSkillOptions> options) : IAgentSkillCatalog
{
    public async Task<AgentSkillBundle> LoadBundleAsync(CancellationToken cancellationToken)
    {
        var rootPath = ResolveRootPath(options.Value.RootPath);
        var manifestPath = Path.Combine(rootPath, "manifest.json");
        if (!File.Exists(manifestPath))
        {
            throw new FileNotFoundException("Agent skills manifest was not found.", manifestPath);
        }

        await using var manifestStream = File.OpenRead(manifestPath);
        using var manifestJson = await JsonDocument.ParseAsync(manifestStream, cancellationToken: cancellationToken);
        var version = manifestJson.RootElement.GetProperty("version").GetString() ?? "unknown";
        var skillNames = manifestJson.RootElement.GetProperty("skills")
            .EnumerateArray()
            .Select(element => element.GetString())
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Cast<string>()
            .ToArray();

        var builder = new StringBuilder();
        foreach (var skillName in skillNames)
        {
            var skillPath = Path.Combine(rootPath, $"{skillName}.md");
            if (!File.Exists(skillPath))
            {
                throw new FileNotFoundException($"Agent skill file was not found: {skillName}.", skillPath);
            }

            builder.AppendLine($"# Skill: {skillName}");
            builder.AppendLine(await File.ReadAllTextAsync(skillPath, cancellationToken));
            builder.AppendLine();
        }

        var content = builder.ToString();
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(content))).ToLowerInvariant();
        return new AgentSkillBundle(version, hash, content);
    }

    private static string ResolveRootPath(string configuredPath)
    {
        if (!string.IsNullOrWhiteSpace(configuredPath))
        {
            return Path.GetFullPath(configuredPath);
        }

        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var candidate = Path.Combine(current.FullName, "skills", "agent-skills");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            current = current.Parent;
        }

        return Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "skills", "agent-skills"));
    }
}
