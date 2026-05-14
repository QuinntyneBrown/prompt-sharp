using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record UpdateUserRolesCommand(Guid Id, UserRolesUpsertDto Input) : ICommand<UserDto>;
