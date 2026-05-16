using PromptSharp.Domain.Entities;

namespace PromptSharp.Application.Abstractions;

public interface IPasswordService
{
    string HashPassword(User user, string password);

    bool VerifyPassword(User user, string password);
}
