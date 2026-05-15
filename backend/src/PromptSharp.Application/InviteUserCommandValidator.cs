using FluentValidation;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class InviteUserCommandValidator : AbstractValidator<InviteUserCommand>
{
    public InviteUserCommandValidator()
    {
        RuleFor(command => command.Input.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleForEach(command => command.Input.Roles).Must(role => RoleNames.All.Contains(role))
            .WithMessage("One or more roles do not exist.");
    }
}
