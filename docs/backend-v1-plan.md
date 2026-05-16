# PromptSharp v1 Backend Plan

Plan date: 2026-05-15

This plan is for the v1 PromptSharp product described by `docs/idea.1.md` and the v1 skeletons under `docs/skeletons/v1/`.

The core product is intentionally small: a signed-in user describes an app idea, PromptSharp uses a curated agent-skills context and Azure AI to generate a polished end-to-end prompt pack, stores the result, streams progress over SignalR, and lets the user browse, resume, copy, and download past projects.

## 1. Product Scope

### In scope

- First-party .NET backend under `backend/PromptSharp.sln`.
- SQL Server Express database for development.
- Backend-issued JWT bearer access tokens.
- Users stored in SQL Server.
- Passwords hashed with a framework password hasher.
- Authenticated project library.
- Project creation from an idea.
- SignalR websocket streaming for project generation.
- Azure AI service integration for prompt-plan generation.
- Agent-skills-backed generation context.
- Project detail, prompt phases, prompt cards, and deterministic `.txt`/Markdown download.
- Account page data: profile, plan/quota, current session, sign out, delete account.
- Clean Architecture.
- Controllers for HTTP API.
- MediatR free version.
- FluentValidation.
- No mapper libraries.
- One C# file per C# type.

### Out of scope for v1

- Admin screens and tutorial CMS from the older v0 product.
- External OAuth providers such as Google/GitHub.
- Magic links, despite the static `signin.html` copy.
- Billing implementation for Upgrade.
- Background job framework such as Hangfire.
- Multi-tenant orgs or teams.
- Public sharing of generated prompt packs.
- Complex prompt editing/version history.
- Full OAuth2 authorization-server certification.

The v1 auth requirement is interpreted as: the backend owns users, validates passwords, issues JWT bearer tokens, and accepts those tokens on protected endpoints. If strict OAuth2/OIDC protocol compliance becomes a hard requirement, add an authorization-server package in a later phase. Do not add that complexity in v1.

## 2. Decisions From The Reviewed Files

### From `docs/idea.1.md`

- Input is a user-entered app prompt.
- Output is Markdown containing all prompts needed to build the app end to end.
- Quality bar is "gold standard".
- The app should draw from `addyosmani/agent-skills`.
- The frontend is responsive across mobile, tablet, and desktop.

### From `docs/skeletons/v1/home.html`

- Anonymous landing screen has one primary text area and a Start action.
- Suggestion chips are static examples.
- Sign-in is available from the home nav.

Backend implications:

- `GET /api/v1/suggestions`
- `POST /api/v1/projects`
- SignalR stream for generation after a project is created.

### From `docs/skeletons/v1/signin.html`

- Static copy says magic link plus OAuth, but the current backend requirement supersedes it.

Backend implications:

- Build local email/password auth for v1.
- Frontend copy should later be adjusted to match password-based sign-in.

### From `docs/skeletons/v1/projects.html`

- Authenticated users have a project library.
- Projects can be searched by idea/tag/prompt and filtered by status.
- Status values shown are `in progress`, `shipped`, and `archived`.
- Project IDs are displayed as human-readable numbers such as `0142`.

Backend implications:

- Store an internal Guid primary key and a SQL identity `ProjectNumber`.
- API route lookup can use the display number.
- Return project summaries with prompt count, status, and relative date labels.

### From `docs/skeletons/v1/project.html`

- A project has an idea, created label, prompt count, phase count, estimate, phases, prompts, prompt tags, copy actions, and download.
- The download is "all prompts, in order".

Backend implications:

- Persist normalized `Project`, `Phase`, and `PromptItem` rows.
- Render download text deterministically from persisted rows, not directly from raw model text.

### From `docs/skeletons/v1/account.html`

- Account shows profile, plan/quota, session, sign out, and delete account.
- Free tier shows monthly project usage.

Backend implications:

- Store `DisplayName`, `Email`, `CreatedAtUtc`, `LastSignInAtUtc`, `LastUserAgent`, and plan/quota columns on `User`.
- Compute monthly project usage from projects created in the current UTC month.
- Sign out revokes the refresh token.
- Delete account deletes user data and refresh tokens.

### From current frontend fixtures

The Angular API fixtures already model:

- `ProjectSummary`: `id`, `idea`, `promptCount`, `whenLabel`, `status`.
- `Project`: `id`, `idea`, `createdLabel`, `promptCount`, `phaseCount`, `estimate`, `status`, `phases`.
- `Phase`: `ix`, `title`, `prompts`.
- `Prompt`: `n`, `title`, `body`, `tags`.
- `User`: `name`, `email`, `memberSinceLabel`, `plan`, `session`.

The backend DTOs should match these names first, then add ISO timestamps only where the frontend needs them.

## 3. Technology Choices

Use current LTS unless the repo owner chooses otherwise:

- Runtime: .NET 10 LTS.
- Language: C# 14 or whatever ships with the chosen SDK.
- Web: ASP.NET Core MVC Controllers.
- Realtime: ASP.NET Core SignalR.
- Persistence: EF Core SQL Server provider.
- Dev database: SQL Server Express, default connection string using `localhost\SQLEXPRESS`.
- Mediator: `MediatR` pinned to `12.5.0`.
- Validation: `FluentValidation` plus a MediatR validation behavior.
- AI: Azure OpenAI through `Azure.AI.OpenAI` plus `Azure.Identity`.
- Auth: ASP.NET Core JWT bearer authentication.
- Password hashing: `PasswordHasher<User>`.
- Mapping: hand-written mapping methods only.
- Tests: xUnit, FluentAssertions, real SQL Server Express test database.

Why .NET 10: as of 2026-05-15, .NET 10 is LTS and active through November 2028; .NET 9 is STS and ends support in November 2026. If the team must keep .NET 9 to match older README text, pin `global.json` to .NET 9 and add a scheduled upgrade task before November 2026.

Why MediatR 12.5.0: newer MediatR versions exist, but current NuGet metadata for 14.x includes license-key configuration. Version 12.5.0 is the simplest free pin that satisfies the requirement.

## 4. Solution Layout

Create this exact folder:

```text
backend/
  PromptSharp.sln
  global.json
  Directory.Build.props
  Directory.Packages.props
  README.md
  src/
    PromptSharp.Domain/
      PromptSharp.Domain.csproj
    PromptSharp.Application/
      PromptSharp.Application.csproj
    PromptSharp.Infrastructure/
      PromptSharp.Infrastructure.csproj
    PromptSharp.Api/
      PromptSharp.Api.csproj
  tests/
    PromptSharp.Domain.Tests/
      PromptSharp.Domain.Tests.csproj
    PromptSharp.Application.Tests/
      PromptSharp.Application.Tests.csproj
    PromptSharp.Api.IntegrationTests/
      PromptSharp.Api.IntegrationTests.csproj
  skills/
    agent-skills/
      manifest.json
      spec-driven-development.md
      planning-and-task-breakdown.md
      api-and-interface-design.md
      frontend-ui-engineering.md
      test-driven-development.md
      code-review-and-quality.md
      security-and-hardening.md
      shipping-and-launch.md
```

Dependency direction:

```text
Domain <- Application <- Infrastructure
                  ^
                  |
                 Api
```

Rules:

- Domain references no other PromptSharp project.
- Application references Domain only.
- Infrastructure references Application and Domain.
- Api references Application and Infrastructure.
- No project references Api.
- Each C# type gets its own `.cs` file.
- Controllers live only in `PromptSharp.Api/Controllers`.
- SignalR hub lives in `PromptSharp.Api/Hubs`.
- No Minimal API endpoint classes.

## 5. Backend Projects

### `PromptSharp.Domain`

Contains plain domain types:

- Entities.
- Value objects if they remove real duplication.
- Enums.
- Domain validation methods.

No EF attributes. No ASP.NET Core. No MediatR. No Azure SDKs.

### `PromptSharp.Application`

Contains:

- MediatR commands, queries, and stream requests.
- Handlers.
- DTOs.
- FluentValidation validators.
- Application interfaces such as `IPromptSharpDbContext`, `ICurrentUser`, `ITokenService`, `IPasswordService`, `IAiPromptPlanner`, and `IAgentSkillCatalog`.
- Manual mapping extension classes.
- Exceptions used by API problem-details middleware.
- MediatR pipeline behaviors.

No EF implementation. No Azure SDK concrete client. No ASP.NET controllers.

### `PromptSharp.Infrastructure`

Contains:

- EF Core `PromptSharpDbContext`.
- Entity type configurations.
- Migrations.
- SQL Server implementation of application persistence.
- Password service.
- JWT token service.
- Refresh token generation and hashing.
- Azure OpenAI prompt planner.
- Agent-skill file catalog.
- Database seeding.

### `PromptSharp.Api`

Contains:

- `Program.cs`.
- MVC controllers.
- SignalR hub.
- Auth configuration.
- CORS configuration.
- Problem details and exception handling.
- Swagger/OpenAPI.
- Health endpoints through controllers or built-in health checks.

## 6. Domain Model

### `User`

Fields:

- `Guid Id`
- `string Email`
- `string NormalizedEmail`
- `string DisplayName`
- `string PasswordHash`
- `string PlanName`
- `int MonthlyProjectQuota`
- `DateTimeOffset CreatedAtUtc`
- `DateTimeOffset? LastSignInAtUtc`
- `string? LastUserAgent`
- `DateTimeOffset? DeletedAtUtc`

Rules:

- Email is unique by normalized email.
- Display name is required.
- Password hash is never returned by API.
- Deleted users cannot sign in.

### `RefreshToken`

Fields:

- `Guid Id`
- `Guid UserId`
- `string TokenHash`
- `DateTimeOffset CreatedAtUtc`
- `DateTimeOffset ExpiresAtUtc`
- `DateTimeOffset? RevokedAtUtc`
- `string? UserAgent`
- `string? IpAddress`

Rules:

- Store only the hash.
- Rotate on refresh.
- Revoked or expired tokens cannot be reused.

### `Project`

Fields:

- `Guid Id`
- `int ProjectNumber`
- `Guid UserId`
- `string Idea`
- `ProjectStatus Status`
- `GenerationStatus GenerationStatus`
- `string? Estimate`
- `string? Markdown`
- `string? RawAiResponse`
- `string? GenerationError`
- `string? SkillBundleVersion`
- `string? SkillBundleHash`
- `string? AzureDeploymentName`
- `DateTimeOffset CreatedAtUtc`
- `DateTimeOffset UpdatedAtUtc`
- `DateTimeOffset? GeneratedAtUtc`
- `DateTimeOffset? ArchivedAtUtc`

Enums:

- `ProjectStatus`: `InProgress`, `Shipped`, `Archived`
- `GenerationStatus`: `Queued`, `Running`, `Succeeded`, `Failed`

Rules:

- Idea is required and length-limited.
- Users can only access their own projects.
- Archived projects stay readable but do not appear in the default "all active" list unless requested.
- Markdown is rendered from normalized phases/prompts after generation succeeds.

### `Phase`

Fields:

- `Guid Id`
- `Guid ProjectId`
- `int Order`
- `string Title`

Rules:

- Phase order starts at 1 and has no gaps inside a project.

### `PromptItem`

Fields:

- `Guid Id`
- `Guid PhaseId`
- `int Order`
- `string Title`
- `string Body`
- `string TagsJson`

Rules:

- Prompt order starts at 1 and has no gaps inside a project.
- Tags are stored as JSON text for v1 simplicity.

## 7. Database Plan

Use EF Core code-first migrations.

Development connection string:

```json
{
  "ConnectionStrings": {
    "PromptSharp": "Server=localhost\\SQLEXPRESS;Database=PromptSharpDev;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True"
  }
}
```

Test connection string:

```json
{
  "ConnectionStrings": {
    "PromptSharpTest": "Server=localhost\\SQLEXPRESS;Database=PromptSharpTest;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True"
  }
}
```

Tables:

- `Users`
- `RefreshTokens`
- `Projects`
- `Phases`
- `PromptItems`

Indexes:

- `Users.NormalizedEmail` unique, filtered on `DeletedAtUtc IS NULL`.
- `RefreshTokens.TokenHash` unique.
- `RefreshTokens.UserId`.
- `Projects.UserId, CreatedAtUtc`.
- `Projects.UserId, ProjectNumber` unique.
- `Projects.ProjectNumber` unique if display numbers are global.
- `Projects.UserId, Status`.
- `Phases.ProjectId, Order` unique.
- `PromptItems.PhaseId, Order` unique.

Migrations:

- `InitialCreate`
- `AddProjectGenerationFields` only if generation fields are not included initially.

Development startup can apply migrations automatically in `Development`. Production should not auto-migrate.

## 8. Authentication Plan

### Token model

- Access token: JWT, 15 minute lifetime.
- Refresh token: random opaque token, 30 day lifetime, stored as SHA-256 hash.
- Access tokens are signed by backend.
- Dev signing key comes from user secrets or environment variable.
- Production signing key comes from Azure Key Vault or App Service configuration.

JWT claims:

- `sub`: user id.
- `email`: user email.
- `name`: display name.
- `jti`: token id.

### Password handling

- Use `PasswordHasher<User>`.
- Never write custom password hashing.
- Minimum password requirements enforced by FluentValidation:
  - 12 characters.
  - At least one letter.
  - At least one number or symbol.

### Auth endpoints

Controller: `AuthController`

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

Request/response DTOs:

- `RegisterRequestDto`
- `LoginRequestDto`
- `RefreshTokenRequestDto`
- `AuthResponseDto`

`AuthResponseDto`:

```json
{
  "accessToken": "...",
  "accessTokenExpiresAtUtc": "2026-05-15T20:00:00Z",
  "refreshToken": "...",
  "user": {
    "name": "Quinntyne Brown",
    "email": "quinn@example.com",
    "memberSinceLabel": "May 15, 2026",
    "plan": {
      "name": "Free",
      "tier": "tier",
      "projectsUsed": 3,
      "projectQuota": 5,
      "resetsLabel": "June 1"
    },
    "session": {
      "lastSignInLabel": "Today, 10:42 AM",
      "device": "Windows - Chrome"
    }
  }
}
```

### Account endpoints

Controller: `AccountController`

- `GET /api/v1/account`
- `PATCH /api/v1/account/profile`
- `PATCH /api/v1/account/email`
- `PATCH /api/v1/account/password`
- `DELETE /api/v1/account`

Delete account requires the current password.

## 9. Projects API Plan

Controller: `ProjectsController`

- `GET /api/v1/suggestions`
- `GET /api/v1/projects?search=&status=&page=&pageSize=`
- `POST /api/v1/projects`
- `GET /api/v1/projects/{projectNumber}`
- `GET /api/v1/projects/{projectNumber}/download`
- `PATCH /api/v1/projects/{projectNumber}/status`
- `DELETE /api/v1/projects/{projectNumber}`

Status patch supports:

- `in progress`
- `shipped`
- `archived`

Delete can be hard delete in v1. Archive is preferred for the visible UI.

### Create project flow

1. Client calls `POST /api/v1/projects` with `{ "idea": "..." }`.
2. Controller validates auth and request body.
3. Handler checks monthly quota.
4. Handler creates a `Project` row with `GenerationStatus = Queued`.
5. API returns the display project number and initial project summary.
6. Client opens SignalR stream for that project number.
7. Hub runs generation and streams progress events.
8. On success, handler saves phases, prompts, raw response, markdown, model info, and skill bundle hash.
9. Client navigates to or refreshes `GET /api/v1/projects/{projectNumber}`.

### Search behavior

Keep v1 search simple:

- Search `Project.Idea`.
- Search `PromptItem.Title`.
- Search `PromptItem.Body`.
- Search tag JSON text.

Use SQL `LIKE` in v1. Full-text search can be a later improvement.

## 10. SignalR Streaming Plan

Hub: `ProjectGenerationHub`

Route:

```text
/hubs/project-generation
```

Hub method:

```csharp
public IAsyncEnumerable<ProjectGenerationUpdateDto> StreamProjectGeneration(
    string projectNumber,
    CancellationToken cancellationToken)
```

Client sequence:

1. Start SignalR connection with JWT access token.
2. Call `connection.stream<ProjectGenerationUpdateDto>("StreamProjectGeneration", projectNumber)`.
3. Render updates as they arrive.
4. On `completed`, call `GET /api/v1/projects/{projectNumber}`.

Update DTO:

```json
{
  "type": "phase-started",
  "message": "Planning foundation prompts",
  "phaseIx": "01",
  "promptNumber": null,
  "delta": null,
  "project": null
}
```

Event types:

- `started`
- `skill-context-loaded`
- `phase-started`
- `prompt-started`
- `token`
- `normalizing`
- `completed`
- `failed`

Implementation rule:

- Do not introduce a background queue in v1.
- The SignalR stream runs the generation request.
- CancellationToken from SignalR cancels the Azure AI request.
- If the stream fails, persist `GenerationStatus = Failed` and a sanitized error message.

## 11. AI Generation Plan

Application interface:

```csharp
public interface IAiPromptPlanner
{
    IAsyncEnumerable<ProjectGenerationUpdateDto> GenerateProjectPlanAsync(
        ProjectGenerationInput input,
        CancellationToken cancellationToken);
}
```

Infrastructure implementation:

- `AzureOpenAiPromptPlanner`
- Uses `AzureOpenAIClient`.
- Uses a configured deployment name.
- Uses streaming chat completion from Azure OpenAI.

Configuration:

```json
{
  "AzureOpenAi": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "DeploymentName": "gpt-4.1",
    "ApiKey": ""
  }
}
```

Auth to Azure:

- Development may use API key from user secrets.
- Production should prefer managed identity through `DefaultAzureCredential`.

### Structured output strategy

For simplicity and reliability:

1. Ask the model for strict JSON matching `GeneratedProjectPlan`.
2. Stream user-visible progress/token updates.
3. Parse the final JSON with `System.Text.Json`.
4. Validate the parsed result with FluentValidation.
5. Normalize into `Phase` and `PromptItem` rows.
6. Render Markdown deterministically from normalized rows.

Do not parse arbitrary Markdown from the model into database rows.

Generated JSON shape:

```json
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
```

Validation rules:

- 3 to 7 phases.
- 10 to 50 prompts total.
- Every phase has 1 to 12 prompts.
- Titles are non-empty and concise.
- Prompt bodies are non-empty.
- Tags are optional but max 6 per prompt.
- Estimate is required.

## 12. Agent-Skills Plan

The referenced `addyosmani/agent-skills` repo describes skills as Markdown `SKILL.md` workflows with process steps, verification, common rationalizations, and red flags. The plan should use those as generation context, not as runtime code.

Do this:

- Vendor a curated snapshot of relevant skill Markdown into `backend/skills/agent-skills`.
- Add `manifest.json` with source repo URL, source commit SHA, skill names, and hash.
- Load those files through `FileAgentSkillCatalog`.
- Inject a condensed skill bundle into the Azure AI system prompt.
- Store `SkillBundleVersion` and `SkillBundleHash` on each generated project.

Start with these skills:

- `spec-driven-development`
- `planning-and-task-breakdown`
- `api-and-interface-design`
- `frontend-ui-engineering`
- `test-driven-development`
- `code-review-and-quality`
- `security-and-hardening`
- `shipping-and-launch`

Do not clone GitHub during user requests.
Do not fetch skills live at generation time.
Do not store the entire external repo in the database.

## 13. Markdown Rendering Plan

Application service: `ProjectMarkdownRenderer`

Render shape:

```text
# {Idea}

Project No. {ProjectNumber:D4} - {PromptCount} prompts - {PhaseCount} phases - est. {Estimate}

## Phase 01 - Foundation

### 01. Write the product spec
Tags: spec, 30 min

Draft a one-page spec...
```

Rules:

- Markdown generation is deterministic.
- Output comes from persisted normalized rows.
- Download endpoint returns `text/plain` or `text/markdown`.
- Filename: `promptsharp-{projectNumber}.txt`.

## 14. MediatR Plan

Use MediatR in Application for commands, queries, and stream requests.

Markers:

- `ICommand<TResponse> : IRequest<TResponse>`
- `ICommand : IRequest`
- `IQuery<TResponse> : IRequest<TResponse>`
- `IStreamCommand<TResponse> : IStreamRequest<TResponse>`

Pipeline behaviors:

1. `LoggingBehavior`
2. `ValidationBehavior`
3. `CurrentUserBehavior` if needed for audit context
4. `TransactionBehavior` for write commands only

Stream pipeline:

1. `StreamValidationBehavior`
2. `StreamLoggingBehavior`

Do not wrap the whole AI stream in a SQL transaction. Persist status changes before and after the stream.

## 15. Commands And Queries

Auth:

- `RegisterUserCommand`
- `LoginUserCommand`
- `RefreshAuthTokenCommand`
- `LogoutUserCommand`

Account:

- `GetAccountQuery`
- `UpdateProfileCommand`
- `UpdateEmailCommand`
- `UpdatePasswordCommand`
- `DeleteAccountCommand`

Projects:

- `GetSuggestionsQuery`
- `ListProjectsQuery`
- `CreateProjectCommand`
- `GetProjectQuery`
- `GetProjectDownloadQuery`
- `UpdateProjectStatusCommand`
- `DeleteProjectCommand`
- `GenerateProjectPlanStreamCommand`

Infrastructure-only:

- `SeedDevelopmentDataCommand` only if manual seed is needed.

## 16. DTO Contract

Keep DTOs close to current Angular fixtures.

### `ProjectSummaryDto`

```json
{
  "id": "0142",
  "idea": "A markdown note-taking app...",
  "promptCount": 14,
  "whenLabel": "4m ago",
  "status": "in progress"
}
```

### `ProjectDto`

```json
{
  "id": "0142",
  "idea": "A markdown note-taking app...",
  "createdLabel": "4m ago",
  "promptCount": 14,
  "phaseCount": 5,
  "estimate": "~3 days",
  "status": "in progress",
  "phases": []
}
```

### `PhaseDto`

```json
{
  "ix": "01",
  "title": "Foundation",
  "prompts": []
}
```

### `PromptDto`

```json
{
  "n": "01",
  "title": "Write the product spec",
  "body": "Draft a one-page spec...",
  "tags": ["spec", "30 min"]
}
```

### `UserDto`

```json
{
  "name": "Quinntyne Brown",
  "email": "quinn@example.com",
  "memberSinceLabel": "May 15, 2026",
  "plan": {
    "name": "Free",
    "tier": "tier",
    "projectsUsed": 3,
    "projectQuota": 5,
    "resetsLabel": "June 1"
  },
  "session": {
    "lastSignInLabel": "Today, 10:42 AM",
    "device": "Windows - Chrome"
  }
}
```

## 17. Controllers

### `AuthController`

Thin controller. Calls MediatR only. No password logic in controller.

### `AccountController`

Requires `[Authorize]`. Calls MediatR only.

### `ProjectsController`

Requires `[Authorize]` except suggestions can be anonymous.

### `HealthController`

Endpoints:

- `GET /health/live`
- `GET /health/ready`

Readiness checks SQL Server.

## 18. API Behavior

- JSON camelCase.
- Problem Details for errors.
- Validation errors return 400 with field errors.
- Unauthorized returns 401.
- Authenticated but wrong project owner returns 404 to avoid leaking project existence.
- Rate limit auth endpoints.
- CORS allows Angular dev origin in Development.
- OpenAPI emitted at `/openapi/v1.json` or Swagger JSON path used by the frontend generator.

## 19. Configuration

`appsettings.json`:

```json
{
  "ConnectionStrings": {
    "PromptSharp": ""
  },
  "Jwt": {
    "Issuer": "PromptSharp",
    "Audience": "PromptSharp.Web",
    "SigningKey": "",
    "AccessTokenMinutes": 15,
    "RefreshTokenDays": 30
  },
  "AzureOpenAi": {
    "Endpoint": "",
    "DeploymentName": "",
    "ApiKey": ""
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:4200"]
  }
}
```

Secrets:

- `Jwt:SigningKey`
- `AzureOpenAi:ApiKey` if not using managed identity.

## 20. Manual Mapping Policy

No mapper libraries.

Use one mapper type per target area:

- `ProjectMappings`
- `AccountMappings`
- `AuthMappings`

These are static extension classes in Application. Each mapper class is one C# type in one file.

Mapping rules:

- Mapping should be obvious and direct.
- No reflection.
- No expression-tree mapper framework.
- No generic mapper abstraction.

## 21. Validation Policy

Use FluentValidation for all external inputs:

- Register request.
- Login request.
- Refresh token request.
- Update profile.
- Update email.
- Update password.
- Delete account.
- Create project.
- List projects query.
- Update project status.
- Parsed AI output.

Do not duplicate validation attributes on DTOs unless ASP.NET Core needs them for binding.

## 22. Testing Plan

### Domain tests

- User cannot be created with invalid email.
- Project cannot be created with empty idea.
- Phase/prompt ordering helpers produce contiguous numbers.
- Deleted user cannot sign in.

### Application tests

Run against SQL Server Express test database:

- Register creates user with hashed password.
- Login returns access and refresh tokens.
- Login rejects invalid password.
- Refresh rotates refresh token.
- Logout revokes refresh token.
- Account DTO computes plan usage.
- Create project enforces quota.
- List projects filters by status and search.
- Project detail returns phases/prompts in order.
- Download renderer output is deterministic.
- Failed generation marks project failed and stores sanitized error.

### API integration tests

Use `WebApplicationFactory`.

- Auth endpoints happy path.
- Protected endpoints return 401 without token.
- Users cannot access another user's project.
- `GET /health/ready` fails if DB is unavailable.
- OpenAPI endpoint exists.

### SignalR integration tests

- Authenticated client can stream generation for own queued project.
- Unauthenticated hub connection is rejected.
- Wrong owner cannot stream.
- Cancellation cancels generation and does not persist partial success.

Use a fake `IAiPromptPlanner` for deterministic SignalR tests.

### Architecture/convention tests

- Domain has no project references.
- Application does not reference Infrastructure or Api.
- Api is the only project that references Infrastructure.
- No `MapGet`, `MapPost`, `MapGroup`, or Minimal API endpoint classes in Api.
- Each `.cs` file declares at most one public C# type.
- No references to mapper libraries.
- MediatR package version is pinned to `12.5.0`.

## 23. Implementation Phases

### Phase 0 - Confirm v1 scope and clear old backend assumptions

Deliverables:

- This plan accepted.
- Older v0 backend plan left intact but not used for v1.
- Decision recorded on .NET 10 vs .NET 9.

Acceptance:

- No admin/tutorial CMS work is included in v1 tasks.

### Phase 1 - Scaffold solution

Deliverables:

- `backend/PromptSharp.sln`.
- Four source projects.
- Three test projects.
- Central package management.
- `global.json`.
- Build props.
- Empty API boots.
- Health endpoints.
- OpenAPI.

Acceptance:

- `dotnet build backend/PromptSharp.sln --warnaserror`
- `dotnet test backend/PromptSharp.sln`

### Phase 2 - Database foundation

Deliverables:

- Domain entities.
- DbContext.
- EF configurations.
- Initial migration.
- SQL Server Express dev connection.
- SQL Server Express test connection.

Acceptance:

- App applies migrations in Development.
- Test database can be recreated.
- Architecture tests pass.

### Phase 3 - Auth and account

Deliverables:

- Register/login/refresh/logout.
- Password hashing.
- JWT issuing and validation.
- Account endpoint.
- Profile/password/email update.
- Delete account.

Acceptance:

- User can register, login, call `GET /api/v1/account`, refresh token, logout.
- Password hash is not plaintext.
- Protected endpoints reject missing/invalid token.

### Phase 4 - Project library without AI

Deliverables:

- Suggestions endpoint.
- Create queued project.
- List projects.
- Project detail.
- Status update.
- Archive/delete.
- Download renderer.
- Manual seed or test fixture data.

Acceptance:

- Frontend can replace project fixtures with API calls for projects/account.
- Project detail shape matches v1 fixture shape.

### Phase 5 - Agent skills catalog

Deliverables:

- Curated skill snapshot under `backend/skills/agent-skills`.
- Manifest with source commit and hash.
- `FileAgentSkillCatalog`.
- Tests for loading and hashing.

Acceptance:

- Generation prompt can include the configured skill bundle.
- Project stores skill bundle version/hash.

### Phase 6 - Azure AI planner

Deliverables:

- `IAiPromptPlanner`.
- `AzureOpenAiPromptPlanner`.
- Structured JSON output request.
- Parsed output DTO.
- Output validators.
- Markdown renderer integration.
- Failure handling.

Acceptance:

- With Azure config, a queued project becomes generated with phases/prompts.
- With fake planner, tests are deterministic.

### Phase 7 - SignalR generation streaming

Deliverables:

- `ProjectGenerationHub`.
- `GenerateProjectPlanStreamCommand`.
- Stream DTOs.
- JWT auth on hub.
- Cancellation handling.

Acceptance:

- Angular can subscribe to generation updates.
- Stream completion produces a persisted project.
- Failed stream produces a failed project state with safe error.

### Phase 8 - Hardening

Deliverables:

- Rate limits on auth and project creation.
- CORS config.
- Problem Details middleware.
- Logging.
- Sanitized AI errors.
- Integration tests for ownership and failure cases.

Acceptance:

- No project ownership leak.
- No secrets in logs.
- All tests pass.

## 24. Initial File Checklist

Create first:

- `backend/global.json`
- `backend/Directory.Build.props`
- `backend/Directory.Packages.props`
- `backend/PromptSharp.sln`
- `backend/src/PromptSharp.Domain/PromptSharp.Domain.csproj`
- `backend/src/PromptSharp.Application/PromptSharp.Application.csproj`
- `backend/src/PromptSharp.Infrastructure/PromptSharp.Infrastructure.csproj`
- `backend/src/PromptSharp.Api/PromptSharp.Api.csproj`
- `backend/tests/...`

Then add types one file at a time.

## 25. Risks And Simple Mitigations

### Risk: AI output is malformed

Mitigation:

- Ask for JSON.
- Validate strictly.
- Persist failed state.
- Let user retry later.

### Risk: SignalR stream drops

Mitigation:

- Project remains queued/running/failed.
- Client can fetch project status.
- Retry only allowed for queued/failed generation.

### Risk: Auth expands into full identity platform

Mitigation:

- Keep local user table.
- Use framework password hasher.
- Issue simple signed JWT access token plus opaque refresh token.
- Defer strict OAuth2/OIDC conformance.

### Risk: Agent-skills source changes

Mitigation:

- Vendor a curated snapshot.
- Store source commit and hash.
- Update deliberately, not at runtime.

### Risk: Clean Architecture turns into ceremony

Mitigation:

- No repositories unless needed.
- Application uses `IPromptSharpDbContext`.
- Handlers are simple.
- Mapping is manual.
- No shared base entity unless it removes repeated code.

## 26. Source Notes

- `addyosmani/agent-skills` documents skills as Markdown `SKILL.md` workflows with process and verification sections: https://github.com/addyosmani/agent-skills/blob/main/docs/getting-started.md
- The agent-skills README describes the skills as packaged workflows and quality gates for AI coding agents: https://github.com/addyosmani/agent-skills
- ASP.NET Core SignalR supports server-to-client streaming through hub methods returning `IAsyncEnumerable<T>` or `ChannelReader<T>`: https://learn.microsoft.com/en-us/aspnet/core/signalr/streaming
- Azure OpenAI's .NET client exposes `AzureOpenAIClient` and `GetChatClient` for chat completions, including streaming APIs: https://learn.microsoft.com/en-us/dotnet/api/overview/azure/ai.openai-readme
- .NET support policy as of 2026-05-15 lists .NET 10 as LTS and .NET 9 as STS: https://dotnet.microsoft.com/en-us/platform/support/policy
- NuGet shows MediatR 12.5.0 as available and MediatR 14.x with license key configuration in package documentation: https://www.nuget.org/packages/MediatR/12.5.0 and https://www.nuget.org/packages/MediatR/14.1.0

