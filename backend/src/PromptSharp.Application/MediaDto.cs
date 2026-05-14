using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record MediaDto(
    Guid Id,
    string Url,
    string FileName,
    string ContentType,
    long SizeBytes,
    Guid UploadedById,
    DateTimeOffset UploadedAt);
