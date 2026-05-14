using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record UserRolesUpsertDto(IReadOnlyList<string> Roles);
