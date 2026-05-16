using System.Net.Http.Headers;
using System.Net.Http.Json;
using PromptSharp.Application.Auth;
using PromptSharp.Application.Projects;

namespace PromptSharp.Api.IntegrationTests.Support;

public static class ApiClientExtensions
{
    public static async Task<AuthResponseDto> RegisterAsync(this HttpClient client, string email)
    {
        var response = await client.PostAsJsonAsync("/api/v1/auth/register", new RegisterRequestDto(email, "PromptSharp123!", "Test User"));
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<AuthResponseDto>())!;
    }

    public static void Authorize(this HttpClient client, string accessToken)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    }

    public static async Task<ProjectSummaryDto> CreateProjectAsync(this HttpClient client, string idea)
    {
        var response = await client.PostAsJsonAsync("/api/v1/projects", new CreateProjectRequestDto(idea));
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ProjectSummaryDto>())!;
    }
}
