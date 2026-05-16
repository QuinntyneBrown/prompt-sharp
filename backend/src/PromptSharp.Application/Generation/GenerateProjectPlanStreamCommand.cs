using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Generation;

public sealed record GenerateProjectPlanStreamCommand(int ProjectNumber, Guid? UserId = null) : IStreamCommand<ProjectGenerationUpdateDto>;
