using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record PagedResult<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount);
