using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record CategoryDto(
    Guid Id,
    string Slug,
    string Name,
    int Order,
    int TutorialCount);
