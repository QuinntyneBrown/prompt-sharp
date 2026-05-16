namespace PromptSharp.Application.Abstractions;

public sealed record ProjectGenerationInput(
    int ProjectNumber,
    string Idea,
    string SkillBundleVersion,
    string SkillBundleHash,
    string SkillBundleContent);
