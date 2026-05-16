using PromptSharp.Application.Generation;

namespace PromptSharp.Application.Abstractions;

public interface IAiPromptPlanner
{
    IAsyncEnumerable<ProjectGenerationUpdateDto> GenerateProjectPlanAsync(
        ProjectGenerationInput input,
        CancellationToken cancellationToken);
}
