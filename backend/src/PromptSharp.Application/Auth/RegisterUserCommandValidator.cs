using FluentValidation;
using PromptSharp.Application.Common;

namespace PromptSharp.Application.Auth;

public sealed class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(command => command.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(command => command.DisplayName).NotEmpty().MaximumLength(160);
        RuleFor(command => command.Password).PromptSharpPassword();
    }
}
