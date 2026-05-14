using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PromptSharp.Application;
using PromptSharp.Domain;

namespace PromptSharp.Api.IntegrationTests;

public sealed class ApiEndpointTests(PromptSharpApiFactory factory) : IClassFixture<PromptSharpApiFactory>
{
    [Fact]
    public async Task Public_catalog_endpoint_returns_ok()
    {
        if (!factory.IsEnabled)
        {
            return;
        }

        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/tutorials");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Protected_endpoint_without_auth_returns_unauthorized()
    {
        if (!factory.IsEnabled)
        {
            return;
        }

        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/me");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Admin_endpoint_with_user_role_returns_forbidden()
    {
        if (!factory.IsEnabled)
        {
            return;
        }

        await factory.SeedUserAsync("user-sub", RoleNames.User);
        var client = factory.CreateClient();
        client.AuthenticateAs("user-sub", RoleNames.User);

        var response = await client.GetAsync("/api/v1/admin/users");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Current_user_endpoint_returns_profile_for_authenticated_user()
    {
        if (!factory.IsEnabled)
        {
            return;
        }

        await factory.SeedUserAsync("admin-sub", RoleNames.Admin, RoleNames.User);
        var client = factory.CreateClient();
        client.AuthenticateAs("admin-sub", RoleNames.Admin, RoleNames.User);

        var response = await client.GetAsync("/api/v1/me");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Planned_endpoint_surface_is_exercised_once()
    {
        if (!factory.IsEnabled)
        {
            return;
        }

        var subject = $"admin-flow-{Guid.NewGuid():N}";
        await factory.SeedUserAsync(subject, RoleNames.Admin, RoleNames.Editor, RoleNames.User);
        var client = factory.CreateClient();
        client.AuthenticateAs(subject, RoleNames.Admin, RoleNames.Editor, RoleNames.User);

        var category = await PostJson<CategoryDto>(client, "/api/v1/admin/categories", new CategoryUpsertDto("apps", "Apps", 1));
        category = await PutJson<CategoryDto>(client, $"/api/v1/admin/categories/{category.Id}", new CategoryUpsertDto("apps", "Applications", 1));
        var tag = await PostJson<TagDto>(client, "/api/v1/admin/tags", new TagUpsertDto("dotnet", ".NET"));
        tag = await PutJson<TagDto>(client, $"/api/v1/admin/tags/{tag.Id}", new TagUpsertDto("dotnet", ".NET"));

        var tutorial = await PostJson<TutorialDetailDto>(client, "/api/v1/admin/tutorials", new TutorialUpsertDto(
            "build-app",
            "Build App",
            "Build an app with .NET.",
            DifficultyLevel.Beginner,
            25,
            category.Id,
            [tag.Id]));

        await GetOk(client, "/api/v1/admin/tutorials");
        await GetOk(client, $"/api/v1/admin/tutorials/{tutorial.Id}");
        tutorial = await PutJson<TutorialDetailDto>(client, $"/api/v1/admin/tutorials/{tutorial.Id}", new TutorialUpsertDto(
            "build-app",
            "Build App Updated",
            "Build an app with .NET.",
            DifficultyLevel.Beginner,
            30,
            category.Id,
            [tag.Id]));
        tutorial = await PutJson<TutorialDetailDto>(client, $"/api/v1/admin/tutorials/{tutorial.Id}/steps", new[]
        {
            new TutorialStepUpsertDto("Create", "Run dotnet new.", null, null, null)
        });
        tutorial = await PostJson<TutorialDetailDto>(client, $"/api/v1/admin/tutorials/{tutorial.Id}/publish", new { });
        await PostJson<TutorialDetailDto>(client, $"/api/v1/admin/tutorials/{tutorial.Id}/feature", new { });
        await PostJson<TutorialDetailDto>(client, $"/api/v1/admin/tutorials/{tutorial.Id}/editors-pick", new { });

        await GetOk(client, "/api/v1/tutorials");
        await GetOk(client, $"/api/v1/tutorials/{tutorial.Slug}");
        await GetOk(client, "/api/v1/tutorials/featured");
        await GetOk(client, "/api/v1/tutorials/editors-pick");
        await GetOk(client, "/api/v1/categories");
        await GetOk(client, $"/api/v1/categories/{category.Slug}/tutorials");
        await GetOk(client, $"/api/v1/tags/{tag.Slug}/tutorials");

        await GetOk(client, "/api/v1/me");
        await GetOk(client, "/api/v1/me/bookmarks");
        await PostNoContent(client, $"/api/v1/me/bookmarks/{tutorial.Id}");
        await DeleteNoContent(client, $"/api/v1/me/bookmarks/{tutorial.Id}");
        await GetOk(client, $"/api/v1/me/progress/{tutorial.Id}");
        await PutJson<TutorialProgressDto>(client, $"/api/v1/me/progress/{tutorial.Id}", new ProgressUpsertDto(tutorial.Steps[0].Id, [tutorial.Steps[0].Id]));

        await GetOk(client, "/api/v1/admin/media");
        var media = await UploadMedia(client);
        await DeleteNoContent(client, $"/api/v1/admin/media/{media.Id}");

        await GetOk(client, "/api/v1/admin/users");
        await PutJson<UserDto>(client, $"/api/v1/admin/users/{await CurrentUserId(client)}/roles", new UserRolesUpsertDto([RoleNames.Admin, RoleNames.User]));

        await DeleteNoContent(client, $"/api/v1/admin/tutorials/{tutorial.Id}");
        await DeleteNoContent(client, $"/api/v1/admin/tags/{tag.Id}");
        await DeleteNoContent(client, $"/api/v1/admin/categories/{category.Id}");
    }

    private static async Task<T> PostJson<T>(HttpClient client, string url, object body)
    {
        var response = await client.PostAsJsonAsync(url, body);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<T>())!;
    }

    private static async Task PostNoContent(HttpClient client, string url)
    {
        var response = await client.PostAsync(url, null);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    private static async Task<T> PutJson<T>(HttpClient client, string url, object body)
    {
        var response = await client.PutAsJsonAsync(url, body);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<T>())!;
    }

    private static async Task DeleteNoContent(HttpClient client, string url)
    {
        var response = await client.DeleteAsync(url);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    private static async Task GetOk(HttpClient client, string url)
    {
        var response = await client.GetAsync(url);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    private static async Task<MediaDto> UploadMedia(HttpClient client)
    {
        using var form = new MultipartFormDataContent();
        using var content = new ByteArrayContent([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        content.Headers.ContentType = new("image/png");
        form.Add(content, "file", "sample.png");

        var response = await client.PostAsync("/api/v1/admin/media", form);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<MediaDto>())!;
    }

    private static async Task<Guid> CurrentUserId(HttpClient client)
    {
        var user = await client.GetFromJsonAsync<UserDto>("/api/v1/me");
        return user!.Id;
    }
}
