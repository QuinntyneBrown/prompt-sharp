using System.Text.RegularExpressions;
using FluentAssertions;

namespace PromptSharp.Application.Tests;

public sealed partial class ArchitectureTests
{
    [Fact]
    public void Project_references_follow_clean_architecture()
    {
        var backend = FindBackendRoot();

        File.ReadAllText(Path.Combine(backend, "src", "PromptSharp.Domain", "PromptSharp.Domain.csproj"))
            .Should().NotContain("<ProjectReference");

        File.ReadAllText(Path.Combine(backend, "src", "PromptSharp.Application", "PromptSharp.Application.csproj"))
            .Should().Contain("PromptSharp.Domain.csproj")
            .And.NotContain("PromptSharp.Infrastructure.csproj")
            .And.NotContain("PromptSharp.Api.csproj");

        File.ReadAllText(Path.Combine(backend, "src", "PromptSharp.Infrastructure", "PromptSharp.Infrastructure.csproj"))
            .Should().Contain("PromptSharp.Application.csproj")
            .And.Contain("PromptSharp.Domain.csproj")
            .And.NotContain("PromptSharp.Api.csproj");

        File.ReadAllText(Path.Combine(backend, "src", "PromptSharp.Api", "PromptSharp.Api.csproj"))
            .Should().Contain("PromptSharp.Application.csproj")
            .And.Contain("PromptSharp.Infrastructure.csproj");
    }

    [Fact]
    public void Api_does_not_use_minimal_api_endpoint_shapes()
    {
        var apiSource = Path.Combine(FindBackendRoot(), "src", "PromptSharp.Api");
        var source = string.Join(Environment.NewLine, Directory.EnumerateFiles(apiSource, "*.cs", SearchOption.AllDirectories).Select(File.ReadAllText));

        source.Should().NotContain("MapGet(");
        source.Should().NotContain("MapPost(");
        source.Should().NotContain("MapGroup(");
    }

    [Fact]
    public void Each_csharp_file_declares_at_most_one_public_type()
    {
        var files = Directory.EnumerateFiles(Path.Combine(FindBackendRoot(), "src"), "*.cs", SearchOption.AllDirectories);
        var offenders = files
            .Select(file => new
            {
                File = file,
                PublicTypeCount = PublicTypeRegex().Matches(File.ReadAllText(file)).Count
            })
            .Where(result => result.PublicTypeCount > 1)
            .Select(result => Path.GetRelativePath(FindBackendRoot(), result.File))
            .ToArray();

        offenders.Should().BeEmpty();
    }

    [Fact]
    public void Mapper_libraries_are_not_referenced_and_mediatr_is_pinned()
    {
        var backend = FindBackendRoot();
        var packageProps = File.ReadAllText(Path.Combine(backend, "Directory.Packages.props"));
        packageProps.Should().NotContain("AutoMapper");
        packageProps.Should().Contain("<PackageVersion Include=\"MediatR\" Version=\"12.5.0\" />");

        var source = string.Join(Environment.NewLine, Directory.EnumerateFiles(Path.Combine(backend, "src"), "*.cs", SearchOption.AllDirectories).Select(File.ReadAllText));
        source.Should().NotContain("AutoMapper");
    }

    private static string FindBackendRoot()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var candidate = Path.Combine(current.FullName, "PromptSharp.sln");
            if (File.Exists(candidate))
            {
                return current.FullName;
            }

            current = current.Parent;
        }

        throw new DirectoryNotFoundException("Could not find backend root.");
    }

    [GeneratedRegex("""public\s+(?:sealed\s+|static\s+|partial\s+|abstract\s+)*(?:class|record|interface|enum)\s+""")]
    private static partial Regex PublicTypeRegex();
}
