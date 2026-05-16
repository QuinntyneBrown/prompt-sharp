using FluentValidation;

namespace PromptSharp.Application.Projects;

public sealed class UpdateProjectStatusCommandValidator : AbstractValidator<UpdateProjectStatusCommand>
{
    public UpdateProjectStatusCommandValidator()
    {
        RuleFor(command => command.ProjectNumber).GreaterThan(0);
        RuleFor(command => command.Status)
            .NotEmpty()
            .Must(status => status.Trim().ToLowerInvariant() is "in progress" or "shipped" or "archived")
            .WithMessage("Status must be in progress, shipped, or archived.");
    }
}
