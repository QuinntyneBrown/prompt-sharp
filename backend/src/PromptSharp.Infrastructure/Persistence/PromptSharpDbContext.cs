using Microsoft.EntityFrameworkCore;
using PromptSharp.Application.Abstractions;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Infrastructure.Persistence;

public sealed class PromptSharpDbContext(DbContextOptions<PromptSharpDbContext> options) : DbContext(options), IPromptSharpDbContext
{
    public DbSet<User> Users => Set<User>();

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    public DbSet<Project> Projects => Set<Project>();

    public DbSet<Phase> Phases => Set<Phase>();

    public DbSet<PromptItem> PromptItems => Set<PromptItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PromptSharpDbContext).Assembly);
    }
}
