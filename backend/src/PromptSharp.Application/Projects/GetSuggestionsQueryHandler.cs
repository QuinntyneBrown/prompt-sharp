using MediatR;

namespace PromptSharp.Application.Projects;

public sealed class GetSuggestionsQueryHandler : IRequestHandler<GetSuggestionsQuery, IReadOnlyList<SuggestionDto>>
{
    public Task<IReadOnlyList<SuggestionDto>> Handle(GetSuggestionsQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<SuggestionDto> suggestions =
        [
            new("A field service scheduling app for small contractors"),
            new("A markdown-first notes app with offline sync"),
            new("A client portal for a boutique design studio"),
            new("A nutrition tracker focused on family meal planning")
        ];

        return Task.FromResult(suggestions);
    }
}
