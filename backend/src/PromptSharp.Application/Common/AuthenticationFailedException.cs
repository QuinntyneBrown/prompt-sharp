namespace PromptSharp.Application.Common;

public sealed class AuthenticationFailedException : Exception
{
    public AuthenticationFailedException(string message)
        : base(message)
    {
    }
}
