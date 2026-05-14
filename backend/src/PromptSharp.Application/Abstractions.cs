using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

public interface IRequestIntent;

public interface IQuery<out TResponse> : IRequest<TResponse>, IRequestIntent;

public interface ICommandMarker : IRequestIntent;

public interface ICommand : IRequest, ICommandMarker;

public interface ICommand<out TResponse> : IRequest<TResponse>, ICommandMarker;

public interface IPromptSharpDbContext
{
    DbSet<Tutorial> Tutorials { get; }

    DbSet<TutorialStep> TutorialSteps { get; }

    DbSet<Category> Categories { get; }

    DbSet<Tag> Tags { get; }

    DbSet<TutorialTag> TutorialTags { get; }

    DbSet<Media> Media { get; }

    DbSet<User> Users { get; }

    DbSet<Role> Roles { get; }

    DbSet<UserRole> UserRoles { get; }

    DbSet<Bookmark> Bookmarks { get; }

    DbSet<TutorialProgress> TutorialProgress { get; }

    DatabaseFacade Database { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    string? Subject { get; }

    string? Email { get; }

    string? DisplayName { get; }

    string? AvatarUrl { get; }

    IReadOnlyCollection<string> Roles { get; }

    bool IsInRole(string role) => Roles.Any(current => string.Equals(current, role, StringComparison.OrdinalIgnoreCase));
}

public interface IMediaStore
{
    Task<StoredMedia> SaveAsync(string fileName, string contentType, Stream content, CancellationToken cancellationToken);

    Task DeleteAsync(string url, CancellationToken cancellationToken);
}

public interface IBootstrapAdminProvider
{
    string? BootstrapAdminEmail { get; }
}

public sealed record StoredMedia(string Url, string FileName, string ContentType, long SizeBytes);

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
public sealed class AuthorizeRequestAttribute : Attribute
{
    public AuthorizeRequestAttribute(params string[] roles)
    {
        Roles = roles;
    }

    public IReadOnlyCollection<string> Roles { get; }
}

public sealed class NotFoundException(string message) : Exception(message);

public sealed class ForbiddenException(string message) : Exception(message);

public sealed class ConflictException(string message) : Exception(message);

public static class ApplicationAssembly
{
    public static readonly System.Reflection.Assembly Assembly = typeof(ApplicationAssembly).Assembly;
}
