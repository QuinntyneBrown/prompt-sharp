using System.Runtime.CompilerServices;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Generation;

namespace PromptSharp.Application.Tests.Support;

public sealed class FakeAiPromptPlanner(string json, bool fail = false) : IAiPromptPlanner
{
    public async IAsyncEnumerable<ProjectGenerationUpdateDto> GenerateProjectPlanAsync(
        ProjectGenerationInput input,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        await Task.Yield();
        cancellationToken.ThrowIfCancellationRequested();

        if (fail)
        {
            throw new InvalidOperationException("planner unavailable");
        }

        yield return new ProjectGenerationUpdateDto("token", "chunk", null, null, json, null);
    }
}
