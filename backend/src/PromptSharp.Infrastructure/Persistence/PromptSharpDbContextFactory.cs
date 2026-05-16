using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PromptSharp.Infrastructure.Persistence;

public sealed class PromptSharpDbContextFactory : IDesignTimeDbContextFactory<PromptSharpDbContext>
{
    public PromptSharpDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<PromptSharpDbContext>()
            .UseSqlServer("Server=localhost\\SQLEXPRESS;Database=PromptSharpDev;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True")
            .Options;

        return new PromptSharpDbContext(options);
    }
}
