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

public interface IDatabaseSeeder
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public sealed class HttpCurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    public bool IsAuthenticated => httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true;

    public string? Subject => FindFirst(ClaimTypes.NameIdentifier, "sub");

    public string? Email => FindFirst(ClaimTypes.Email, "email");

    public string? DisplayName => FindFirst(ClaimTypes.Name, "name") ?? Email ?? Subject;

    public string? AvatarUrl => FindFirst("picture");

    public IReadOnlyCollection<string> Roles => httpContextAccessor.HttpContext?.User.Claims
        .Where(claim => claim.Type is ClaimTypes.Role or "role" or "roles")
        .Select(claim => claim.Value)
        .Where(value => !string.IsNullOrWhiteSpace(value))
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray() ?? [];

    private string? FindFirst(params string[] claimTypes)
    {
        return claimTypes
            .Select(type => httpContextAccessor.HttpContext?.User.FindFirst(type)?.Value)
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));
    }
}

public sealed class DatabaseClaimsTransformation(PromptSharpDbContext dbContext) : IClaimsTransformation
{
    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity?.IsAuthenticated != true)
        {
            return principal;
        }

        var subject = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        if (string.IsNullOrWhiteSpace(subject))
        {
            return principal;
        }

        var roles = await dbContext.Users
            .AsNoTracking()
            .Where(user => user.Sub == subject)
            .SelectMany(user => user.UserRoles.Select(userRole => userRole.Role!.Name))
            .ToArrayAsync();

        if (roles.Length == 0)
        {
            return principal;
        }

        var identity = new ClaimsIdentity();
        foreach (var role in roles.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            if (!principal.IsInRole(role))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }
        }

        principal.AddIdentity(identity);
        return principal;
    }
}

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

public sealed class DatabaseSeeder(
    PromptSharpDbContext dbContext,
    IOptions<AppSettingsOptions> options,
    TimeProvider timeProvider) : IDatabaseSeeder
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        foreach (var roleName in RoleNames.All)
        {
            if (!await dbContext.Roles.AnyAsync(role => role.Name == roleName, cancellationToken))
            {
                dbContext.Roles.Add(new Role(Guid.NewGuid(), roleName));
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        await SeedBootstrapAdmin(cancellationToken);
    }

    private async Task SeedBootstrapAdmin(CancellationToken cancellationToken)
    {
        var email = options.Value.BootstrapAdminEmail?.Trim();
        if (string.IsNullOrWhiteSpace(email))
        {
            return;
        }

        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .SingleOrDefaultAsync(entity => entity.Email == email, cancellationToken);

        if (user is null)
        {
            user = User.Create($"bootstrap:{email}", email, "Bootstrap Admin", null, timeProvider.GetUtcNow());
            dbContext.Users.Add(user);
        }

        var roleIds = await dbContext.Roles
            .Where(role => RoleNames.All.Contains(role.Name))
            .Select(role => role.Id)
            .ToArrayAsync(cancellationToken);

        user.ReplaceRoles(roleIds);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
