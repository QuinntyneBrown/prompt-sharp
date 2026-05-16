namespace PromptSharp.Application.Projects;

public sealed record ProjectListResponseDto(
    IReadOnlyList<ProjectSummaryDto> Items,
    int Page,
    int PageSize,
    int Total);
