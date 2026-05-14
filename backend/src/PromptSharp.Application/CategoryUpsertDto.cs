using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record CategoryUpsertDto(string Slug, string Name, int Order);
