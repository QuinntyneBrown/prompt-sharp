namespace PromptSharp.Application.Common;

public sealed class UnauthorizedCurrentUserException : Exception
{
    public UnauthorizedCurrentUserException()
        : base("An authenticated user is required.")
    {
    }
}
