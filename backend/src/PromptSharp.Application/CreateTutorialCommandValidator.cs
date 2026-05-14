using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class CreateTutorialCommandValidator : AbstractValidator<CreateTutorialCommand>
{
    public CreateTutorialCommandValidator() => RuleFor(command => command.Input).SetValidator(new TutorialUpsertDtoValidator());
}
