using PromptSharp.Application;

namespace PromptSharp.Infrastructure;

public sealed class AppSettingsOptions : IBootstrapAdminProvider
{
    public const string SectionName = "AppSettings";

    public string? BootstrapAdminEmail { get; set; }

    public CorsOptions Cors { get; set; } = new();

    public MediaOptions Media { get; set; } = new();

    public OpenTelemetryOptions OpenTelemetry { get; set; } = new();
}

public sealed class CorsOptions
{
    public string[] AllowedOrigins { get; set; } = [];
}

public sealed class MediaOptions
{
    public string Provider { get; set; } = "Local";

    public string LocalRoot { get; set; } = "App_Data/media";

    public string? AzureConnectionString { get; set; }

    public string AzureContainerName { get; set; } = "media";

    public string? CdnBaseUrl { get; set; }
}

public sealed class OpenTelemetryOptions
{
    public bool Enabled { get; set; }
}
