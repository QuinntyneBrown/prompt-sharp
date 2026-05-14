using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class ReplaceTutorialStepsCommandValidator : AbstractValidator<ReplaceTutorialStepsCommand>
{
    public ReplaceTutorialStepsCommandValidator()
    {
        RuleFor(command => command.Steps).NotNull();
        RuleForEach(command => command.Steps).ChildRules(step =>
        {
            step.RuleFor(value => value.Title).NotEmpty().MaximumLength(220);
            step.RuleFor(value => value.BodyMarkdown).NotEmpty();
            step.RuleFor(value => value.CodeLanguage).MaximumLength(40);
        });
    }
}
