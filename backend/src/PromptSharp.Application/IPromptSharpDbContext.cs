using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

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

    DbSet<ContactSubmission> ContactSubmissions { get; }

    DbSet<AuditEvent> AuditEvents { get; }

    DbSet<UserInvitation> UserInvitations { get; }

    DatabaseFacade Database { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
