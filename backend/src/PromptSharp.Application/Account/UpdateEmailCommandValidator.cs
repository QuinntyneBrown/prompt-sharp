using FluentValidation;

namespace PromptSharp.Application.Account;

public sealed class UpdateEmailCommandValidator : AbstractValidator<UpdateEmailCommand>
{
    public UpdateEmailCommandValidator()
    {
        RuleFor(command => command.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(command => command.CurrentPassword).NotEmpty();
    }
}
