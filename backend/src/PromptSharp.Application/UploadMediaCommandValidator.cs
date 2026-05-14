using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class UploadMediaCommandValidator : AbstractValidator<UploadMediaCommand>
{
    private static readonly string[] AllowedContentTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

    public UploadMediaCommandValidator()
    {
        RuleFor(command => command.FileName).NotEmpty().MaximumLength(260);
        RuleFor(command => command.SizeBytes).GreaterThan(0).LessThanOrEqualTo(5 * 1024 * 1024);
        RuleFor(command => command.ContentType).Must(contentType => AllowedContentTypes.Contains(contentType))
            .WithMessage("Unsupported media content type.");
    }
}
