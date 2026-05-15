using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record InviteUserCommand(UserInvitationInputDto Input) : ICommand<UserInvitationDto>;
