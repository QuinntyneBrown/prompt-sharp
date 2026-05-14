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

public sealed class AzureBlobMediaStore(IOptions<AppSettingsOptions> options) : IMediaStore
{
    private static readonly string[] AllowedContentTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

    public async Task<StoredMedia> SaveAsync(string fileName, string contentType, Stream content, CancellationToken cancellationToken)
    {
        if (!AllowedContentTypes.Contains(contentType, StringComparer.OrdinalIgnoreCase))
        {
            throw new ValidationException("Unsupported media content type.");
        }

        var mediaOptions = options.Value.Media;
        if (string.IsNullOrWhiteSpace(mediaOptions.AzureConnectionString))
        {
            throw new InvalidOperationException("Azure Blob media storage requires AppSettings:Media:AzureConnectionString.");
        }

        var container = new BlobContainerClient(mediaOptions.AzureConnectionString, mediaOptions.AzureContainerName);
        await container.CreateIfNotExistsAsync(PublicAccessType.None, cancellationToken: cancellationToken);

        var safeFileName = SanitizeFileName(fileName);
        var blobName = $"{Guid.NewGuid():N}_{safeFileName}";
        var blob = container.GetBlobClient(blobName);

        await using var uploadContent = await PrepareContent(contentType, content, cancellationToken);
        await blob.UploadAsync(
            uploadContent,
            new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
            },
            cancellationToken);

        var url = string.IsNullOrWhiteSpace(mediaOptions.CdnBaseUrl)
            ? blob.Uri.ToString()
            : $"{mediaOptions.CdnBaseUrl.TrimEnd('/')}/{blobName}";

        return new StoredMedia(url, safeFileName, contentType, uploadContent.Length);
    }

    public async Task DeleteAsync(string url, CancellationToken cancellationToken)
    {
        var mediaOptions = options.Value.Media;
        if (string.IsNullOrWhiteSpace(mediaOptions.AzureConnectionString))
        {
            return;
        }

        var blobName = GetBlobName(url);
        if (string.IsNullOrWhiteSpace(blobName))
        {
            return;
        }

        var container = new BlobContainerClient(mediaOptions.AzureConnectionString, mediaOptions.AzureContainerName);
        await container.GetBlobClient(blobName).DeleteIfExistsAsync(cancellationToken: cancellationToken);
    }

    private static async Task<Stream> PrepareContent(string contentType, Stream content, CancellationToken cancellationToken)
    {
        var memory = new MemoryStream();
        await content.CopyToAsync(memory, cancellationToken);
        memory.Position = 0;

        if (string.Equals(contentType, "image/svg+xml", StringComparison.OrdinalIgnoreCase))
        {
            using var reader = new StreamReader(memory, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, leaveOpen: true);
            var svg = await reader.ReadToEndAsync(cancellationToken);
            EnsureSafeSvg(svg);
            memory.Position = 0;
        }

        return memory;
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

    private static string GetBlobName(string url)
    {
        if (Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return Path.GetFileName(uri.AbsolutePath);
        }

        return Path.GetFileName(url);
    }

    private static void EnsureSafeSvg(string svg)
    {
        var lowered = svg.ToLowerInvariant();
        if (lowered.Contains("<script", StringComparison.Ordinal) ||
            lowered.Contains("javascript:", StringComparison.Ordinal) ||
            lowered.Contains(" onload=", StringComparison.Ordinal) ||
            lowered.Contains(" onerror=", StringComparison.Ordinal))
        {
            throw new ValidationException("SVG media contains unsafe content.");
        }
    }
}
