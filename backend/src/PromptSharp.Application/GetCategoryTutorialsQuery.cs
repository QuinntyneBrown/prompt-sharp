using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

public sealed record GetCategoryTutorialsQuery(string Slug, int Page = 1, int PageSize = 20) : IQuery<PagedResult<TutorialListItemDto>>;
