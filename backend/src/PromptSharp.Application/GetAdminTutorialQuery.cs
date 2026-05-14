using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record GetAdminTutorialQuery(Guid Id) : IQuery<TutorialDetailDto>;
