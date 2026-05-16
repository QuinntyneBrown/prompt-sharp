using FluentValidation;

namespace PromptSharp.Application.Projects;

public sealed class GetProjectQueryValidator : AbstractValidator<GetProjectQuery>
{
    public GetProjectQueryValidator()
    {
        RuleFor(query => query.ProjectNumber).GreaterThan(0);
    }
}
