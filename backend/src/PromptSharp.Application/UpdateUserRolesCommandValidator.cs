using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class UpdateUserRolesCommandValidator : AbstractValidator<UpdateUserRolesCommand>
{
    public UpdateUserRolesCommandValidator()
    {
        RuleFor(command => command.Input.Roles).NotEmpty();
        RuleForEach(command => command.Input.Roles).Must(role => RoleNames.All.Contains(role))
            .WithMessage("Unsupported role.");
    }
}
