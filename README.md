# PromptSharp

PromptSharp turns a plain-language app idea into a high-quality, ordered prompt pack for building that app end to end with a coding agent.

The v1 product is intentionally small: enter an idea, generate a Markdown plan, stream progress while it is generated, save the project, browse previous projects, copy prompts, and download the full prompt pack.

## Direction

The current source of truth is v1:

- Product brief: [`docs/idea.1.md`](docs/idea.1.md)
- UI skeletons: [`docs/skeletons/v1`](docs/skeletons/v1)
- Backend plan: [`docs/backend-v1-plan.md`](docs/backend-v1-plan.md)

Older tutorial/admin-CMS documents are legacy context from the previous direction. Do not use them to drive v1 implementation unless a task explicitly says so.

## Product Shape

PromptSharp v1 has six primary screens:

- Home: one prompt box and a few example ideas.
- Sign in: account access for saving projects.
- Projects: searchable project history.
- Project: generated phases and prompt cards.
- Account: profile, quota, session, and account deletion.
- 404: simple branded not-found state.

The backend supports this shape with a small API surface: auth, account, suggestions, projects, project download, and SignalR generation streaming.

## Repository Layout

```text
prompt-sharp/
  docs/
    idea.1.md                 v1 product brief
    backend-v1-plan.md        v1 backend implementation plan
    skeletons/v1/             static HTML references for v1 screens
  frontend/                   Angular 21 workspace
  e2e/                        Playwright tests
  backend/                    planned .NET backend location
```

`backend/` is the target location for the v1 backend and should contain `backend/PromptSharp.sln` when implemented.

## Backend Target

The v1 backend should be built under `backend/PromptSharp.sln`.

Required backend choices:

- .NET backend.
- SQL Server Express for development.
- Clean Architecture.
- ASP.NET Core Controllers, not Minimal API endpoints.
- SignalR for websocket generation streaming.
- Azure OpenAI or Azure AI services for prompt-plan generation.
- MediatR pinned to the free version line.
- FluentValidation.
- Backend-issued JWT bearer tokens.
- Users stored in SQL Server.
- Passwords hashed with framework password hashing.
- No mapper libraries.
- One C# file per C# type.
- Deterministic Markdown or `.txt` project download.

Planned projects:

```text
backend/
  PromptSharp.sln
  src/
    PromptSharp.Domain/
    PromptSharp.Application/
    PromptSharp.Infrastructure/
    PromptSharp.Api/
  tests/
    PromptSharp.Domain.Tests/
    PromptSharp.Application.Tests/
    PromptSharp.Api.IntegrationTests/
```

See [`docs/backend-v1-plan.md`](docs/backend-v1-plan.md) for the full endpoint, data model, SignalR, AI, validation, and test plan.

## Frontend

The frontend is an Angular 21 workspace with fixture-backed v1 pages.

Important paths:

- App routes: [`frontend/projects/prompt-sharp/src/app/app.routes.ts`](frontend/projects/prompt-sharp/src/app/app.routes.ts)
- API models and fixture services: [`frontend/projects/api/src/lib`](frontend/projects/api/src/lib)
- UI components: [`frontend/projects/components/src/lib`](frontend/projects/components/src/lib)
- Containers: [`frontend/projects/containers/src/lib`](frontend/projects/containers/src/lib)

Run the frontend:

```powershell
cd frontend
npm install
npm start
```

The app runs at `http://localhost:4200/`.

Frontend verification:

```powershell
cd frontend
npm test
npm run build
```

## E2E

Playwright tests live in `e2e/`.

```powershell
cd e2e
npm install
npm run typecheck
npm test
```

## Backend Development Commands

These commands apply after the v1 backend has been scaffolded:

```powershell
dotnet build backend/PromptSharp.sln --warnaserror
dotnet test backend/PromptSharp.sln
dotnet run --project backend/src/PromptSharp.Api
```

Development database target:

```text
Server=localhost\SQLEXPRESS;Database=PromptSharpDev;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True
```

Required local backend configuration:

- `Jwt:SigningKey`
- `AzureOpenAi:Endpoint`
- `AzureOpenAi:DeploymentName`
- `AzureOpenAi:ApiKey` or managed identity in hosted environments

## Implementation Principles

- Keep v1 radically simple while meeting the requirements.
- Prefer direct handlers, direct EF Core usage through application ports, and direct manual mapping.
- Do not add admin, CMS, billing, teams, public sharing, or background job infrastructure in v1.
- Persist normalized projects, phases, and prompts, then render downloads deterministically.
- Vendor a curated `agent-skills` snapshot for AI context; do not fetch it during generation.
- Treat project ownership as private: wrong-owner access should return 404.

