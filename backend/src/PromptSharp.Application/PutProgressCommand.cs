using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest]
public sealed record PutProgressCommand(Guid TutorialId, ProgressUpsertDto Input) : ICommand<TutorialProgressDto>;
