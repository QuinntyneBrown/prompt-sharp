namespace PromptSharp.Domain;

public sealed class DomainRuleException(string message) : Exception(message);
