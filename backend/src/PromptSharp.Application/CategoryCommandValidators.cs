using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class CategoryCommandValidators :
    AbstractValidator<CategoryUpsertDto>
{
    public CategoryCommandValidators()
    {
        RuleFor(dto => dto.Slug).NotEmpty().MaximumLength(160);
        RuleFor(dto => dto.Name).NotEmpty().MaximumLength(160);
    }
}
