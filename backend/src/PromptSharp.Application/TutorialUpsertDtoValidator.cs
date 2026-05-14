using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class TutorialUpsertDtoValidator : AbstractValidator<TutorialUpsertDto>
{
    public TutorialUpsertDtoValidator()
    {
        RuleFor(dto => dto.Slug).NotEmpty().MaximumLength(160);
        RuleFor(dto => dto.Title).NotEmpty().MaximumLength(220);
        RuleFor(dto => dto.Summary).NotNull().MaximumLength(1_000);
        RuleFor(dto => dto.EstimatedMinutes).GreaterThan(0).LessThanOrEqualTo(480);
        RuleFor(dto => dto.CategoryId).NotEmpty();
        RuleFor(dto => dto.TagIds).NotNull();
    }
}
