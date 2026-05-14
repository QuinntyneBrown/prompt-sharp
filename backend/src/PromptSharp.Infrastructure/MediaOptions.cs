using PromptSharp.Application;

namespace PromptSharp.Infrastructure;

public sealed class MediaOptions
{
    public string Provider { get; set; } = "Local";

    public string LocalRoot { get; set; } = "App_Data/media";

    public string? AzureConnectionString { get; set; }

    public string AzureContainerName { get; set; } = "media";

    public string? CdnBaseUrl { get; set; }
}
