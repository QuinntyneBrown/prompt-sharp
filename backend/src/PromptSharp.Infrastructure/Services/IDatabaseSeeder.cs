namespace PromptSharp.Infrastructure.Services;

public interface IDatabaseSeeder
{
    Task SeedDevelopmentDataAsync(CancellationToken cancellationToken);
}
