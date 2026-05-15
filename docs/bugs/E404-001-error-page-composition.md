# E404-001 - Error Page Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/error-404.md`
- **Route:** `/this-route-does-not-exist`
- **Skeleton:** `docs/skeletons/error-404.html`
- **Section:** Public nav, centered 404 block, dynamic path, recovery CTAs, marquee

## Expected

Unmatched routes render the skeleton 404 surface: shared public nav with no active link, bare centered 404 block, `404 / not found` headline with only `found` italic orange, mono path readout bound to the current pathname, Browse tutorials/Home CTAs, 10-item marquee, and no footer.

## Actual

The running top-level wildcard rendered a library empty-state with different wording, no public nav shell, no giant display treatment, no dynamic path readout, different CTA ordering/copy, no marquee, and no skeleton spacing.

## Fix

Replaced `error-page` with the audited standalone public-nav wrapper, centered error stage, dynamic pathname readout, Browse tutorials/Home CTAs, and 10-item marquee. The page remains top-level so admin routes can continue to route through the admin shell.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- DOM/responsive check: public auth/error Playwright assertions passed.
- Desktop screenshot: `docs/ui-audit/screenshots/error-404/error-404-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/error-404/error-404-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/error-404/error-404-mobile.png`
- Note: Angular dev-server SPA fallback responds with HTTP 200 for wildcard routes; the visual route renders the audited 404 state.
- Fix commit: pending final audit commit.
