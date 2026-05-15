# Prompt/Sharp Angular Implementation Plan

Plan for implementing `frontend/projects/promp-sharp` as the Angular application for public, authenticated learner, and authenticated admin pages.

This plan builds on:

- `docs/skeletons/*.html` as the visual mocks and loading-state contracts.
- `docs/component-atoms-plan.md` for reusable primitive UI.
- `docs/domain-components-plan.md` for page, section, dialog, and domain component boundaries.
- `e2e/pages` and `e2e/tests` for Playwright page-object ATDD.
- `frontend/projects/api` for real HTTP clients.
- `backend/src/PromptSharp.Api` plus EF Core migrations for real SQL Server persistence.

## Current State

- The Angular app still contains the generated starter shell. `app.routes.ts` is empty and `app.html` is placeholder markup.
- The e2e suite already contains page objects and high-level tests for public discovery, tutorial reading, auth, user workspace, admin content, admin governance, and screen contracts.
- The frontend API library already wraps the backend `/api/v1` endpoints for tutorials, taxonomy, media, users, and current-user features.
- The backend uses EF Core SQL Server and applies migrations in Development. The checked-in development connection string targets `localhost,1433`; this implementation must add a documented SQL Express path and run against a real SQL Express database for local/e2e verification.
- The backend lacks a few API surfaces implied by the frontend mocks and tests, especially audit log, admin dashboard summary, user invitation, and contact submission. Those must be added as real backend slices where needed, not faked in the frontend.

## Non-Negotiables

- Every task starts with a failing Playwright e2e test in `e2e/tests` using or updating page objects in `e2e/pages`.
- Each slice implements the smallest production code needed to make that test pass.
- Frontend data comes from real HTTP calls through `frontend/projects/api`; no production stub services, static fixture arrays, or temporary mock endpoints.
- Backend persistence uses the real SQL Express database during local/e2e verification. Testcontainers remain acceptable for backend automated integration tests, but the app-level verification target is SQL Express.
- Skeleton/loading states are real UI states. They may be triggered in tests by slow network timing or pending real requests, but not by test-only production flags.
- Dialog mocks must be implemented as dialogs. Do not replace them with inline forms when the skeleton shows a modal flow.
- Icons must render as actual icons from the chosen icon implementation, not as visible icon-name text.
- Navigation, query params, guarded routes, spacing, padding, alignment, and responsive behavior are part of done.

## ATDD Loop For Every Task

1. Add or tighten the failing Playwright test first.
2. Update the page object model before adding assertions directly to specs.
3. Run the targeted test and keep the failure as the contract.
4. Implement the smallest vertical production slice across backend, API client, domain/components, route, and app composition.
5. Run the targeted e2e test until green.
6. Run the slice-specific build/typecheck/unit checks.
7. Complete the five-pass review checklist below before moving on.

## Baseline Commands

Use these as the expected verification commands unless a slice calls for a narrower command.

```powershell
# Backend, from C:\projects\prompt-sharp\backend
$env:ConnectionStrings__PromptSharpDb='Server=.\SQLEXPRESS;Database=PromptSharp;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False'
dotnet build PromptSharp.sln --warnaserror
dotnet test PromptSharp.sln
dotnet run --project src\PromptSharp.Api
```

```powershell
# Frontend, from C:\projects\prompt-sharp\frontend
npm run build -- --configuration development
npx ng build api
npx ng build components
npx ng build domain
npx ng build promp-sharp --configuration development
```

```powershell
# E2E, from C:\projects\prompt-sharp\e2e
npm run typecheck
npm run test -- --project=chromium
npm run test -- --project=mobile-chrome
```

For visual checks against skeletons:

```powershell
# Example only; substitute the mock and app route under review.
npx playwright screenshot file:///C:/projects/prompt-sharp/docs/skeletons/home.html docs/review/home-mock.png --viewport-size=1440,1000
npx playwright screenshot http://127.0.0.1:4200/ docs/review/home-app.png --viewport-size=1440,1000
npx playwright screenshot http://127.0.0.1:4200/ docs/review/home-mobile.png --viewport-size=393,851
```

## Foundation Tasks

### 0. SQL Express, Backend Runtime, And E2E Harness

Mock coverage: prerequisite for all mocks.

Failing e2e first:

- Add `e2e/tests/runtime-integration.spec.ts`.
- Add or update a small app/runtime page object that proves the app is rendering from Angular and that a public page loads data from `/api/v1`.
- The test should fail while the app has no API provider, no backend orchestration, and no seeded real data.

Implementation:

- Add a documented SQL Express connection-string path for Development and e2e. Prefer environment-variable override so secrets and machine-specific instance names are not committed.
- Update Playwright `webServer` orchestration to support both backend and frontend, or document a reliable preflight when SQL Express/API must be started externally.
- Add e2e auth state setup that creates signed dev JWTs using the development signing key and writes `e2e/.auth/*.json` storage states for learner, editor, and admin roles.
- Add idempotent e2e data setup through real backend APIs. Seed categories, tags, tutorials, published/featured/editor-pick states, users, bookmarks, progress, and media using HTTP and SQL Express.
- Add backend/data gaps discovered by the seed path as real application code.

Done checks:

- `/health/ready` is green against SQL Express.
- The app receives real responses from the backend.
- No frontend route is backed by static sample arrays.

### 1. Angular App Shell, Routing, API Provider, And Auth Adapter

Mock coverage: shared public/admin chrome for all mocks.

Failing e2e first:

- Tighten `e2e/tests/screen-contract.spec.ts` so it fails on the Angular placeholder and verifies public/admin shell landmarks.
- Update `BasePage` or shared page objects for nav, status messages, dialogs, and route guards.

Implementation:

- Replace the Angular starter template in `app.html`.
- Configure `providePromptSharpApi` in `app.config.ts`.
- Add environment-driven API base URL and access-token provider.
- Add route table for all public, auth, learner, admin, dialog-host, and catch-all pages.
- Add route guards for authenticated learner/editor/admin routes.
- Keep `frontend/projects/promp-sharp` thin: providers, route declarations, shell outlet, and app-level auth adapter only.

Done checks:

- `app.routes.ts` maps every route in `e2e/pages/routes.ts`.
- Unauthorized admin/user routes redirect or show access denied consistently.
- The app shell has no generated Angular placeholder markup.

## Vertical Page And Dialog Tasks

### 2. Home

Mocks: `home.html`.

Failing e2e first:

- Update `HomePage` and `public-discovery.spec.ts` to assert featured tutorials, editor pick, category links, latest tutorials, skeleton loading, and sign-in navigation.
- Add a network assertion that home calls real tutorial/category endpoints.

Implementation:

- Implement the route-ready home page using domain/components.
- Wire `PromptSharpTutorialsApi` for featured, editor pick, latest/list data and `PromptSharpCategoriesApi` for categories.
- Render loading, error, empty, and populated states.

### 3. Tutorial Catalog

Mocks: `catalog.html`.

Failing e2e first:

- Update `TutorialCatalogPage` to cover search, category filter, difficulty filter, grid/list toggle, reset, pagination, and opening a tutorial.

Implementation:

- Wire `GET /api/v1/tutorials` with query params.
- Keep filter state in URL query params.
- Render catalog skeletons while requests are pending.

### 4. Category And Tag Pages

Mocks: `category.html` for categories and the same layout adapted for tags.

Failing e2e first:

- Update `CategoryPage` and `TagPage` to assert grouped page heroes, sorting/filtering, and tutorial navigation.

Implementation:

- Wire `GET /api/v1/categories/{slug}/tutorials` and `GET /api/v1/tags/{slug}/tutorials`.
- Use the category mock layout for both route types while changing copy and metadata.

### 5. Search Results

Mocks: `search-results.html`.

Failing e2e first:

- Update `SearchResultsPage` to assert query preservation, result count/meta text, changing searches, and tutorial navigation.

Implementation:

- Wire search to `GET /api/v1/tutorials?search=...` or add the backend query parameter if missing.
- Keep the search query in `?q=`.
- Ensure the search field is not an inline admin-style form.

### 6. Tutorial Detail Reading Experience

Mocks: `tutorial-detail.html`.

Failing e2e first:

- Update `TutorialDetailPage` and `tutorial-reading.spec.ts` for start, step navigation, copy code, bookmark, progress, category/tag links, and responsive code blocks.

Implementation:

- Wire `PromptSharpTutorialsApi.get(slug)`.
- Wire `PromptSharpMeApi` for bookmark and progress only when authenticated.
- Implement markdown/code rendering, copy feedback, table of contents, current-step state, and related tutorials with real API data.

### 7. About, Contact, And Not Found

Mocks: `about.html`, `error-404.html`.

Failing e2e first:

- Update `AboutPage`, `ContactPage`, and `NotFoundPage`.
- Assert company context, contact submission, confirmation, 404 recovery actions, and home navigation.

Implementation:

- Implement `/about` from `about.html`.
- Implement `/contact` from the contact-card portion of `about.html` because there is no separate `contact.html` skeleton.
- Add a real backend contact submission endpoint if contact submission is retained. Persist or record the message in SQL Express; do not fake success in the frontend.
- Implement catch-all 404 from `error-404.html`.

### 8. Auth Surfaces

Mocks: `signin.html`, `oauth-callback.html`, `oauth-consent-dialog.html`, `access-denied.html`.

Failing e2e first:

- Update `SignInPage`, `OAuthCallbackPage`, and `AccessDeniedPage`.
- Adjust existing authentication tests so they reflect the resource-server backend: external OAuth redirects plus e2e/dev JWT storage, not a fake production login API.

Implementation:

- Implement provider buttons and configured OAuth redirect URLs.
- Implement OAuth callback processing and error states.
- Implement OAuth consent visual contract if it is an in-product route.
- Implement access-denied role guidance and a real request-access path if that action remains in tests.

### 9. Profile

Mocks: `profile.html`, plus `signout-dialog.html` when signing out.

Failing e2e first:

- Update `ProfilePage` to use learner storage state and assert OAuth identity, roles, linked accounts, progress link, and sign-out dialog.

Implementation:

- Wire `GET /api/v1/me`.
- Implement profile sections from real user data.
- Implement sign-out by clearing token state and navigating to `/sign-in`.

### 10. Progress And Bookmarks

Mocks: `progress.html`.

Failing e2e first:

- Update `ProgressBookmarksPage` to assert in-progress and bookmarked groupings, resume navigation, and remove bookmark.

Implementation:

- Wire `GET /api/v1/me/bookmarks`, `GET/PUT /api/v1/me/progress/{tutorialId}`, and bookmark delete.
- Render progress meters and grouped rows from real backend state.

### 11. Admin Dashboard

Mocks: `admin-dashboard.html`.

Failing e2e first:

- Update `AdminDashboardPage` to require admin auth, assert summary stats/recent operations, and navigate to tutorials, create, media, users, and audit log.

Implementation:

- Implement admin shell/nav/topbar.
- Add a real `GET /api/v1/admin/dashboard` endpoint if composing existing endpoints is not enough for the mock.
- Ensure dashboard stats come from SQL Express data.

### 12. Admin Tutorial List And Tutorial Dialog

Mocks: `admin-tutorial-list.html`, `admin-tutorial-dialog.html`.

Failing e2e first:

- Update `AdminTutorialListPage` to assert search, filter, row actions, create/edit dialog or route, publish, feature, editor-pick, and delete entry points.

Implementation:

- Wire `PromptSharpAdminTutorialsApi`.
- Keep row actions as icon buttons with accessible names.
- Implement the tutorial dialog as a modal where the mock shows a modal.

### 13. Admin Tutorial Editor And Inline Step Editor

Mocks: `admin-tutorial-editor.html`, `admin-unsaved-changes-dialog.html`.

Failing e2e first:

- Update `TutorialEditorPage` and `StepEditorPage`.
- Treat `/admin/tutorials/:id/steps/:stepId` as a route into the editor with that step selected, not a separate page, matching the inline step editor mock.

Implementation:

- Wire create/update tutorial, get tutorial, replace ordered steps, category/tag/media selectors, draft save, preview, and publish action.
- Implement dirty-state tracking and unsaved-changes dialog.
- Keep the editor three-pane layout responsive without overlapping controls.

### 14. Publish And Delete Dialogs

Mocks: `admin-publish-dialog.html`, `admin-confirm-delete-dialog.html`.

Failing e2e first:

- Add dialog-specific POM helpers on `AdminTutorialListPage` and `TutorialEditorPage`.
- Assert publish/unpublish/schedule intent, destructive confirmation, cancellation, and status feedback.

Implementation:

- Wire real publish and delete endpoints.
- If scheduled publishing is not supported by the backend yet, either add the backend field/command or keep the control disabled with tested copy that matches the real capability. Do not pretend scheduling succeeded.

### 15. Admin Taxonomy

Mocks: `admin-categories.html`, `admin-category-dialog.html`.

Failing e2e first:

- Update `CategoryTagManagementPage` to assert tabs, category table, tag table, create/edit dialogs, validation, delete, and route/nav behavior.

Implementation:

- Wire admin category and tag APIs.
- Implement color and icon inputs as real persisted fields only if the backend supports them. Otherwise add the backend fields in this slice or omit the controls from production with an explicit test change.

### 16. Admin Media

Mocks: `admin-media.html`, `admin-media-upload-dialog.html`.

Failing e2e first:

- Update `MediaLibraryPage` for upload dialog, upload progress, search, copy URL, selection mode, and delete.

Implementation:

- Wire admin media list/upload/delete APIs.
- Use real multipart upload and real local media storage through the backend.
- Show upload progress from the browser request where available.

### 17. Admin Users And Invite

Mocks: `admin-users.html`, `admin-user-invite-dialog.html`.

Failing e2e first:

- Update `UserRoleManagementPage` for search, role changes, invite dialog, validation, and saved feedback.

Implementation:

- Wire admin user list and role update APIs.
- Add a real user invitation API/table if invite remains in the UI. Sending email can remain out of scope, but invitation state must be persisted instead of faked.

### 18. Admin Audit Log

Mocks: `admin-audit-log.html`.

Failing e2e first:

- Update `AuditLogPage` for filters, event rows, expanded/details dialog, before/after diff, and actor/action filtering.

Implementation:

- Add audit event persistence in SQL Express for admin mutations.
- Add `GET /api/v1/admin/audit-log` with filters.
- Emit audit records from tutorial, taxonomy, media, and user-role mutations.

### 19. Session Expiry And Sign Out Dialogs

Mocks: `session-expired-dialog.html`, `signout-dialog.html`.

Failing e2e first:

- Add e2e coverage for expired/invalid token handling and explicit sign out from profile/admin chrome.

Implementation:

- Centralize 401 handling in the auth adapter/interceptor path.
- Show the session-expired dialog on expired auth for protected routes.
- Ensure focus trap, escape behavior, and actions match the dialog contracts.

### 20. Notifications

Mocks: `notifications.html`.

Failing e2e first:

- Add `NotificationsPage` only if the gallery is implemented as a real internal route.
- Otherwise add notification assertions to the interactions that trigger each variant.

Implementation:

- Implement banner/snackbar primitives and a notification service facade.
- Add a protected internal visual contract route such as `/admin/notifications` if the mock must be directly reviewable in the app.
- Trigger success, error, info, and warning states from real interactions.

## Final Hardening Task

Failing e2e first:

- Add a final `screen-contract.spec.ts` pass that visits every route from `routes.ts`, including mobile viewport coverage where layout risk is high.
- Add a route/navigation test that clicks through public nav, admin rail, profile/progress links, dialog actions, and recovery links.

Implementation:

- Remove any temporary paths, placeholder copy, unused mock-only components, and test-only production toggles.
- Confirm all mocks have a production route, dialog trigger, or explicit component-host route.
- Confirm all HTTP-backed screens show loading, error, empty, and populated states.

Verification:

- Run backend build/tests.
- Run frontend builds for `api`, `components`, `domain`, and `promp-sharp`.
- Run e2e chromium and mobile projects.
- Capture Playwright CLI screenshots for each skeleton and implemented route at desktop and mobile sizes.

## Five-Pass Review Checklist

Complete these five reviews after every vertical task and once again at the end.

### Review 1 - ATDD And Test Quality

- The Playwright test failed before implementation and passes afterward.
- Tests use page objects instead of raw locators scattered through specs.
- No `test.only`, skipped tests, broad timeouts, or assertion-light smoke tests.
- Existing page objects and tests were updated instead of duplicated.

### Review 2 - Skeleton Fidelity

- Compare the app route/dialog to the matching `docs/skeletons/*.html` using Playwright CLI screenshots.
- Check desktop and mobile viewports.
- Icons render as icons, not visible icon-name text.
- Dialog mocks open as dialogs and not inline forms.
- Skeleton/loading mocks are triggered by real pending UI state.
- Spacing, padding, alignment, text wrapping, and responsive behavior match the mock closely enough to be intentional.

### Review 3 - Real Integration

- The frontend calls backend APIs through `frontend/projects/api`.
- No production stub services, static fixture arrays, fake success paths, or mock-only branches remain.
- Backend reads/writes SQL Express for the feature under review.
- Authenticated calls include real bearer tokens accepted by the backend.
- Network failures and validation errors produce real error states.

### Review 4 - Navigation, Auth, And Workflow Completeness

- Links, buttons, route params, query params, back/cancel actions, and redirects work.
- RBAC behavior is correct for anonymous, learner, editor, and admin users.
- Forms validate through the same constraints as the backend.
- Status messages, banners, dialogs, and focus behavior are accessible.

### Review 5 - Code Hygiene

- Search for temporary code before closing the task:

```powershell
rg -n "TODO|TEMP|temporary|stub|fake|mock|hardcoded|console\.log|debugger" frontend backend e2e
```

- Keep only intentional test fixture code under `e2e`.
- No unrelated refactors or generated churn.
- Angular strict builds pass.
- Backend build/tests pass when backend code changed.
- E2E targeted tests pass, then the relevant suite passes.

## Page Coverage Matrix

| Mock | Production coverage |
|---|---|
| `home.html` | `/` |
| `catalog.html` | `/tutorials` |
| `tutorial-detail.html` | `/tutorials/:slug` |
| `category.html` | `/categories/:slug` and `/tags/:slug` adapted layout |
| `search-results.html` | `/search?q=...` |
| `about.html` | `/about`; `/contact` derives from its contact-card section |
| `error-404.html` | catch-all route |
| `signin.html` | `/sign-in` |
| `oauth-callback.html` | `/auth/callback` |
| `oauth-consent-dialog.html` | `/auth/consent` or equivalent auth route |
| `access-denied.html` | `/access-denied` |
| `profile.html` | `/me/profile` |
| `progress.html` | `/me/progress` |
| `admin-dashboard.html` | `/admin` |
| `admin-tutorial-list.html` | `/admin/tutorials` |
| `admin-tutorial-dialog.html` | tutorial create/edit modal trigger |
| `admin-tutorial-editor.html` | `/admin/tutorials/new`, `/admin/tutorials/:id/edit`, and selected-step route |
| `admin-confirm-delete-dialog.html` | delete trigger from tutorial/taxonomy/media rows as applicable |
| `admin-publish-dialog.html` | publish trigger from tutorial list/editor |
| `admin-category-dialog.html` | taxonomy create/edit trigger |
| `admin-categories.html` | `/admin/taxonomy` |
| `admin-media.html` | `/admin/media` |
| `admin-media-upload-dialog.html` | upload trigger from media page/editor media picker |
| `admin-users.html` | `/admin/users` |
| `admin-user-invite-dialog.html` | invite trigger from users page |
| `admin-audit-log.html` | `/admin/audit-log` |
| `admin-unsaved-changes-dialog.html` | dirty editor navigation/save-close flow |
| `signout-dialog.html` | sign-out trigger from profile/admin chrome |
| `session-expired-dialog.html` | 401/expired-token flow on protected pages |
| `notifications.html` | notification primitives plus optional `/admin/notifications` visual contract route |

## Done Definition

The implementation is complete when:

- Every mock in the matrix has a route, dialog trigger, or intentional visual-contract route.
- Every task has a failing-first Playwright test and a passing implementation.
- The app uses real HTTP and SQL Express-backed backend data for all service-backed screens.
- No temporary/stub production code remains.
- Playwright CLI screenshot review confirms the app matches the skeletons, including icons, dialog placement, loading states, navigation, spacing, padding, and alignment.
- Backend, frontend, and e2e verification commands pass.
