# Backend Plan — Prompt/Sharp

Comprehensive plan for the .NET backend that serves the Prompt/Sharp tutorial platform. Derived from `docs/idea.md` and `docs/screens.md`.

## 1. Scope & non-goals

**In scope**
- HTTP API consumed by the Angular frontend under `frontend/`
- Public catalog (tutorials, categories, tags)
- JWT bearer authentication
- Role-based authorization (Admin / Editor / User)
- Admin content management (tutorials, steps, categories, tags, media)
- Per-user features: bookmarks and tutorial progress

**Out of scope (initial release)**
- Issuing tokens or running an authorization server — the API is a pure **resource server** that validates incoming JWTs
- Email notifications, webhooks, real-time/SignalR
- Multi-tenancy
- Public write APIs (comments, ratings)

## 2. Tech stack & non-negotiables

From `docs/idea.md`:

| Concern | Choice | Notes |
|---|---|---|
| Runtime | .NET 9 | LTS-style cadence, current SDK |
| Architecture | Clean Architecture | 4 projects: Domain, Application, Infrastructure, Api |
| Web layer | ASP.NET Core **Controllers** | Per idea.md — not minimal APIs |
| Mediator | **MediatR v12.x** | Last free version. v13+ is commercial; **pin to `12.*`** in `Directory.Packages.props` |
| ORM | EF Core 9 + SQL Server | Code-first migrations |
| Authentication | JWT bearer tokens | API validates JWTs; issuer, audience, and signing key configured via app settings |
| Authorization | Role-based (RBAC) via ASP.NET Core policies | Roles stored in DB, projected into claims at sign-in |
| Validation | FluentValidation | Wired into MediatR pipeline |
| Logging | `Microsoft.Extensions.Logging` + Serilog | JSON sink for prod, console for dev |
| Tests | xUnit + FluentAssertions + Testcontainers (SQL Server) | Real DB in integration tests, not mocks |
| Package mgmt | Central Package Management (`Directory.Packages.props`) | One source of truth for versions |

## 3. Solution layout

```
backend/
  PromptSharp.sln
  Directory.Packages.props          # central versions (incl. MediatR 12.*)
  Directory.Build.props             # shared msbuild props (Nullable, LangVersion, TreatWarningsAsErrors)
  src/
    PromptSharp.Domain/             # entities, value objects, domain events — no deps
    PromptSharp.Application/        # MediatR requests/handlers, DTOs, ports, validators
    PromptSharp.Infrastructure/     # EF Core DbContext, repos, identity, storage adapters
    PromptSharp.Api/                # Controllers, middleware, DI composition, OpenAPI
  tests/
    PromptSharp.Domain.Tests/
    PromptSharp.Application.Tests/
    PromptSharp.Api.IntegrationTests/   # WebApplicationFactory + Testcontainers SQL
```

**Dependency direction (enforced by a unit test):**
Domain ← Application ← Infrastructure
                   ↖ Api → Infrastructure (composition root only)

The Api project is the only one that references Infrastructure. Application defines ports (interfaces); Infrastructure provides adapters.

## 4. Domain model

Single bounded context. Aggregates indicated with **bold**.

```
Tutorial (aggregate)
  Id (Guid)
  Slug (unique)
  Title
  Summary
  DifficultyLevel  : enum { Beginner, Intermediate, Advanced }
  EstimatedMinutes : int
  IsPublished      : bool
  IsFeatured       : bool         # admin curated set on home
  IsEditorsPick    : bool         # at most one tutorial true at a time (invariant)
  CategoryId       : FK
  AuthorId         : FK -> User
  CreatedAt, UpdatedAt
  Steps            : List<TutorialStep>  (owned, ordered)
  Tags             : many-to-many TutorialTag

TutorialStep (owned by Tutorial)
  Id, TutorialId, Order
  Title, BodyMarkdown
  CodeSnippet?, CodeLanguage?
  ImageMediaId?  -> Media

Category
  Id, Slug, Name, Order

Tag
  Id, Slug, Name

Media (aggregate)
  Id, Url, FileName, ContentType, SizeBytes
  UploadedById, UploadedAt

User (aggregate)
  Id (Guid)
  Sub          (subject claim from JWT, unique)
  Email, DisplayName, AvatarUrl
  CreatedAt, LastSeenAt
  Roles : many-to-many Role

Role
  Id, Name          # seeded: Admin, Editor, User

Bookmark              # per-user
  UserId, TutorialId, CreatedAt   (composite PK)

TutorialProgress      # per-user, per-tutorial
  UserId, TutorialId
  CurrentStepId?, CompletedStepIds (json), UpdatedAt
```

**Domain invariants** (enforced inside aggregates, not at the controller):
- `Slug` is unique per Tutorial and immutable once published
- Setting `IsEditorsPick = true` on a Tutorial clears it on all others (domain service, single transaction)
- Steps are contiguous (Order = 1..N, no gaps), enforced by `Tutorial.ReorderSteps()`
- `Tutorial.Publish()` requires at least one step and a non-empty Summary

## 5. API surface

Versioned under `/api/v1`. Conventional REST + a few action endpoints. All responses are camelCase JSON. Errors use RFC 7807 problem details.

### Public (anonymous)

| Method | Path | Returns |
|---|---|---|
| GET | `/api/v1/tutorials` | Paged list with `?category=`, `?tag=`, `?difficulty=`, `?page=`, `?pageSize=`, `?sort=` |
| GET | `/api/v1/tutorials/{slug}` | Full tutorial with steps |
| GET | `/api/v1/tutorials/featured` | Featured set for home |
| GET | `/api/v1/tutorials/editors-pick` | Single editor's pick |
| GET | `/api/v1/categories` | All categories with tutorial counts |
| GET | `/api/v1/categories/{slug}/tutorials` | Tutorials in category |
| GET | `/api/v1/tags/{slug}/tutorials` | Tutorials with tag |

### Authenticated user (role: `User`)

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/me` | Current user profile (from claims + DB) |
| GET | `/api/v1/me/bookmarks` | |
| POST | `/api/v1/me/bookmarks/{tutorialId}` | |
| DELETE | `/api/v1/me/bookmarks/{tutorialId}` | |
| GET | `/api/v1/me/progress/{tutorialId}` | |
| PUT | `/api/v1/me/progress/{tutorialId}` | Body: `{ currentStepId, completedStepIds[] }` |

### Admin (role: `Admin` — `Editor` for non-destructive writes)

| Method | Path | Min role |
|---|---|---|
| GET/POST | `/api/v1/admin/tutorials` | Editor |
| GET/PUT/DELETE | `/api/v1/admin/tutorials/{id}` | Editor / Editor / Admin |
| POST | `/api/v1/admin/tutorials/{id}/publish` | Editor |
| POST | `/api/v1/admin/tutorials/{id}/feature` | Editor |
| POST | `/api/v1/admin/tutorials/{id}/editors-pick` | Admin |
| PUT | `/api/v1/admin/tutorials/{id}/steps` | Editor (replaces ordered step list) |
| CRUD | `/api/v1/admin/categories`, `/api/v1/admin/tags` | Editor |
| POST/GET/DELETE | `/api/v1/admin/media` | Editor |
| GET/PUT | `/api/v1/admin/users`, `/api/v1/admin/users/{id}/roles` | Admin |

### Diagnostics

| Method | Path | Notes |
|---|---|---|
| GET | `/health/live` | Liveness — no DB |
| GET | `/health/ready` | Readiness — DB + auth metadata reachable |

OpenAPI document at `/openapi/v1.json` (built-in `Microsoft.AspNetCore.OpenApi`). The Angular `api` library generates clients from this with NSwag.

## 6. Authentication & authorization

### AuthN
- API is a pure **resource server** — no login UI, no token issuance, no IdP integration
- A single JWT bearer scheme; issuer, audience, and signing key validation parameters bound from `appsettings.json` / environment
- On first successful request, an `EnsureUserExists` MediatR command creates/updates the `User` row from claims (`sub`, `email`, `name`, `picture`)
- Refresh of `LastSeenAt` is fire-and-forget

### AuthZ
- Roles are stored in DB (`User.Roles`) and projected to claims at request time by a `ClaimsTransformation` so handlers can rely on `[Authorize(Roles = "Admin")]` and policy checks
- Policies:
  - `RequireUser` — any authenticated user
  - `RequireEditor` — `Editor` or `Admin`
  - `RequireAdmin` — `Admin`
- Endpoint protection is on controllers/actions; the MediatR pipeline has an **authorization behavior** that re-checks role requirements declared on the request (defense in depth and works for handlers reused outside HTTP)

### Anti-forgery
- Bearer tokens only, no cookies → no CSRF risk. Confirmed and documented in code via comment in `Program.cs`.

## 7. MediatR pipeline

Free-tier MediatR 12.x. Pipeline behaviors (executed in order):

1. `LoggingBehavior` — request name, user id, elapsed ms
2. `ValidationBehavior` — runs FluentValidators, throws `ValidationException` → 400 problem details
3. `AuthorizationBehavior` — checks `[Authorize]`-style attributes on the request
4. `TransactionBehavior` — opens a transaction for `ICommand` (writes), no-op for `IQuery`

Markers: `IQuery<T>`, `ICommand`, `ICommand<T>`. Plain `IRequest<T>` is rejected by a startup check to force intent.

## 8. Persistence

- **DbContext**: `PromptSharpDbContext` with `IEntityTypeConfiguration<T>` per aggregate root
- **Migrations**: `dotnet ef migrations add` from Api project, applied automatically in **Development** at startup, **never** in Production (run via `dotnet ef database update` from CI/deploy job)
- **Seeding**: roles (`Admin`, `Editor`, `User`) and the initial admin user (configured email from `AppSettings:BootstrapAdminEmail`) are seeded on startup if missing
- **Concurrency**: optimistic — `RowVersion` on `Tutorial`, `Category`, `Tag`
- **Soft delete**: `IsDeleted` + global query filter on `Tutorial` only; everything else is hard-deleted with cascade where safe

## 9. Media

- Local dev: filesystem under `App_Data/media/` served via static files
- Production: Azure Blob Storage behind a CDN; same `IMediaStore` port
- Allowed types: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` (svg sanitized)
- Max size: 5 MB enforced at the controller via `RequestSizeLimit`
- No EXIF stripping in v1 — note as a known gap

## 10. Cross-cutting

| Concern | Approach |
|---|---|
| CORS | Locked-down origin list from `AppSettings:Cors:AllowedOrigins`. Dev includes Angular dev server |
| Rate limiting | ASP.NET Core built-in fixed-window per IP on public endpoints; per-user on write endpoints |
| Error handling | `ProblemDetails` everywhere via `app.UseExceptionHandler()` + custom mapper for `ValidationException` → 400, `NotFoundException` → 404, `ForbiddenException` → 403 |
| Caching | `[ResponseCache]` on public GETs with short TTL (60s) for catalog, featured, editor's pick |
| Observability | Serilog → JSON stdout; OpenTelemetry traces optional (off by default) |
| Configuration | `appsettings.json` + `appsettings.{Env}.json` + env vars + user-secrets for dev keys. No secrets in repo |
| Time | `TimeProvider` (system) injected — never `DateTime.UtcNow` in handlers, so tests can freeze time |

## 11. Testing strategy

- **Domain tests** — pure unit tests around aggregate invariants (publish rules, editor's-pick exclusivity, step ordering)
- **Application tests** — handler tests using EF Core's SQL Server provider against Testcontainers; FluentAssertions; no mocks for the DB
- **Api integration tests** — `WebApplicationFactory<Program>` + Testcontainers; auth bypassed via a `TestAuthHandler` that injects configurable claims; covers happy path and 401/403 per endpoint
- **Architecture test** — a single xUnit test asserting Domain has zero project references and Application doesn't reference Infrastructure
- Target coverage: ≥80% on Domain and Application, integration tests cover every endpoint at least once

## 12. CI / deployment

- **CI** (GitHub Actions): `dotnet restore`, `build -warnaserror`, `test` with Testcontainers, publish OpenAPI artifact for the frontend client generator
- **Deployment target**: Azure App Service (Linux) + Azure SQL DB. Application Insights enabled. Migrations run as a separate `dotnet ef database update` step in the release pipeline before swap
- **Local dev**: `docker-compose.yml` with SQL Server 2022 + Azurite (blob emulator); `dotnet run --project src/PromptSharp.Api` starts the API at `https://localhost:5001`

## 13. Phased delivery

Each phase ends with: green build, all tests passing, working API for the next set of frontend screens.

| Phase | Goal | Deliverable |
|---|---|---|
| **0. Skeleton** | Solution, projects, central versions, MediatR pipeline scaffolding, health endpoints, OpenAPI, CI | Empty but well-architected backend that boots |
| **1. Domain & DB** | Tutorial/Step/Category/Tag/User/Role entities + migrations + seed | `dotnet ef database update` produces schema; seed data present |
| **2. Public catalog** | `GET` tutorials, featured, editor's pick, categories, tags | Home + Catalog + Tutorial Detail screens fully wired |
| **3. Auth + RBAC** | JWT bearer validation, `ClaimsTransformation`, policies, `/api/v1/me` | Sign-in works end-to-end; protected endpoints return 401/403 correctly |
| **4. Admin tutorials** | CRUD + publish/feature/editor's-pick actions, step replace | Admin Dashboard + Tutorial List + Tutorial Editor screens wired |
| **5. Categories, tags, media** | Admin CRUD + media upload | Category mgmt + Media library screens wired |
| **6. User features** | Bookmarks + Progress endpoints | Progress / Bookmarks screen wired |
| **7. Users & roles** | Admin user list, role assignment | User & Role mgmt screen wired |
| **8. Hardening** | Rate limiting, response caching, OpenTelemetry on, security review | Production-ready |

## 14. Open questions

These should be resolved before or during Phase 0 — they shape Phase 3 onward:

1. **Initial admin bootstrap** — env var with admin email is simple, but should we require a confirmation flow before promoting?
2. **Slug source-of-truth** — auto-generated from title with a unique counter, or admin-editable from day one? (Recommend: editable, default-generated)
3. **Markdown rendering location** — server-side (cached HTML in DB) or client-side? Client-side is simpler and keeps the API content-pure; server-side gives consistent rendering and lets us sanitize once. Default to client-side
4. **Step body format** — straight Markdown vs. MDX-like structured blocks? Straight Markdown for v1 keeps the editor simple

## 15. Not now, but worth flagging

- Comments / discussion threads under tutorials
- Per-user notes ("my notes on this step")
- Versioning of tutorials (drafts, history)
- Public RSS / Atom feed for new tutorials
- Sitemap.xml endpoint for SEO
- A "completed certificate" PDF when a user finishes a tutorial (supports the 11-star UX target)
- Code-block execution sandboxes — explicitly out of scope

---

**Status**: plan, not yet implemented. Backend folder will be created in Phase 0.
