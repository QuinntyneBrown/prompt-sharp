public sealed class JwtBearerResourceOptions
{
    public const string SectionName = "Authentication:JwtBearer";

    public string? Issuer { get; set; }

    public string? Audience { get; set; }

    public string? SigningKey { get; set; }
}
