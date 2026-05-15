# 06 - Quality Gates and Signoff

## Objective

Prevent release with incomplete implementation, test-only paths, fake data dependencies, broken visuals, missing assets, or unverified persistence.

## Static Source Audit

Run source scans before final E2E execution.

Required scan targets:

- `backend/src`
- `frontend/projects`
- `e2e`
- `docs`

Required search terms:

```powershell
rg -n "TODO|FIXME|HACK|fake|mock|stub|placeholder|temporary|temp|dummy|not implemented|NotImplementedException|throw new Error|console\.log" backend/src frontend/projects e2e docs
```

Rules:

- Findings in production source must be removed or documented with explicit approval.
- Test fixtures may use mock/fake language only when isolated to test-only files.
- Documentation may describe mocks or skeletons, but production code may not rely on them.
- `console.log` is not allowed in production frontend source.
- `NotImplementedException` is not allowed in production backend source.
- Any placeholder UI text that reaches users must be replaced with final copy.

## Build and Test Gates

Required passing commands:

```powershell
cd backend
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
npx playwright test --project=chromium
npx playwright test --project=mobile-chrome
```

## Runtime Health Gates

Verify:

- `/health/live` returns healthy.
- `/health/ready` returns healthy with SQL Server connectivity.
- OpenAPI document is reachable at `/openapi/v1.json`.
- API CORS configuration allows the frontend origin and rejects unexpected origins.
- Authenticated API calls include bearer token.
- Anonymous API calls cannot access protected admin or user endpoints.
- Rate-limited endpoints return expected status under controlled load.
- Static media files are served from `/media`.

## Browser Quality Gates

For every route:

- No uncaught browser exceptions.
- No failed network requests except intentionally tested failures.
- No 404 assets.
- No missing fonts.
- No missing icons.
- No blank pages.
- No clipped primary content.
- No overlapping text or controls.
- No inaccessible modal focus trap.
- No keyboard dead ends.
- No unexpected horizontal page scroll.

## Accessibility Gates

Minimum requirements:

- Every page has one clear primary heading.
- Landmarks are present for header, nav, main, and footer where applicable.
- Buttons and links have accessible names.
- Form fields have labels and validation messages.
- Dialogs have accessible names and focus management.
- Keyboard users can complete every flow.
- Focus indicator is visible.
- Color contrast passes WCAG AA for text and essential UI.
- Decorative icons are hidden from assistive technology.
- Meaningful icons have labels.

## Security and Authorization Gates

Verify:

- Admin routes require admin role.
- Editor-only actions require editor or admin role as intended.
- Learner routes require authentication.
- Public routes do not expose admin-only data.
- Unauthorized mutations do not change database state.
- Invalid JWTs are rejected.
- Expired JWTs are rejected and UI recovers.
- Uploaded SVG files are sanitized.
- File upload size/type restrictions are enforced.
- API validation errors do not leak stack traces.

## Data Integrity Gates

Verify:

- Tutorial slugs are unique.
- Category and tag slugs are unique.
- Required tutorial metadata cannot be blank.
- Tutorial steps keep deterministic order.
- Deleting taxonomy referenced by tutorials is blocked or handled intentionally.
- Deleting media referenced by tutorials is blocked or handled intentionally.
- User role changes cannot remove the last admin unless a deliberate recovery path exists.
- Audit events are written for admin mutations.

## Release Evidence Package

Archive:

- Backend test output.
- Frontend test output.
- Playwright HTML report.
- Visual baseline and diff report.
- Database verification report.
- Source audit output.
- Accessibility report.
- Manual exploratory notes.
- Approved visual differences.
- Final git commit hash.

## Manual Exploratory Pass

After automated tests pass, a human tester must perform one uninterrupted click-around pass:

1. Start anonymous on home.
2. Navigate through catalog, category, tag, search, tutorial detail, about, contact, and 404.
3. Sign in.
4. Complete tutorial progress and bookmark flows.
5. Visit profile and progress.
6. Enter admin.
7. Use every admin nav item.
8. Open every dialog.
9. Save, cancel, delete, upload, filter, search, paginate, and navigate through every admin area.
10. Refresh several screens mid-flow.
11. Use browser back and forward.
12. Repeat the highest-risk flows on mobile viewport.

Record every issue, even if minor. The release cannot proceed while any issue leaves a user-facing flow incomplete.

## Final Signoff Checklist

| Gate | Owner | Status | Evidence link |
| --- | --- | --- | --- |
| Backend build passed |  |  |  |
| Backend tests passed |  |  |  |
| Frontend build passed |  |  |  |
| Frontend tests passed |  |  |  |
| Desktop Playwright passed |  |  |  |
| Mobile Playwright passed |  |  |  |
| Visual regression approved |  |  |  |
| Icons verified |  |  |  |
| Fonts/styles verified |  |  |  |
| Public flows verified |  |  |  |
| Auth and learner flows verified |  |  |  |
| Admin flows verified |  |  |  |
| Dialog inventory verified |  |  |  |
| Database verification passed |  |  |  |
| Accessibility passed |  |  |  |
| Authorization passed |  |  |  |
| Source audit passed |  |  |  |
| No fake/temp/test-only code in production |  |  |  |
| No unresolved placeholder or unimplemented behavior |  |  |  |
| Final exploratory pass completed |  |  |  |

## Final Release Rule

The app is not considered fully verified until every checklist row is complete, every defect is closed or explicitly accepted, and the final evidence package can prove the full browser-to-database behavior of every public, learner, and admin flow.

