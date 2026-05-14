# Prompt/Sharp

Step-by-step tutorials for building production apps with Microsoft technologies — on-brand with [objectsharp.com](https://objectsharp.com/), with admin content management, OAuth2 + RBAC, and a deliberate focus on UX quality. See [`docs/idea.md`](docs/idea.md) for the product brief.

## Repository layout

```
prompt-sharp/
├── backend/      .NET 9 Clean Architecture API (Api / Application / Domain / Infrastructure + tests)
├── frontend/     Angular 21 workspace (api / components / domain / tokens libs + prompt-sharp app)
├── e2e/          Playwright end-to-end tests (page objects, fixtures, specs)
└── docs/         Product brief, screen inventory, skeleton HTML, plans
```

## Prerequisites

- .NET SDK 9.0.308 (pinned via `backend/global.json`, `rollForward: latestFeature`)
- Node.js (LTS) + npm
- Docker Desktop (SQL Server 2022 + Azurite via `backend/docker-compose.yml`)
- Playwright browsers (`npx playwright install` inside `e2e/`)

> ARM64 note: backend integration tests use Testcontainers gated by `RUN_TESTCONTAINERS=true` and fall back to Azure SQL Edge on ARM64 — see [`backend/README.md`](backend/README.md).

## Quick start

```powershell
# 1. Start SQL Server + Azurite
docker compose -f backend/docker-compose.yml up -d

# 2. Backend API — https://localhost:5001, OpenAPI at /openapi/v1.json
dotnet run --project backend/src/PromptSharp.Api

# 3. Frontend — http://localhost:4200
cd frontend
npm install
npm start

# 4. End-to-end tests (in a separate shell, with the API + frontend running)
cd e2e
npm install
npx playwright test
```

Dev startup applies EF Core migrations automatically. For production, run them explicitly — see [`backend/README.md`](backend/README.md).

## Verification

```powershell
# Backend — build with warnings as errors, then run all tests
dotnet build backend/PromptSharp.sln --warnaserror
dotnet test  backend/PromptSharp.sln

# Frontend — typecheck, unit tests (Vitest), production build
cd frontend
npm run typecheck
npm test
npm run build

# E2E — Playwright typecheck + run
cd e2e
npm run typecheck
npx playwright test
```

## Architecture highlights

- **Backend** — .NET 9, Clean Architecture, Controllers, MediatR (free version), EF Core on SQL Server, OAuth2, RBAC.
- **Frontend** — Angular 21 workspace split into `api` (typed clients), `domain` (models), `components` (UI), `tokens` (design tokens), consumed by the `prompt-sharp` app.
- **Media** — local filesystem in development; Azure Blob Storage in production via `AppSettings__Media__*` settings.

## Documentation

- [`docs/idea.md`](docs/idea.md) — product brief
- [`docs/screens.md`](docs/screens.md) — full screen inventory (public, auth, user, admin)
- [`docs/skeletons/`](docs/skeletons/) — self-contained HTML skeletons for each screen (loading-state references)
- [`docs/skeletons-plan.md`](docs/skeletons-plan.md) — plan for remaining skeletons + dialogs + notifications
- [`docs/backend-plan.md`](docs/backend-plan.md) — backend implementation plan
- [`backend/README.md`](backend/README.md) — backend setup, migrations, media storage details
- [`frontend/README.md`](frontend/README.md) — Angular CLI usage
