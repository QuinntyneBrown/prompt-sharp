using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record BookmarkDto(TutorialListItemDto Tutorial, DateTimeOffset CreatedAt);
