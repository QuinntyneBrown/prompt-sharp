using FluentAssertions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PromptSharp.Application.Auth;
using PromptSharp.Application.Common;
using PromptSharp.Application.Tests.Support;
using PromptSharp.Infrastructure.Persistence;

namespace PromptSharp.Application.Tests;

public sealed class AuthApplicationTests
{
    [Fact]
    public async Task Register_login_refresh_and_logout_use_hashed_rotating_tokens()
    {
        await using var host = await ApplicationTestHost.CreateAsync();
        await using var scope = host.Services.CreateAsyncScope();
        var sender = scope.ServiceProvider.GetRequiredService<ISender>();
        var dbContext = scope.ServiceProvider.GetRequiredService<PromptSharpDbContext>();

        var registered = await sender.Send(new RegisterUserCommand(
            "quinn@example.com",
            "PromptSharp123!",
            "Quinn",
            "Windows Chrome",
            "127.0.0.1"));

        registered.AccessToken.Should().NotBeNullOrWhiteSpace();
        registered.RefreshToken.Should().NotBeNullOrWhiteSpace();

        var user = await dbContext.Users.SingleAsync();
        user.PasswordHash.Should().NotBe("PromptSharp123!");

        var login = await sender.Send(new LoginUserCommand("quinn@example.com", "PromptSharp123!", "Windows Chrome", "127.0.0.1"));
        login.AccessToken.Should().NotBeNullOrWhiteSpace();

        var invalidLogin = async () => await sender.Send(new LoginUserCommand("quinn@example.com", "wrong-password", null, null));
        await invalidLogin.Should().ThrowAsync<AuthenticationFailedException>();

        var refreshed = await sender.Send(new RefreshAuthTokenCommand(login.RefreshToken, "Windows Chrome", "127.0.0.1"));
        refreshed.RefreshToken.Should().NotBe(login.RefreshToken);

        var tokens = await dbContext.RefreshTokens.OrderBy(token => token.CreatedAtUtc).ToListAsync();
        tokens.Should().Contain(token => token.RevokedAtUtc != null);

        await sender.Send(new LogoutUserCommand(refreshed.RefreshToken));
        (await dbContext.RefreshTokens.CountAsync(token => token.RevokedAtUtc != null)).Should().BeGreaterThan(1);
    }
}
