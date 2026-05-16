using System.Runtime.CompilerServices;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Generation;

namespace PromptSharp.Api.IntegrationTests.Support;

public sealed class FakeApiPromptPlanner(string json, TimeSpan? delay = null) : IAiPromptPlanner
{
    public async IAsyncEnumerable<ProjectGenerationUpdateDto> GenerateProjectPlanAsync(
        ProjectGenerationInput input,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        if (delay is { } value)
        {
            await Task.Delay(value, cancellationToken);
        }

        yield return new ProjectGenerationUpdateDto("token", "chunk", null, null, json, null);
    }
}
