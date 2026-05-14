using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class TagCommandValidators : AbstractValidator<TagUpsertDto>
{
    public TagCommandValidators()
    {
        RuleFor(dto => dto.Slug).NotEmpty().MaximumLength(160);
        RuleFor(dto => dto.Name).NotEmpty().MaximumLength(160);
    }
}
