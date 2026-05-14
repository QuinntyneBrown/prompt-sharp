using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Editor, RoleNames.Admin)]
public sealed record ListAdminTutorialsQuery(int Page = 1, int PageSize = 20, string? Search = null) : IQuery<PagedResult<TutorialListItemDto>>;
