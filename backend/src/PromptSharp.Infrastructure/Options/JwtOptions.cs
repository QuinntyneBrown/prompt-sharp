namespace PromptSharp.Infrastructure.Options;

public sealed class JwtOptions
{
    public string Issuer { get; init; } = "PromptSharp";

    public string Audience { get; init; } = "PromptSharp.Web";

    public string SigningKey { get; init; } = string.Empty;

    public int AccessTokenMinutes { get; init; } = 15;

    public int RefreshTokenDays { get; init; } = 30;
}
