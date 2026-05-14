using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record ReplaceTutorialStepsCommand(Guid Id, IReadOnlyList<TutorialStepUpsertDto> Steps) : ICommand<TutorialDetailDto>;
