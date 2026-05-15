using FluentValidation;

namespace PromptSharp.Application.Features;

internal sealed class SubmitContactSubmissionCommandValidator : AbstractValidator<SubmitContactSubmissionCommand>
{
    public SubmitContactSubmissionCommandValidator()
    {
        RuleFor(command => command.Input.Name).NotEmpty().MaximumLength(200);
        RuleFor(command => command.Input.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(command => command.Input.Message).NotEmpty().MaximumLength(4000);
    }
}
