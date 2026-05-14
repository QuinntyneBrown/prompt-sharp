using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record UpdateTutorialCommand(Guid Id, TutorialUpsertDto Input) : ICommand<TutorialDetailDto>;
