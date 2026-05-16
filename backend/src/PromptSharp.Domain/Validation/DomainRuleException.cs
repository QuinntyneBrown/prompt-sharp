namespace PromptSharp.Domain.Validation;

public sealed class DomainRuleException : Exception
{
    public DomainRuleException(string message)
        : base(message)
    {
    }
}
