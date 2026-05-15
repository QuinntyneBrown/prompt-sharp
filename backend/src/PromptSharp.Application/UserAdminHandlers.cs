using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class UserAdminHandlers(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    TimeProvider timeProvider) :
    IRequestHandler<ListUsersQuery, IReadOnlyList<UserDto>>,
    IRequestHandler<UpdateUserRolesCommand, UserDto>,
    IRequestHandler<ListUserInvitationsQuery, IReadOnlyList<UserInvitationDto>>,
    IRequestHandler<InviteUserCommand, UserInvitationDto>
{
    public async Task<IReadOnlyList<UserDto>> Handle(ListUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await dbContext.Users
            .AsNoTracking()
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .OrderBy(user => user.DisplayName)
            .ToListAsync(cancellationToken);

        return users.Select(TutorialMapper.ToUserDto).ToArray();
    }

    public async Task<IReadOnlyList<UserInvitationDto>> Handle(ListUserInvitationsQuery request, CancellationToken cancellationToken)
    {
        var invitations = await dbContext.UserInvitations
            .AsNoTracking()
            .OrderByDescending(invitation => invitation.CreatedAt)
            .ToArrayAsync(cancellationToken);

        return invitations.Select(ToInvitationDto).ToArray();
    }

    public async Task<UserInvitationDto> Handle(InviteUserCommand request, CancellationToken cancellationToken)
    {
        var email = request.Input.Email.Trim().ToLowerInvariant();
        var roles = NormalizeRoles(request.Input.Roles);
        var actor = currentUser.Email ?? currentUser.DisplayName ?? currentUser.Subject ?? "system";
        var now = timeProvider.GetUtcNow();
        var invitation = await dbContext.UserInvitations.SingleOrDefaultAsync(
            entity => entity.Email == email,
            cancellationToken);

        if (invitation is null)
        {
            invitation = UserInvitation.Create(email, roles, actor, now);
            dbContext.UserInvitations.Add(invitation);
        }
        else
        {
            invitation.Refresh(roles, actor, now);
        }

        dbContext.AuditEvents.Add(AuditEvent.Create(
            actor,
            "Invite user",
            "UserInvitation",
            invitation.Id.ToString(),
            invitation.Email,
            "None",
            FormatRoles(invitation.Roles),
            now));

        return ToInvitationDto(invitation);
    }

    public async Task<UserDto> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"User '{request.Id}' was not found.");

        var beforeRoles = FormatRoles(user.UserRoles.Select(userRole => userRole.Role!.Name));
        var requestedRoles = request.Input.Roles.Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
        var roles = await dbContext.Roles
            .Where(role => requestedRoles.Contains(role.Name))
            .ToArrayAsync(cancellationToken);

        if (roles.Length != requestedRoles.Length)
        {
            throw new ValidationException("One or more roles do not exist.");
        }

        user.ReplaceRoles(roles.Select(role => role.Id));
        dbContext.AuditEvents.Add(AuditEvent.Create(
            currentUser.Email ?? currentUser.DisplayName ?? currentUser.Subject ?? "system",
            "Update roles",
            "User",
            user.Id.ToString(),
            user.Email,
            beforeRoles,
            FormatRoles(roles.Select(role => role.Name)),
            timeProvider.GetUtcNow()));
        await dbContext.SaveChangesAsync(cancellationToken);

        var updated = await dbContext.Users
            .AsNoTracking()
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleAsync(entity => entity.Id == request.Id, cancellationToken);

        return TutorialMapper.ToUserDto(updated);
    }

    private static string FormatRoles(IEnumerable<string> roles)
    {
        var text = string.Join(", ", roles.OrderBy(role => role, StringComparer.OrdinalIgnoreCase));
        return string.IsNullOrWhiteSpace(text) ? "None" : text;
    }

    private static IReadOnlyList<string> NormalizeRoles(IReadOnlyList<string> roles)
    {
        var normalized = roles
            .Where(role => !string.IsNullOrWhiteSpace(role))
            .Select(role => role.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return normalized.Length > 0 ? normalized : [RoleNames.User];
    }

    private static UserInvitationDto ToInvitationDto(UserInvitation invitation)
    {
        return new UserInvitationDto(
            invitation.Id,
            invitation.Email,
            invitation.Roles,
            invitation.InvitedBy,
            invitation.CreatedAt,
            invitation.AcceptedAt);
    }
}
