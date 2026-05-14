using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class PutProgressCommandValidator : AbstractValidator<PutProgressCommand>
{
    public PutProgressCommandValidator()
    {
        RuleFor(command => command.TutorialId).NotEmpty();
        RuleFor(command => command.Input.CompletedStepIds).NotNull();
    }
}
