using FluentValidation;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Account;

public sealed class UpdatePasswordCommandValidator : AbstractValidator<UpdatePasswordCommand>
{
    public UpdatePasswordCommandValidator()
    {
        RuleFor(command => command.CurrentPassword).NotEmpty();
        RuleFor(command => command.NewPassword).PromptSharpPassword();
    }
}
