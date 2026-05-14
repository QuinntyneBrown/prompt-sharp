using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest]
public sealed record AddBookmarkCommand(Guid TutorialId) : ICommand;
