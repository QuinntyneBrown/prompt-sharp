using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using System.Text;
using System.Text.Json.Serialization;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OpenTelemetry.Trace;
using PromptSharp.Api;
using PromptSharp.Application;
using PromptSharp.Application.Behaviors;
using PromptSharp.Application.Features;
using PromptSharp.Domain;
using PromptSharp.Infrastructure;
using PromptSharp.Infrastructure.Services;
using Serilog;
using Serilog.Formatting.Compact;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, _, configuration) =>
{
    configuration.Enrich.FromLogContext();
    if (context.HostingEnvironment.IsDevelopment())
    {
        configuration.WriteTo.Console();
    }
    else
    {
        configuration.WriteTo.Console(new CompactJsonFormatter());
    }
});

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<PromptSharpExceptionHandler>();
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.AddOpenApi("v1");
builder.Services.AddResponseCaching();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
MediatorRequestStartupValidator.AssertAllRequestsDeclareIntent(ApplicationAssembly.Assembly);

var appSettings = builder.Configuration.GetSection(AppSettingsOptions.SectionName).Get<AppSettingsOptions>() ?? new AppSettingsOptions();
var publicRateLimit = builder.Configuration.GetValue("RateLimiting:PublicPermitLimit", 120);
var writeRateLimit = builder.Configuration.GetValue("RateLimiting:WritePermitLimit", 60);
builder.Services.AddCors(options =>
{
    options.AddPolicy("ConfiguredOrigins", policy =>
    {
        if (appSettings.Cors.AllowedOrigins.Length == 0)
        {
            policy.DisallowCredentials();
        }
        else
        {
            policy.WithOrigins(appSettings.Cors.AllowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("public", limiter =>
    {
        limiter.PermitLimit = publicRateLimit;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueLimit = 0;
    });
    options.AddPolicy("writes", httpContext =>
    {
        var key = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            httpContext.Connection.RemoteIpAddress?.ToString() ??
            "anonymous";

        return RateLimitPartition.GetFixedWindowLimiter(key, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = writeRateLimit,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0
        });
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwt = builder.Configuration.GetSection(JwtBearerResourceOptions.SectionName).Get<JwtBearerResourceOptions>() ??
            new JwtBearerResourceOptions();

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = !string.IsNullOrWhiteSpace(jwt.Issuer),
            ValidIssuer = jwt.Issuer,
            ValidateAudience = !string.IsNullOrWhiteSpace(jwt.Audience),
            ValidAudience = jwt.Audience,
            ValidateIssuerSigningKey = !string.IsNullOrWhiteSpace(jwt.SigningKey),
            IssuerSigningKey = string.IsNullOrWhiteSpace(jwt.SigningKey)
                ? null
                : new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SigningKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var principal = context.Principal;
                if (principal is null)
                {
                    return;
                }

                var subject = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
                if (string.IsNullOrWhiteSpace(subject))
                {
                    context.Fail("JWT is missing a subject claim.");
                    return;
                }

                var email = principal.FindFirstValue(ClaimTypes.Email) ?? principal.FindFirstValue(JwtRegisteredClaimNames.Email) ?? $"{subject}@unknown.local";
                var displayName = principal.FindFirstValue(ClaimTypes.Name) ?? principal.FindFirstValue("name") ?? email;
                var avatarUrl = principal.FindFirstValue("picture");

                var sender = context.HttpContext.RequestServices.GetRequiredService<ISender>();
                await sender.Send(new EnsureUserExistsCommand(subject, email, displayName, avatarUrl), CancellationToken.None);
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireUser", policy => policy.RequireAuthenticatedUser());
    options.AddPolicy("RequireEditor", policy => policy.RequireRole(RoleNames.Editor, RoleNames.Admin));
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole(RoleNames.Admin));
});

builder.Services.AddHealthChecks()
    .AddDbContextCheck<PromptSharpDbContext>("sql-server");

if (appSettings.OpenTelemetry.Enabled)
{
    builder.Services.AddOpenTelemetry()
        .WithTracing(tracing =>
        {
            tracing.AddAspNetCoreInstrumentation();
            tracing.AddHttpClientInstrumentation();
        });
}

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();
    if (app.Environment.IsDevelopment())
    {
        await dbContext.Database.MigrateAsync();
    }

    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
    await seeder.SeedAsync();
}

var configuredSettings = app.Services.GetRequiredService<IOptions<AppSettingsOptions>>().Value;
var mediaRoot = Path.IsPathRooted(configuredSettings.Media.LocalRoot)
    ? configuredSettings.Media.LocalRoot
    : Path.Combine(app.Environment.ContentRootPath, configuredSettings.Media.LocalRoot);
Directory.CreateDirectory(mediaRoot);

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors("ConfiguredOrigins");
app.UseResponseCaching();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(mediaRoot),
    RequestPath = "/media"
});

app.MapOpenApi("/openapi/{documentName}.json");
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false
});
app.MapHealthChecks("/health/ready");

app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

// Bearer tokens only; no cookies are issued or accepted, so CSRF protection is not required for this API.
app.MapControllers();

await app.RunAsync();

public partial class Program;
