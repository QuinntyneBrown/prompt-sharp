using FluentValidation;

namespace PromptSharp.Application.Auth;

public sealed class LogoutUserCommandValidator : AbstractValidator<LogoutUserCommand>
{
    public LogoutUserCommandValidator()
    {
        RuleFor(command => command.RefreshToken).NotEmpty();
    }
}
