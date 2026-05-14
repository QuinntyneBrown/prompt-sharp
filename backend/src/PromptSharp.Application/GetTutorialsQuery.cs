using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

public sealed record GetTutorialsQuery(
    string? Category = null,
    string? Tag = null,
    DifficultyLevel? Difficulty = null,
    int Page = 1,
    int PageSize = 20,
    string? Sort = null) : IQuery<PagedResult<TutorialListItemDto>>;
