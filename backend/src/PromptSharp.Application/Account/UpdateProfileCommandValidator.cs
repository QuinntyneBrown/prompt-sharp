using FluentValidation;

namespace PromptSharp.Application.Account;

public sealed class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator()
    {
        RuleFor(command => command.DisplayName).NotEmpty().MaximumLength(160);
    }
}
