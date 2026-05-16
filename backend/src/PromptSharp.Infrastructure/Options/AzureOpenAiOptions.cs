namespace PromptSharp.Infrastructure.Options;

public sealed class AzureOpenAiOptions
{
    public string Endpoint { get; init; } = string.Empty;

    public string DeploymentName { get; init; } = string.Empty;

    public string ApiKey { get; init; } = string.Empty;
}
