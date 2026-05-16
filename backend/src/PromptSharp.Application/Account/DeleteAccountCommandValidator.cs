using FluentValidation;

namespace PromptSharp.Application.Account;

public sealed class DeleteAccountCommandValidator : AbstractValidator<DeleteAccountCommand>
{
    public DeleteAccountCommandValidator()
    {
        RuleFor(command => command.CurrentPassword).NotEmpty();
    }
}
