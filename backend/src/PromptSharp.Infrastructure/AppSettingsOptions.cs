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
