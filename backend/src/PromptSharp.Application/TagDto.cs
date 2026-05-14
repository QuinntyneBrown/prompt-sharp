using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record TagDto(Guid Id, string Slug, string Name);
