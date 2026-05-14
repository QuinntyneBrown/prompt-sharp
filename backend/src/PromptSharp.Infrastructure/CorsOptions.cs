using PromptSharp.Application;

namespace PromptSharp.Infrastructure;

public sealed class CorsOptions
{
    public string[] AllowedOrigins { get; set; } = [];
}
