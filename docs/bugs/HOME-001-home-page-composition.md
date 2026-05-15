# HOME-001 — Home Page Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/home.md`
- **Route:** `/`
- **Skeleton:** `docs/skeletons/home.html`
- **Section:** Full page composition, public nav, hero, marquee, featured tutorials, category grid, latest list, footer

## Expected

The live home route renders the audit composition in DOM order: sticky public navigation, full hero, scrolling stack marquee, featured tutorial grid, browse-by-category matrix, latest tutorials list with sidebar filters, and the public footer. Styling follows the skeleton typography, orange accent states, rule borders, shimmer placeholders, responsive breakpoints, and footer wordmark.

## Actual

The running Angular page rendered a sparse implementation: simple heading, API tutorial/category lists, a basic nav with only Catalog/About, and a minimal footer. The skeleton sections were missing or incomplete, so the page failed the visual and DOM-order checks.

## Fix

Updated the public shell, navigation, footer, global audit styling primitives, and `frontend/projects/domain/src/lib/public/home-page/home-page.html` so the route renders the audited home composition. Rebuilt `api`, `components`, `domain`, and the app, then restarted the frontend dev server on `http://127.0.0.1:4200/`.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/home/home-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/home/home-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/home/home-mobile.png`
- Fix commit: pending final audit commit.
