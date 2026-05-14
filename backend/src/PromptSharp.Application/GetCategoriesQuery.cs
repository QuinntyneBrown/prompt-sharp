using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

public sealed record GetCategoriesQuery() : IQuery<IReadOnlyList<CategoryDto>>;
