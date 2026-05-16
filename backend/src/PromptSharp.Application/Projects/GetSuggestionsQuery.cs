using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Projects;

public sealed record GetSuggestionsQuery : IQuery<IReadOnlyList<SuggestionDto>>;
