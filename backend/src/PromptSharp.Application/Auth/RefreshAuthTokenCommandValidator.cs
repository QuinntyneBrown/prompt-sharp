using FluentValidation;

namespace PromptSharp.Application.Auth;

public sealed class RefreshAuthTokenCommandValidator : AbstractValidator<RefreshAuthTokenCommand>
{
    public RefreshAuthTokenCommandValidator()
    {
        RuleFor(command => command.RefreshToken).NotEmpty();
    }
}
