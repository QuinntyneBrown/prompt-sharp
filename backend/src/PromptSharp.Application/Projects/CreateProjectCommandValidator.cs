using FluentValidation;

namespace PromptSharp.Application.Projects;

public sealed class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(command => command.Idea).NotEmpty().MaximumLength(4000);
    }
}
