using Microsoft.Extensions.Options;
using PromptSharp.Application.Abstractions;
using PromptSharp.Infrastructure.Options;

namespace PromptSharp.Infrastructure.Auth;

public sealed class ConfiguredAzureDeploymentNameProvider(IOptions<AzureOpenAiOptions> options) : IAzureDeploymentNameProvider
{
    public string? DeploymentName => string.IsNullOrWhiteSpace(options.Value.DeploymentName)
        ? null
        : options.Value.DeploymentName;
}
