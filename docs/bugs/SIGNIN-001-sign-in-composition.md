# SIGNIN-001 - Sign-In Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/signin.md`
- **Route:** `/sign-in`
- **Skeleton:** `docs/skeletons/signin.html`
- **Section:** Minimal auth shell, centered sign-in card, form fields, legal copy, minimal foot

## Expected

The route renders the minimal sign-in shell: brand/back-link nav, vertically centered sharp-edged sign-in card, indexed username/password fields with eye toggle, remember/forgot row, full-width submit button, legal copy, and minimal copyright/link footer.

## Actual

The running page used the full public shell and a sparse OAuth/fallback form with library field/button components. It did not match the minimal auth nav, card badge, indexed field styling, footer, or exact copy.

## Fix

Added route-level minimal shell handling in `PublicShell`, replaced `sign-in-page` markup with the audited minimal auth composition, and added scoped sign-in styles for the card, fields, checkbox, password toggle, submit button, and footer.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- DOM/responsive check: public auth/error Playwright assertions passed.
- Desktop screenshot: `docs/ui-audit/screenshots/signin/signin-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/signin/signin-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/signin/signin-mobile.png`
- Fix commit: pending final audit commit.
