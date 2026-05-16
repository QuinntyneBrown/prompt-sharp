namespace PromptSharp.Application.Tests.Support;

public static class GeneratedPlanFixture
{
    public static string ValidJson()
    {
        return """
{
  "estimate": "~3 days",
  "phases": [
    {
      "title": "Foundation",
      "prompts": [
        { "title": "Spec", "body": "Write the product spec.", "tags": ["spec"] },
        { "title": "Architecture", "body": "Plan the architecture.", "tags": ["architecture"] },
        { "title": "Data model", "body": "Design the data model.", "tags": ["data"] },
        { "title": "API", "body": "Design the API.", "tags": ["api"] }
      ]
    },
    {
      "title": "Build",
      "prompts": [
        { "title": "Backend", "body": "Implement the backend.", "tags": ["backend"] },
        { "title": "Frontend", "body": "Implement the frontend.", "tags": ["frontend"] },
        { "title": "Auth", "body": "Implement authentication.", "tags": ["auth"] }
      ]
    },
    {
      "title": "Ship",
      "prompts": [
        { "title": "Tests", "body": "Write tests.", "tags": ["tests"] },
        { "title": "Review", "body": "Review the code.", "tags": ["review"] },
        { "title": "Launch", "body": "Prepare launch.", "tags": ["launch"] }
      ]
    }
  ]
}
""";
    }
}
