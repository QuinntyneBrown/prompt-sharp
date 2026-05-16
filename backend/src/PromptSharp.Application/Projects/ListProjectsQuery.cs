using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Projects;

public sealed record ListProjectsQuery(
    string? Search,
    string? Status,
    int Page,
    int PageSize) : IQuery<ProjectListResponseDto>;
