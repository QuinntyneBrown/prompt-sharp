# Prompt Sharp Comprehensive Test Plan

This document set defines the end-to-end test plan for proving the Prompt Sharp platform is complete, production-ready, and free of temporary, fake, test-only, or unimplemented behavior.

The plan covers every public, authenticated learner, and admin screen currently routed by the Angular app, every API-backed save flow, visual fidelity against the HTML skeleton mocks, icon/font/style loading, navigation, dialogs, responsive behavior, and database-level persistence checks.

## Document Map

- [00 - Strategy and Exit Criteria](./00-strategy-and-exit-criteria.md)
- [01 - Environment and Test Data](./01-environment-and-test-data.md)
- [02 - Visual, Icons, Fonts, and Mock Fidelity](./02-visual-icons-fonts-and-mock-fidelity.md)
- [03 - Public, Auth, and Learner Flows](./03-public-auth-and-learner-flows.md)
- [04 - Admin Flows](./04-admin-flows.md)
- [05 - Database Verification Matrix](./05-database-verification-matrix.md)
- [06 - Quality Gates and Signoff](./06-quality-gates-and-signoff.md)

## Scope

In scope:

- Angular app routes in `frontend/projects/promp-sharp/src/app/app.routes.ts`.
- Public discovery, tutorial reading, auth, profile, progress, and notification screens.
- Admin dashboard, tutorials, tutorial editor, taxonomy, media, users, and audit log screens.
- Public and admin dialogs.
- API behavior under `backend/src/PromptSharp.Api/Controllers`.
- SQL Server persistence through `PromptSharpDbContext`.
- Visual and responsive fidelity against `docs/skeletons/*.html`.
- Source audit for placeholder, mock, fake, temporary, or unimplemented code.

Out of scope:

- External OAuth provider availability beyond mocked or configured redirect contract checks.
- Third-party browser extension interference.
- Production infrastructure concerns that cannot be exercised locally or in CI, except for configuration and deployment-readiness checks listed in the signoff document.

## Confidence Standard

This plan is complete only when:

- Every routed screen is loaded in desktop and mobile Playwright projects.
- Every navigation target, button, link, filter, tab, dialog, destructive confirmation, upload, and form has been exercised.
- Every mutation is verified through API response and direct SQL database assertion.
- Visual snapshots are reviewed against the skeleton mock for the same screen.
- Icons render as visible vector/icon glyphs, not fallback text or missing boxes.
- Fonts and design tokens are loaded and applied.
- No known `TODO`, `FIXME`, placeholder, fake, mock, stub, temp, dummy, or unimplemented behavior remains in production source.
- The final test evidence package contains automated reports, screenshots, traces for any fixed failures, DB verification output, and a signed release checklist.

