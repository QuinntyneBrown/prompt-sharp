using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

public sealed record EnsureUserExistsCommand(
    string Sub,
    string Email,
    string DisplayName,
    string? AvatarUrl) : ICommand<UserDto>;
