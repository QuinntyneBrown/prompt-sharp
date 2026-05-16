using FluentValidation;

namespace PromptSharp.Application.Generation;

public sealed class GeneratedProjectPlanValidator : AbstractValidator<GeneratedProjectPlan>
{
    public GeneratedProjectPlanValidator()
    {
        RuleFor(plan => plan.Estimate).NotEmpty().MaximumLength(80);
        RuleFor(plan => plan.Phases).NotNull().Must(phases => phases.Count is >= 3 and <= 7);
        RuleForEach(plan => plan.Phases).SetValidator(new GeneratedPhaseValidator());
        RuleFor(plan => plan)
            .Must(plan => plan.Phases.Sum(phase => phase.Prompts.Count) is >= 10 and <= 50)
            .WithMessage("Generated plan must contain 10 to 50 prompts.");
    }
}
