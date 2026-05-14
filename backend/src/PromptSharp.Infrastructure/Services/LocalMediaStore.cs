using System.Security.Claims;
using System.Text;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using PromptSharp.Application;
using PromptSharp.Domain;

namespace PromptSharp.Infrastructure.Services;

public sealed class LocalMediaStore(
    IOptions<AppSettingsOptions> options,
    IHostEnvironment hostEnvironment) : IMediaStore
{
    private static readonly string[] AllowedContentTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

    public async Task<StoredMedia> SaveAsync(string fileName, string contentType, Stream content, CancellationToken cancellationToken)
    {
        if (!AllowedContentTypes.Contains(contentType, StringComparer.OrdinalIgnoreCase))
        {
            throw new ValidationException("Unsupported media content type.");
        }

        var root = GetRoot();
        Directory.CreateDirectory(root);

        var safeFileName = SanitizeFileName(fileName);
        var storedFileName = $"{Guid.NewGuid():N}_{safeFileName}";
        var path = Path.Combine(root, storedFileName);

        if (string.Equals(contentType, "image/svg+xml", StringComparison.OrdinalIgnoreCase))
        {
            await SaveSanitizedSvg(path, content, cancellationToken);
        }
        else
        {
            await using var output = File.Create(path);
            await content.CopyToAsync(output, cancellationToken);
        }

        var info = new FileInfo(path);
        return new StoredMedia($"/media/{storedFileName}", safeFileName, contentType, info.Length);
    }

    public Task DeleteAsync(string url, CancellationToken cancellationToken)
    {
        var fileName = Path.GetFileName(url);
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return Task.CompletedTask;
        }

        var root = GetRoot();
        var path = Path.GetFullPath(Path.Combine(root, fileName));
        if (path.StartsWith(Path.GetFullPath(root), StringComparison.OrdinalIgnoreCase) && File.Exists(path))
        {
            File.Delete(path);
        }

        return Task.CompletedTask;
    }

    private string GetRoot()
    {
        var configuredRoot = options.Value.Media.LocalRoot;
        return Path.IsPathRooted(configuredRoot)
            ? configuredRoot
            : Path.Combine(hostEnvironment.ContentRootPath, configuredRoot);
    }

    private static string SanitizeFileName(string fileName)
    {
        var name = Path.GetFileName(fileName);
        foreach (var invalid in Path.GetInvalidFileNameChars())
        {
            name = name.Replace(invalid, '-');
        }

        return string.IsNullOrWhiteSpace(name) ? "upload" : name;
    }

    private static async Task SaveSanitizedSvg(string path, Stream content, CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(content, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, leaveOpen: false);
        var svg = await reader.ReadToEndAsync(cancellationToken);
        var lowered = svg.ToLowerInvariant();
        if (lowered.Contains("<script", StringComparison.Ordinal) ||
            lowered.Contains("javascript:", StringComparison.Ordinal) ||
            lowered.Contains(" onload=", StringComparison.Ordinal) ||
            lowered.Contains(" onerror=", StringComparison.Ordinal))
        {
            throw new ValidationException("SVG media contains unsafe content.");
        }

        await File.WriteAllTextAsync(path, svg, Encoding.UTF8, cancellationToken);
    }
}
