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
        await SeedDevelopmentCatalog(cancellationToken);
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

    private async Task SeedDevelopmentCatalog(CancellationToken cancellationToken)
    {
        var now = timeProvider.GetUtcNow();
        var author = await EnsureUser("seed:admin", "ada.admin@example.com", "Ada Admin", now, cancellationToken);
        await EnsureUser("seed:editor", "erin.editor@example.com", "Erin Editor", now, cancellationToken);
        var learner = await EnsureUser("seed:learner", "alex.learner@example.com", "Alex Learner", now, cancellationToken);

        var dotnet = await EnsureCategory("dotnet", ".NET", 1, cancellationToken);
        var blazor = await EnsureCategory("blazor", "Blazor", 2, cancellationToken);
        var azureCategory = await EnsureCategory("azure", "Azure", 3, cancellationToken);

        var azure = await EnsureTag("azure", "Azure", cancellationToken);
        var cleanArchitecture = await EnsureTag("clean-architecture", "Clean Architecture", cancellationToken);
        var containerApps = await EnsureTag("container-apps", "Container Apps", cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        var cleanArchitectureTutorial = await EnsureTutorial(
            "build-dotnet-api-with-clean-architecture",
            "Build a .NET API with Clean Architecture",
            "Create a production-ready API using controllers, MediatR, EF Core, and SQL Server.",
            DifficultyLevel.Intermediate,
            45,
            dotnet.Id,
            author.Id,
            [azure.Id, cleanArchitecture.Id],
            [
                new TutorialStepDraft(
                    "Create the solution structure",
                    "Create separate API, Application, Domain, and Infrastructure projects.",
                    "dotnet new sln --name PromptSharp",
                    "Bash",
                    null),
                new TutorialStepDraft(
                    "Add the first endpoint",
                    "Wire a controller through MediatR and return data from SQL Server.",
                    "dotnet add package MediatR",
                    "Bash",
                    null)
            ],
            now,
            cancellationToken);

        var blazorTutorial = await EnsureTutorial(
            "ship-blazor-dashboard-with-azure-container-apps",
            "Ship a Blazor dashboard with Azure Container Apps",
            "Deploy a dashboard with containerized hosting, managed identity, and observability.",
            DifficultyLevel.Advanced,
            60,
            blazor.Id,
            author.Id,
            [azure.Id, containerApps.Id],
            [
                new TutorialStepDraft(
                    "Create the dashboard shell",
                    "Build the first Blazor dashboard page and prepare it for deployment.",
                    "dotnet new blazor -n PromptSharp.Dashboard",
                    "Bash",
                    null)
            ],
            now,
            cancellationToken);

        var azureTutorial = await EnsureTutorial(
            "publish-observable-apis-on-azure",
            "Publish observable APIs on Azure",
            "Add structured logs, traces, and deployment settings for Azure-hosted APIs.",
            DifficultyLevel.Beginner,
            30,
            azureCategory.Id,
            author.Id,
            [azure.Id],
            [
                new TutorialStepDraft(
                    "Enable health checks",
                    "Expose readiness and liveness checks before deploying.",
                    "builder.Services.AddHealthChecks();",
                    "CSharp",
                    null)
            ],
            now,
            cancellationToken);

        await EnsureMedia(
            "/media/promptsharp-diagram.svg",
            "promptsharp-diagram.svg",
            "image/svg+xml",
            512,
            author.Id,
            now,
            cancellationToken);

        foreach (var tutorial in new[] { cleanArchitectureTutorial, blazorTutorial, azureTutorial })
        {
            if (!tutorial.IsPublished)
            {
                tutorial.Publish(now);
            }
        }

        if (!cleanArchitectureTutorial.IsFeatured)
        {
            cleanArchitectureTutorial.SetFeatured(true, now);
        }
        if (!blazorTutorial.IsFeatured)
        {
            blazorTutorial.SetFeatured(true, now);
        }

        if (!cleanArchitectureTutorial.IsEditorsPick)
        {
            new TutorialEditorialService().MakeEditorsPick(cleanArchitectureTutorial, [cleanArchitectureTutorial, blazorTutorial, azureTutorial], now);
        }

        await EnsureAuditEvent(
            author.Email,
            "Publish tutorial",
            "Tutorial",
            cleanArchitectureTutorial.Id.ToString(),
            cleanArchitectureTutorial.Title,
            "Draft",
            "Published",
            now,
            cancellationToken);

        if (!await dbContext.Bookmarks.AnyAsync(bookmark =>
                bookmark.UserId == learner.Id && bookmark.TutorialId == cleanArchitectureTutorial.Id,
                cancellationToken))
        {
            dbContext.Bookmarks.Add(new Bookmark(learner.Id, cleanArchitectureTutorial.Id, now));
        }

        var firstStepId = cleanArchitectureTutorial.Steps.OrderBy(step => step.Order).FirstOrDefault()?.Id;
        if (firstStepId is not null && !await dbContext.TutorialProgress.AnyAsync(progress =>
                progress.UserId == learner.Id && progress.TutorialId == cleanArchitectureTutorial.Id,
                cancellationToken))
        {
            dbContext.TutorialProgress.Add(new TutorialProgress(
                learner.Id,
                cleanArchitectureTutorial.Id,
                firstStepId,
                [],
                now));
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureAuditEvent(
        string actor,
        string action,
        string targetType,
        string targetId,
        string targetName,
        string before,
        string after,
        DateTimeOffset changedAt,
        CancellationToken cancellationToken)
    {
        var exists = await dbContext.AuditEvents.AnyAsync(entity =>
            entity.Actor == actor &&
            entity.Action == action &&
            entity.TargetId == targetId,
            cancellationToken);

        if (exists)
        {
            return;
        }

        dbContext.AuditEvents.Add(AuditEvent.Create(actor, action, targetType, targetId, targetName, before, after, changedAt));
    }

    private async Task<User> EnsureUser(
        string subject,
        string email,
        string displayName,
        DateTimeOffset now,
        CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .SingleOrDefaultAsync(entity => entity.Sub == subject, cancellationToken);

        if (user is not null)
        {
            return user;
        }

        user = User.Create(subject, email, displayName, null, now);
        var roleIds = await dbContext.Roles
            .Where(role => RoleNames.All.Contains(role.Name))
            .Select(role => role.Id)
            .ToArrayAsync(cancellationToken);
        user.ReplaceRoles(roleIds);
        dbContext.Users.Add(user);
        return user;
    }

    private async Task<Category> EnsureCategory(string slug, string name, int order, CancellationToken cancellationToken)
    {
        var category = await dbContext.Categories.SingleOrDefaultAsync(entity => entity.Slug == slug, cancellationToken);
        if (category is not null)
        {
            return category;
        }

        category = Category.Create(slug, name, order);
        dbContext.Categories.Add(category);
        return category;
    }

    private async Task<Tag> EnsureTag(string slug, string name, CancellationToken cancellationToken)
    {
        var tag = await dbContext.Tags.SingleOrDefaultAsync(entity => entity.Slug == slug, cancellationToken);
        if (tag is not null)
        {
            return tag;
        }

        tag = Tag.Create(slug, name);
        dbContext.Tags.Add(tag);
        return tag;
    }

    private async Task<Tutorial> EnsureTutorial(
        string slug,
        string title,
        string summary,
        DifficultyLevel difficulty,
        int estimatedMinutes,
        Guid categoryId,
        Guid authorId,
        IReadOnlyList<Guid> tagIds,
        IReadOnlyList<TutorialStepDraft> steps,
        DateTimeOffset now,
        CancellationToken cancellationToken)
    {
        var tutorial = await dbContext.Tutorials
            .Include(entity => entity.Steps)
            .Include(entity => entity.TutorialTags)
            .SingleOrDefaultAsync(entity => entity.Slug == slug, cancellationToken);

        if (tutorial is null)
        {
            tutorial = Tutorial.Create(slug, title, summary, difficulty, estimatedMinutes, categoryId, authorId, now);
            dbContext.Tutorials.Add(tutorial);
        }
        else
        {
            return tutorial;
        }

        tutorial.SetTags(tagIds);
        tutorial.ReplaceSteps(steps, now);
        return tutorial;
    }

    private async Task<Media> EnsureMedia(
        string url,
        string fileName,
        string contentType,
        long sizeBytes,
        Guid uploadedById,
        DateTimeOffset uploadedAt,
        CancellationToken cancellationToken)
    {
        var media = await dbContext.Media
            .Where(entity => entity.FileName == fileName && entity.Url == url)
            .OrderBy(entity => entity.UploadedAt)
            .FirstOrDefaultAsync(cancellationToken);
        media ??= await dbContext.Media
            .Where(entity => entity.FileName == fileName)
            .OrderBy(entity => entity.UploadedAt)
            .FirstOrDefaultAsync(cancellationToken);
        if (media is not null)
        {
            return media;
        }

        media = Media.Create(url, fileName, contentType, sizeBytes, uploadedById, uploadedAt);
        dbContext.Media.Add(media);
        return media;
    }
}
