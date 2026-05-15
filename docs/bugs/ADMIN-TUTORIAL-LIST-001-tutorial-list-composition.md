# ADMIN-TUTORIAL-LIST-001 - Admin Tutorial List Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/protected/admin-tutorial-list.md`
- **Route:** `/admin/tutorials`
- **Skeleton:** `docs/skeletons/admin-tutorial-list.html`
- **Section:** Full Pattern B tutorial list page and row actions

## Expected

The admin tutorial list renders the Pattern B admin shell, page header actions, filter toolbar, tutorial table, status chips, row actions, footer controls, and dialog triggers with Material Web components and responsive behavior.

## Actual

The running Angular page did not match the skeleton table layout, toolbar composition, Material controls, or audit dialog trigger states.

## Fix

Updated `admin-tutorial-list-page` markup/styles and query-string audit dialog hooks so the page and its dialog states match the skeleton audit flow.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/admin-tutorial-list/admin-tutorial-list-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/admin-tutorial-list/admin-tutorial-list-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/admin-tutorial-list/admin-tutorial-list-mobile.png`
- Fix commit: `7f6a37d`
