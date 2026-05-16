namespace PromptSharp.Application.Abstractions;

public interface IAzureDeploymentNameProvider
{
    string? DeploymentName { get; }
}
