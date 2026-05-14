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

public sealed class DatabaseClaimsTransformation(PromptSharpDbContext dbContext) : IClaimsTransformation
{
    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity?.IsAuthenticated != true)
        {
            return principal;
        }

        var subject = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        if (string.IsNullOrWhiteSpace(subject))
        {
            return principal;
        }

        var roles = await dbContext.Users
            .AsNoTracking()
            .Where(user => user.Sub == subject)
            .SelectMany(user => user.UserRoles.Select(userRole => userRole.Role!.Name))
            .ToArrayAsync();

        if (roles.Length == 0)
        {
            return principal;
        }

        var identity = new ClaimsIdentity();
        foreach (var role in roles.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            if (!principal.IsInRole(role))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }
        }

        principal.AddIdentity(identity);
        return principal;
    }
}
