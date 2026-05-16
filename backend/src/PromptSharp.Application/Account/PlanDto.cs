namespace PromptSharp.Application.Account;

public sealed record PlanDto(string Name, string Tier, int ProjectsUsed, int ProjectQuota, string ResetsLabel);
