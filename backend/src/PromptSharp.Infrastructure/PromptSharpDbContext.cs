using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using PromptSharp.Application;
using PromptSharp.Domain;

namespace PromptSharp.Infrastructure;

public sealed class PromptSharpDbContext(DbContextOptions<PromptSharpDbContext> options) : DbContext(options), IPromptSharpDbContext
{
    public DbSet<Tutorial> Tutorials => Set<Tutorial>();

    public DbSet<TutorialStep> TutorialSteps => Set<TutorialStep>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Tag> Tags => Set<Tag>();

    public DbSet<TutorialTag> TutorialTags => Set<TutorialTag>();

    public DbSet<Media> Media => Set<Media>();

    public DbSet<User> Users => Set<User>();

    public DbSet<Role> Roles => Set<Role>();

    public DbSet<UserRole> UserRoles => Set<UserRole>();

    public DbSet<Bookmark> Bookmarks => Set<Bookmark>();

    public DbSet<TutorialProgress> TutorialProgress => Set<TutorialProgress>();

    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureTutorial(modelBuilder);
        ConfigureTutorialStep(modelBuilder);
        ConfigureCategory(modelBuilder);
        ConfigureTag(modelBuilder);
        ConfigureTutorialTag(modelBuilder);
        ConfigureMedia(modelBuilder);
        ConfigureUser(modelBuilder);
        ConfigureRole(modelBuilder);
        ConfigureUserRole(modelBuilder);
        ConfigureBookmark(modelBuilder);
        ConfigureTutorialProgress(modelBuilder);
        ConfigureContactSubmission(modelBuilder);
    }

    private static void ConfigureTutorial(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Tutorial>();
        builder.ToTable("Tutorials");
        builder.HasKey(tutorial => tutorial.Id);
        builder.HasQueryFilter(tutorial => !tutorial.IsDeleted);
        builder.HasIndex(tutorial => tutorial.Slug).IsUnique().HasFilter("[IsDeleted] = 0");
        builder.Property(tutorial => tutorial.Slug).HasMaxLength(160).IsRequired();
        builder.Property(tutorial => tutorial.Title).HasMaxLength(220).IsRequired();
        builder.Property(tutorial => tutorial.Summary).HasMaxLength(1000).IsRequired();
        builder.Property(tutorial => tutorial.RowVersion).IsRowVersion();

        builder.HasOne(tutorial => tutorial.Category)
            .WithMany()
            .HasForeignKey(tutorial => tutorial.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(tutorial => tutorial.Author)
            .WithMany()
            .HasForeignKey(tutorial => tutorial.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(tutorial => tutorial.Steps)
            .WithOne(step => step.Tutorial)
            .HasForeignKey(step => step.TutorialId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(tutorial => tutorial.Steps).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(tutorial => tutorial.TutorialTags)
            .WithOne(tutorialTag => tutorialTag.Tutorial)
            .HasForeignKey(tutorialTag => tutorialTag.TutorialId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(tutorial => tutorial.TutorialTags).UsePropertyAccessMode(PropertyAccessMode.Field);
    }

    private static void ConfigureTutorialStep(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<TutorialStep>();
        builder.ToTable("TutorialSteps");
        builder.HasKey(step => step.Id);
        builder.HasQueryFilter(step => !step.Tutorial!.IsDeleted);
        builder.HasIndex(step => new { step.TutorialId, step.Order }).IsUnique();
        builder.Property(step => step.Title).HasMaxLength(220).IsRequired();
        builder.Property(step => step.BodyMarkdown).IsRequired();
        builder.Property(step => step.CodeLanguage).HasMaxLength(40);

        builder.HasOne(step => step.ImageMedia)
            .WithMany()
            .HasForeignKey(step => step.ImageMediaId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureCategory(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Category>();
        builder.ToTable("Categories");
        builder.HasKey(category => category.Id);
        builder.HasIndex(category => category.Slug).IsUnique();
        builder.Property(category => category.Slug).HasMaxLength(160).IsRequired();
        builder.Property(category => category.Name).HasMaxLength(160).IsRequired();
        builder.Property(category => category.RowVersion).IsRowVersion();
    }

    private static void ConfigureTag(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Tag>();
        builder.ToTable("Tags");
        builder.HasKey(tag => tag.Id);
        builder.HasIndex(tag => tag.Slug).IsUnique();
        builder.Property(tag => tag.Slug).HasMaxLength(160).IsRequired();
        builder.Property(tag => tag.Name).HasMaxLength(160).IsRequired();
        builder.Property(tag => tag.RowVersion).IsRowVersion();
    }

    private static void ConfigureTutorialTag(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<TutorialTag>();
        builder.ToTable("TutorialTags");
        builder.HasKey(tutorialTag => new { tutorialTag.TutorialId, tutorialTag.TagId });
        builder.HasQueryFilter(tutorialTag => !tutorialTag.Tutorial!.IsDeleted);

        builder.HasOne(tutorialTag => tutorialTag.Tag)
            .WithMany()
            .HasForeignKey(tutorialTag => tutorialTag.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureMedia(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Media>();
        builder.ToTable("Media");
        builder.HasKey(media => media.Id);
        builder.Property(media => media.Url).HasMaxLength(1024).IsRequired();
        builder.Property(media => media.FileName).HasMaxLength(260).IsRequired();
        builder.Property(media => media.ContentType).HasMaxLength(120).IsRequired();

        builder.HasOne(media => media.UploadedBy)
            .WithMany()
            .HasForeignKey(media => media.UploadedById)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<User>();
        builder.ToTable("Users");
        builder.HasKey(user => user.Id);
        builder.HasIndex(user => user.Sub).IsUnique();
        builder.HasIndex(user => user.Email);
        builder.Property(user => user.Sub).HasMaxLength(300).IsRequired();
        builder.Property(user => user.Email).HasMaxLength(320).IsRequired();
        builder.Property(user => user.DisplayName).HasMaxLength(200).IsRequired();
        builder.Property(user => user.AvatarUrl).HasMaxLength(1024);

        builder.HasMany(user => user.UserRoles)
            .WithOne(userRole => userRole.User)
            .HasForeignKey(userRole => userRole.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(user => user.UserRoles).UsePropertyAccessMode(PropertyAccessMode.Field);
    }

    private static void ConfigureRole(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Role>();
        builder.ToTable("Roles");
        builder.HasKey(role => role.Id);
        builder.HasIndex(role => role.Name).IsUnique();
        builder.Property(role => role.Name).HasMaxLength(64).IsRequired();
    }

    private static void ConfigureUserRole(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<UserRole>();
        builder.ToTable("UserRoles");
        builder.HasKey(userRole => new { userRole.UserId, userRole.RoleId });
        builder.HasOne(userRole => userRole.Role)
            .WithMany()
            .HasForeignKey(userRole => userRole.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureBookmark(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Bookmark>();
        builder.ToTable("Bookmarks");
        builder.HasKey(bookmark => new { bookmark.UserId, bookmark.TutorialId });
        builder.HasQueryFilter(bookmark => !bookmark.Tutorial!.IsDeleted);
        builder.HasOne(bookmark => bookmark.User)
            .WithMany()
            .HasForeignKey(bookmark => bookmark.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(bookmark => bookmark.Tutorial)
            .WithMany()
            .HasForeignKey(bookmark => bookmark.TutorialId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureTutorialProgress(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<TutorialProgress>();
        builder.ToTable("TutorialProgress");
        builder.HasKey(progress => new { progress.UserId, progress.TutorialId });
        builder.HasQueryFilter(progress => !progress.Tutorial!.IsDeleted);
        builder.Property(progress => progress.CompletedStepIds)
            .HasConversion(
                value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null),
                value => JsonSerializer.Deserialize<List<Guid>>(value, (JsonSerializerOptions?)null) ?? new List<Guid>())
            .Metadata.SetValueComparer(new ValueComparer<List<Guid>>(
                (left, right) => left != null && right != null && left.SequenceEqual(right),
                value => value.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
                value => value.ToList()));

        builder.HasOne(progress => progress.User)
            .WithMany()
            .HasForeignKey(progress => progress.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(progress => progress.Tutorial)
            .WithMany()
            .HasForeignKey(progress => progress.TutorialId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureContactSubmission(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<ContactSubmission>();
        builder.ToTable("ContactSubmissions");
        builder.HasKey(submission => submission.Id);
        builder.Property(submission => submission.Name).HasMaxLength(200).IsRequired();
        builder.Property(submission => submission.Email).HasMaxLength(320).IsRequired();
        builder.Property(submission => submission.Message).HasMaxLength(4000).IsRequired();
        builder.HasIndex(submission => submission.CreatedAt);
    }
}
