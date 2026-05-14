using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal static class TutorialMapper
{
    public static TutorialListItemDto ToListItem(Tutorial tutorial)
    {
        return new TutorialListItemDto(
            tutorial.Id,
            tutorial.Slug,
            tutorial.Title,
            tutorial.Summary,
            tutorial.DifficultyLevel,
            tutorial.EstimatedMinutes,
            tutorial.IsPublished,
            tutorial.IsFeatured,
            tutorial.IsEditorsPick,
            tutorial.Category?.Slug ?? string.Empty,
            tutorial.Category?.Name ?? string.Empty,
            tutorial.TutorialTags
                .Select(tutorialTag => tutorialTag.Tag?.Name)
                .Where(name => !string.IsNullOrWhiteSpace(name))
                .Select(name => name!)
                .Order(StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            tutorial.Steps.Count);
    }

    public static TutorialDetailDto ToDetail(Tutorial tutorial)
    {
        return new TutorialDetailDto(
            tutorial.Id,
            tutorial.Slug,
            tutorial.Title,
            tutorial.Summary,
            tutorial.DifficultyLevel,
            tutorial.EstimatedMinutes,
            tutorial.IsPublished,
            tutorial.IsFeatured,
            tutorial.IsEditorsPick,
            tutorial.CategoryId,
            tutorial.Category?.Slug ?? string.Empty,
            tutorial.Category?.Name ?? string.Empty,
            tutorial.AuthorId,
            tutorial.Author?.DisplayName ?? string.Empty,
            tutorial.CreatedAt,
            tutorial.UpdatedAt,
            tutorial.Steps
                .OrderBy(step => step.Order)
                .Select(step => new TutorialStepDto(
                    step.Id,
                    step.Order,
                    step.Title,
                    step.BodyMarkdown,
                    step.CodeSnippet,
                    step.CodeLanguage,
                    step.ImageMediaId))
                .ToArray(),
            tutorial.TutorialTags
                .Where(tutorialTag => tutorialTag.Tag is not null)
                .Select(tutorialTag => new TagDto(tutorialTag.Tag!.Id, tutorialTag.Tag.Slug, tutorialTag.Tag.Name))
                .OrderBy(tag => tag.Name)
                .ToArray());
    }

    public static UserDto ToUserDto(User user)
    {
        return new UserDto(
            user.Id,
            user.Sub,
            user.Email,
            user.DisplayName,
            user.AvatarUrl,
            user.CreatedAt,
            user.LastSeenAt,
            user.UserRoles
                .Select(userRole => userRole.Role?.Name)
                .Where(name => !string.IsNullOrWhiteSpace(name))
                .Select(name => name!)
                .Order(StringComparer.OrdinalIgnoreCase)
                .ToArray());
    }

    public static TutorialProgressDto ToProgressDto(TutorialProgress progress)
    {
        return new TutorialProgressDto(
            progress.UserId,
            progress.TutorialId,
            progress.CurrentStepId,
            progress.CompletedStepIds.ToArray(),
            progress.UpdatedAt);
    }

    public static MediaDto ToMediaDto(Media media)
    {
        return new MediaDto(
            media.Id,
            media.Url,
            media.FileName,
            media.ContentType,
            media.SizeBytes,
            media.UploadedById,
            media.UploadedAt);
    }
}
