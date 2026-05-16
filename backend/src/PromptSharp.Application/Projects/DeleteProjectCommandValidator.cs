using FluentValidation;

namespace PromptSharp.Application.Projects;

public sealed class DeleteProjectCommandValidator : AbstractValidator<DeleteProjectCommand>
{
    public DeleteProjectCommandValidator()
    {
        RuleFor(command => command.ProjectNumber).GreaterThan(0);
    }
}
