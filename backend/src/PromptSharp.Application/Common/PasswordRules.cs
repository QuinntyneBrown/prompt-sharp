using FluentValidation;

namespace PromptSharp.Application.Common;

internal static class PasswordRules
{
    public static IRuleBuilderOptions<T, string> PromptSharpPassword<T>(this IRuleBuilder<T, string> rule)
    {
        return rule
            .NotEmpty()
            .MinimumLength(12)
            .Must(password => password.Any(char.IsLetter))
            .WithMessage("Password must contain at least one letter.")
            .Must(password => password.Any(character => !char.IsLetterOrDigit(character) || char.IsDigit(character)))
            .WithMessage("Password must contain at least one number or symbol.");
    }
}
