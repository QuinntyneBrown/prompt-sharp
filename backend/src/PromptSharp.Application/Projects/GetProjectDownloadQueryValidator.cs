using FluentValidation;

namespace PromptSharp.Application.Projects;

public sealed class GetProjectDownloadQueryValidator : AbstractValidator<GetProjectDownloadQuery>
{
    public GetProjectDownloadQueryValidator()
    {
        RuleFor(query => query.ProjectNumber).GreaterThan(0);
    }
}
