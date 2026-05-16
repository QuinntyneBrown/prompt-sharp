namespace PromptSharp.Application.Abstractions;

public interface IAgentSkillCatalog
{
    Task<AgentSkillBundle> LoadBundleAsync(CancellationToken cancellationToken);
}
