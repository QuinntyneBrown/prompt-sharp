namespace PromptSharp.Application;

public sealed record AuditEventDto(
    Guid Id,
    string Actor,
    string Action,
    string TargetType,
    string TargetId,
    string TargetName,
    string Before,
    string After,
    DateTimeOffset ChangedAt);
