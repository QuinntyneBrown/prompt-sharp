using System.Security.Claims;
using System.Text;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using PromptSharp.Application;
using PromptSharp.Domain;

namespace PromptSharp.Infrastructure.Services;

public sealed class HttpCurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    public bool IsAuthenticated => httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true;

    public string? Subject => FindFirst(ClaimTypes.NameIdentifier, "sub");

    public string? Email => FindFirst(ClaimTypes.Email, "email");

    public string? DisplayName => FindFirst(ClaimTypes.Name, "name") ?? Email ?? Subject;

    public string? AvatarUrl => FindFirst("picture");

    public IReadOnlyCollection<string> Roles => httpContextAccessor.HttpContext?.User.Claims
        .Where(claim => claim.Type is ClaimTypes.Role or "role" or "roles")
        .Select(claim => claim.Value)
        .Where(value => !string.IsNullOrWhiteSpace(value))
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray() ?? [];

    private string? FindFirst(params string[] claimTypes)
    {
        return claimTypes
            .Select(type => httpContextAccessor.HttpContext?.User.FindFirst(type)?.Value)
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));
    }
}
