using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record ListUserInvitationsQuery() : IQuery<IReadOnlyList<UserInvitationDto>>;
