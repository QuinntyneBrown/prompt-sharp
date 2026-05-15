# 00 - Strategy and Exit Criteria

## Objective

Verify that the entire Prompt Sharp platform works end to end with 100% release confidence:

- Public users can discover, search, read, and contact.
- Authenticated learners can sign in, resume progress, bookmark tutorials, and manage profile-level flows.
- Admin users can manage tutorials, steps, taxonomy, media, users, roles, and audit history.
- The UI matches the intended skeleton mocks for the most part across desktop and mobile.
- Icons, fonts, CSS, layout, responsive behavior, and visual states render correctly.
- All data-changing actions persist to SQL Server and are verified directly in the database.
- No temporary, fake, test-only, placeholder, or unimplemented code remains in production paths.

## Test Layers

| Layer | Purpose | Required tools | Pass condition |
| --- | --- | --- | --- |
| Static source audit | Find fake/temp/unimplemented code and unsafe shortcuts | `rg`, lint/build, code review | No production-blocking findings |
| Unit/component tests | Validate local component and handler behavior | Angular/Vitest, .NET xUnit | All pass |
| API integration tests | Validate HTTP contracts, auth, validation, persistence | .NET integration tests, SQL Server/Testcontainers | All pass with real DB provider |
| E2E functional tests | Exercise full browser flows | Playwright desktop and mobile projects | All pass without route skips |
| Visual regression | Compare implemented screens to skeleton mocks | Playwright screenshots, manual review when needed | Approved diffs only |
| Accessibility and UX checks | Verify keyboard, focus, landmarks, labels, contrast | Playwright, axe or equivalent, manual keyboard pass | No critical or serious issues |
| Database verification | Prove data saved/deleted in SQL Server | SQL queries from test runner or verification script | Every mutation has DB evidence |
| Release signoff | Confirm no temporary code or unfinished behavior | Checklist and reviewer signoff | All criteria checked |

## Required Browser Matrix

Run all core E2E specs on:

- Desktop Chrome through the existing `chromium` Playwright project.
- Mobile Chrome through the existing `mobile-chrome` Playwright project.

Run the visual suite on at least:

- 390 x 844 mobile viewport.
- 768 x 1024 tablet viewport.
- 1440 x 900 desktop viewport.
- 1920 x 1080 wide desktop viewport.

## Required Data Matrix

Each suite run must start from deterministic data:

- At least one published featured tutorial.
- At least one editor pick tutorial.
- At least one draft tutorial.
- At least one tutorial with three or more steps.
- At least one tutorial with code blocks.
- At least one tutorial with media.
- At least one category with tutorials.
- At least one tag with tutorials.
- At least one learner user.
- At least one editor user.
- At least one admin user.
- At least one media asset.
- At least one audit event.

## Route Coverage Matrix

| Area | Route | Screen | Required result |
| --- | --- | --- | --- |
| Public | `/` | Home | Loads hero, featured tutorials, latest tutorials, categories, nav, footer |
| Public | `/tutorials` | Catalog | Search, filter, layout, pagination, tutorial navigation work |
| Public | `/catalog` | Redirect | Redirects to `/tutorials` |
| Public | `/categories/:slug` | Category page | Category tutorials load and filter |
| Public | `/category/:slug` | Redirect | Redirects to `/categories/:slug` |
| Public | `/tags/:slug` | Tag page | Tag tutorials load and filter |
| Public | `/search` | Search page | Query is preserved and results load |
| Public | `/tutorials/:slug` | Tutorial detail | Reader, steps, code, bookmark, progress work |
| Public | `/about` | About | Company context and nav links render |
| Public | `/contact` | Contact | Form validates and persists contact submission |
| Public | `/**` | Error page | Recovery links work |
| Auth | `/sign-in` | Sign in | OAuth buttons, remember me, fallback validation work |
| Auth | `/signin` | Redirect | Redirects to `/sign-in` |
| Auth | `/auth/callback` | OAuth callback | Success and provider error states work |
| Auth | `/oauth/callback` | Redirect | Redirects to `/auth/callback` |
| Auth | `/auth/consent` | OAuth consent | Consent actions work |
| Auth | `/oauth/consent` | Redirect | Redirects to `/auth/consent` |
| Auth | `/access-denied` | Access denied | Role messaging and request access flow work |
| User | `/me/profile` | Profile | Identity, saved state links, sign out work |
| User | `/profile` | Redirect | Redirects to `/me/profile` |
| User | `/me/progress` | Progress | Resume and remove saved items work |
| User | `/progress` | Redirect | Redirects to `/me/progress` |
| User | `/notifications` | Notifications | Notification variants render and actions work |
| Admin | `/admin` | Dashboard | Metrics, activity, and workflow links work |
| Admin | `/admin/tutorials` | Tutorial list | Search, filters, publish, feature, editor pick, delete work |
| Admin | `/admin/tutorials/new` | Tutorial editor | Create draft, steps, preview, publish work |
| Admin | `/admin/tutorials/:id/edit` | Tutorial editor | Edit existing tutorial and persist changes |
| Admin | `/admin/tutorials/:id/steps/:stepId` | Step editor state | Specific step opens and saves |
| Admin | `/admin/tutorials/:id` | Redirect | Redirects to edit route |
| Admin | `/admin/taxonomy` | Taxonomy | Categories and tags CRUD work |
| Admin | `/admin/media` | Media | Upload, search, copy URL, delete work |
| Admin | `/admin/users` | Users | Search, invite, role updates work |
| Admin | `/admin/audit-log` | Audit log | Filter and event detail work |
| Admin | `/admin/audit` | Redirect | Redirects to `/admin/audit-log` |

## Exit Criteria

Do not declare this test plan complete until all items are true:

- `git status --short` is clean before release verification starts.
- Backend solution builds in Release configuration.
- Frontend builds in production configuration.
- All backend unit and integration tests pass.
- All frontend component tests pass.
- All Playwright projects pass.
- All visual screenshots are either pixel-matched or approved with documented reason.
- All direct SQL verification queries pass.
- Every expected dialog opens, traps focus, performs its primary and cancel actions, and closes.
- Every destructive action requires confirmation and is verified in the database.
- Every route has no console errors, failed network calls, missing fonts, missing icons, or layout overflow.
- Source audit confirms no production code contains unresolved fake, temp, mock, stub, placeholder, or unimplemented behavior.
- Final evidence is archived.

