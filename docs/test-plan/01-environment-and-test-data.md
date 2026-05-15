# 01 - Environment and Test Data

## Local Environment

Use the same local services as the existing E2E configuration:

- Frontend: Angular dev server at `http://127.0.0.1:4201`.
- Backend: ASP.NET API at `http://127.0.0.1:5000`.
- Database: SQL Server database named `PromptSharp`.
- Connection string:

```text
Server=.\SQLEXPRESS;Database=PromptSharp;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False
```

The existing Playwright config starts both web servers unless `PLAYWRIGHT_SKIP_WEB_SERVER=1` is set.

## Required Commands

Run from repo root unless noted.

```powershell
cd backend
dotnet restore
dotnet build PromptSharp.sln -c Release
dotnet test PromptSharp.sln -c Release
```

```powershell
cd frontend
npm ci
npm run build
npm test -- --watch=false
```

```powershell
cd e2e
npm ci
npx playwright install
npx playwright test
```

## Environment Reset

Before a full verification run:

- Stop all local API and frontend server instances.
- Back up any developer database that should not be destroyed.
- Drop and recreate the E2E database or restore a known baseline.
- Run EF migrations.
- Run the application seeder.
- Remove prior Playwright report artifacts.
- Remove prior `.auth` state unless intentionally reusing the configured authenticated state.
- Clear browser storage in every Playwright project.

## Authentication Test States

Required authentication states:

| State | Purpose | Required claims |
| --- | --- | --- |
| Anonymous | Public discovery, auth, access denied, 404 | No token |
| Learner | Profile, progress, bookmarks, tutorial completion | `User` role |
| Editor | Tutorial authoring checks where admin is not required | `Editor` role |
| Admin | Full admin navigation and mutations | `Admin` role |
| Expired token | Session-expired and authorization handling | Expired `exp` |
| Invalid token | API and UI rejection handling | Invalid signature |

The current global setup writes a local JWT to `.auth/learner.json`. Expand this into separate storage states for learner, editor, admin, expired, and invalid-token contexts.

## Seed Data Requirements

Seed data must include stable identifiers that tests can query by slug, title, email, or file name.

### Tutorials

Create:

- `build-a-dotnet-api` published tutorial with at least four ordered steps.
- `deploy-to-azure` published featured tutorial.
- `secure-blazor-app` editor pick tutorial.
- `draft-openai-workflow` unpublished draft.
- One archived or deleted candidate tutorial for destructive action testing.

Each tutorial must include:

- Slug.
- Title.
- Summary.
- Difficulty.
- Estimated minutes.
- Category.
- At least two tags.
- One thumbnail or media reference.
- At least one markdown body section.
- At least one code block.

### Taxonomy

Create:

- Categories: `.NET`, `Azure`, `Blazor`, `AI`.
- Tags: `C#`, `ASP.NET Core`, `SQL Server`, `OpenAI`, `Security`.

### Users and Roles

Create:

- `alex.learner@example.com` with `User`.
- `erin.editor@example.com` with `User` and `Editor`.
- `avery.admin@example.com` with `User`, `Editor`, and `Admin`.
- `casey.pending@example.com` for invitation and role mutation tests.

### Media

Create:

- One SVG media asset.
- One PNG or JPEG media asset.
- One upload candidate file in E2E fixtures.
- One media asset referenced by a tutorial.

### Audit

Create or generate:

- Tutorial create event.
- Tutorial publish event.
- Taxonomy update event.
- Role update event.
- Media upload event.

## Data Isolation Rules

- Every test that creates data must use a unique suffix, such as the Playwright worker index plus timestamp.
- Every test must record created IDs for cleanup.
- Tests may not depend on execution order.
- Tests may not mutate seed records unless the flow specifically verifies mutation and then restores or creates an isolated record.
- Tests must verify persistence through SQL Server, not only by UI state.

## Failure Evidence

For every failure, collect:

- Playwright trace.
- Screenshot.
- Video if available.
- Browser console logs.
- Network request and response summary.
- API logs for the same timestamp.
- SQL query result for the affected record.
- Git commit hash.
- Browser project name and viewport.

