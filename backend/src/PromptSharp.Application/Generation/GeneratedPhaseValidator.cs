using FluentValidation;

namespace PromptSharp.Application.Generation;

public sealed class GeneratedPhaseValidator : AbstractValidator<GeneratedPhase>
{
    public GeneratedPhaseValidator()
    {
        RuleFor(phase => phase.Title).NotEmpty().MaximumLength(160);
        RuleFor(phase => phase.Prompts).NotNull().Must(prompts => prompts.Count is >= 1 and <= 12);
        RuleForEach(phase => phase.Prompts).SetValidator(new GeneratedPromptValidator());
    }
}
