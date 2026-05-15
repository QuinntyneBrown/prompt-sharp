# OAUTH-CONSENT-001 - OAuth Consent Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/oauth-consent-dialog.md`
- **Route:** `/auth/consent`
- **Skeleton:** `docs/skeletons/oauth-consent-dialog.html`
- **Section:** Public nav, centered consent panel, foot-mark, scope rows, Allow/Deny actions

## Expected

The route renders a full-page Pattern A consent screen, not a modal overlay: public nav with no active link, centered 540 px panel, 48 px Prompt/Sharp foot-mark, consent headline, signed-in email, divider, three scope rows, and Allow/Deny CTAs with Allow solid and Deny ghost.

## Actual

The running page rendered a dialog shell/modal-style implementation with different action order, different scope layout, and non-skeleton card styling. It also did not use the no-footer auth shell.

## Fix

Added no-footer shell routing for `/auth/consent`, replaced the modal composition with the full-page consent panel, rendered resolved scope descriptions in the audited label/value rows, and reused the shared Pattern A panel/foot-mark/CTA primitives.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- DOM/responsive check: public auth/error Playwright assertions passed.
- Desktop screenshot: `docs/ui-audit/screenshots/oauth-consent-dialog/oauth-consent-dialog-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/oauth-consent-dialog/oauth-consent-dialog-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/oauth-consent-dialog/oauth-consent-dialog-mobile.png`
- Fix commit: pending final audit commit.
