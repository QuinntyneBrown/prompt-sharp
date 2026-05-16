using FluentValidation;

namespace PromptSharp.Application.Generation;

public sealed class GeneratedPromptValidator : AbstractValidator<GeneratedPrompt>
{
    public GeneratedPromptValidator()
    {
        RuleFor(prompt => prompt.Title).NotEmpty().MaximumLength(220);
        RuleFor(prompt => prompt.Body).NotEmpty().MaximumLength(100_000);
        RuleFor(prompt => prompt.Tags)
            .Must(tags => tags is null || tags.Count <= 6)
            .WithMessage("Prompts can have at most 6 tags.");
    }
}
