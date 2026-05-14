using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class UpdateTutorialCommandValidator : AbstractValidator<UpdateTutorialCommand>
{
    public UpdateTutorialCommandValidator() => RuleFor(command => command.Input).SetValidator(new TutorialUpsertDtoValidator());
}
