using System.Xml.Linq;
using FluentAssertions;

namespace PromptSharp.Application.Tests;

public sealed class ArchitectureTests
{
    [Fact]
    public void Domain_has_no_project_references()
    {
        var project = LoadProject("src", "PromptSharp.Domain", "PromptSharp.Domain.csproj");

        ProjectReferences(project).Should().BeEmpty();
    }

    [Fact]
    public void Application_does_not_reference_infrastructure()
    {
        var project = LoadProject("src", "PromptSharp.Application", "PromptSharp.Application.csproj");

        ProjectReferences(project).Should().NotContain(reference => reference.Contains("PromptSharp.Infrastructure"));
    }

    private static XDocument LoadProject(params string[] relativePath)
    {
        var root = FindBackendRoot();
        return XDocument.Load(Path.Combine([root, .. relativePath]));
    }

    private static string[] ProjectReferences(XDocument project)
    {
        return project
            .Descendants("ProjectReference")
            .Select(element => element.Attribute("Include")?.Value)
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => value!)
            .ToArray();
    }

    private static string FindBackendRoot()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            if (File.Exists(Path.Combine(directory.FullName, "PromptSharp.sln")))
            {
                return directory.FullName;
            }

            directory = directory.Parent;
        }

        throw new DirectoryNotFoundException("Could not find backend root.");
    }
}
