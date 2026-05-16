using System.Runtime.CompilerServices;
using Azure;
using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Extensions.Options;
using OpenAI.Chat;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Generation;
using PromptSharp.Infrastructure.Options;

namespace PromptSharp.Infrastructure.Ai;

public sealed class AzureOpenAiPromptPlanner(IOptions<AzureOpenAiOptions> options) : IAiPromptPlanner
{
    public async IAsyncEnumerable<ProjectGenerationUpdateDto> GenerateProjectPlanAsync(
        ProjectGenerationInput input,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var azureOptions = options.Value;
        if (string.IsNullOrWhiteSpace(azureOptions.Endpoint) || string.IsNullOrWhiteSpace(azureOptions.DeploymentName))
        {
            throw new InvalidOperationException("AzureOpenAi:Endpoint and AzureOpenAi:DeploymentName are required.");
        }

        var client = CreateClient(azureOptions);
        var chatClient = client.GetChatClient(azureOptions.DeploymentName);

        yield return new ProjectGenerationUpdateDto("phase-started", "Planning foundation prompts.", "01", null, null, null);

        var messages = new ChatMessage[]
        {
            new SystemChatMessage(BuildSystemPrompt(input)),
            new UserChatMessage(input.Idea)
        };

        var completionOptions = new ChatCompletionOptions
        {
            ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat()
        };

        await foreach (var update in chatClient.CompleteChatStreamingAsync(messages, completionOptions, cancellationToken))
        {
            foreach (var contentPart in update.ContentUpdate)
            {
                if (!string.IsNullOrEmpty(contentPart.Text))
                {
                    yield return new ProjectGenerationUpdateDto("token", "Receiving prompt plan.", null, null, contentPart.Text, null);
                }
            }
        }
    }

    private static AzureOpenAIClient CreateClient(AzureOpenAiOptions azureOptions)
    {
        var endpoint = new Uri(azureOptions.Endpoint);
        if (string.IsNullOrWhiteSpace(azureOptions.ApiKey))
        {
            return new AzureOpenAIClient(endpoint, new DefaultAzureCredential());
        }

        return new AzureOpenAIClient(endpoint, new AzureKeyCredential(azureOptions.ApiKey));
    }

    private static string BuildSystemPrompt(ProjectGenerationInput input)
    {
        return $$"""
You are PromptSharp, a senior product and engineering prompt planner.
Generate strict JSON only. Do not wrap it in Markdown.

The JSON shape must be:
{
  "estimate": "~3 days",
  "phases": [
    {
      "title": "Foundation",
      "prompts": [
        {
          "title": "Write the product spec",
          "body": "Draft a one-page spec...",
          "tags": ["spec", "30 min"]
        }
      ]
    }
  ]
}

Rules:
- Produce 3 to 7 phases.
- Produce 10 to 50 prompts total.
- Every phase has 1 to 12 prompts.
- Prompt bodies must be complete, actionable prompts that can drive implementation.
- Use the supplied agent-skill context as generation guidance.
- Project number: {{input.ProjectNumber:D4}}
- Skill bundle version: {{input.SkillBundleVersion}}
- Skill bundle hash: {{input.SkillBundleHash}}

Agent-skill context:
{{input.SkillBundleContent}}
""";
    }
}
