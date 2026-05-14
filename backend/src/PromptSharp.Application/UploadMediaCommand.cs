using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record UploadMediaCommand(string FileName, string ContentType, long SizeBytes, Stream Content) : ICommand<MediaDto>;
