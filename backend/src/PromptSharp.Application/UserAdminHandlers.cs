using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class UserAdminHandlers(IPromptSharpDbContext dbContext) :
    IRequestHandler<ListUsersQuery, IReadOnlyList<UserDto>>,
    IRequestHandler<UpdateUserRolesCommand, UserDto>
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

    public async Task<UserDto> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"User '{request.Id}' was not found.");

        var requestedRoles = request.Input.Roles.Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
        var roles = await dbContext.Roles
            .Where(role => requestedRoles.Contains(role.Name))
            .ToArrayAsync(cancellationToken);

        if (roles.Length != requestedRoles.Length)
        {
            throw new ValidationException("One or more roles do not exist.");
        }

        user.ReplaceRoles(roles.Select(role => role.Id));
        await dbContext.SaveChangesAsync(cancellationToken);

        var updated = await dbContext.Users
            .AsNoTracking()
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleAsync(entity => entity.Id == request.Id, cancellationToken);

        return TutorialMapper.ToUserDto(updated);
    }
}
