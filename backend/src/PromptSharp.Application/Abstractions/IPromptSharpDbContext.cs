using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Abstractions;

public interface IPromptSharpDbContext
{
    DbSet<User> Users { get; }

    DbSet<RefreshToken> RefreshTokens { get; }

    DbSet<Project> Projects { get; }

    DbSet<Phase> Phases { get; }

    DbSet<PromptItem> PromptItems { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
