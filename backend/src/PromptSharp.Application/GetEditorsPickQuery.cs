using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

public sealed record GetEditorsPickQuery() : IQuery<TutorialListItemDto?>;
