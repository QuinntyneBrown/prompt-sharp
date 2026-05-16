using FluentValidation;

namespace PromptSharp.Application.Projects;

public sealed class ListProjectsQueryValidator : AbstractValidator<ListProjectsQuery>
{
    public ListProjectsQueryValidator()
    {
        RuleFor(query => query.Search).MaximumLength(300);
        RuleFor(query => query.Status)
            .Must(status => string.IsNullOrWhiteSpace(status) || IsKnownStatus(status))
            .WithMessage("Status must be in progress, shipped, or archived.");
        RuleFor(query => query.Page).GreaterThanOrEqualTo(1);
        RuleFor(query => query.PageSize).InclusiveBetween(1, 100);
    }

    private static bool IsKnownStatus(string status)
    {
        var value = status.Trim().ToLowerInvariant();
        return value is "in progress" or "shipped" or "archived" or "all";
    }
}
