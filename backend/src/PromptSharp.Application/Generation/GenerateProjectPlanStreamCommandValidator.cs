using FluentValidation;

namespace PromptSharp.Application.Generation;

public sealed class GenerateProjectPlanStreamCommandValidator : AbstractValidator<GenerateProjectPlanStreamCommand>
{
    public GenerateProjectPlanStreamCommandValidator()
    {
        RuleFor(command => command.ProjectNumber).GreaterThan(0);
    }
}
