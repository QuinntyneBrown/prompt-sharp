using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Common;

internal static class CurrentUserExtensions
{
    public static Guid RequireUserId(this ICurrentUser currentUser)
    {
        return currentUser.IsAuthenticated && currentUser.UserId is { } userId
            ? userId
            : throw new UnauthorizedCurrentUserException();
    }
}
