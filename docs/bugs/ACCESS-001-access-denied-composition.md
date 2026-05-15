# ACCESS-001 - Access Denied Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/access-denied.md`
- **Route:** `/access-denied`
- **Skeleton:** `docs/skeletons/access-denied.html`
- **Section:** Centered RBAC denial block, red display emphasis, role chip, danger CTA, marquee

## Expected

The route renders the shared public nav with no active link, no footer, a bare centered access-denied block, red italic `denied` emphasis, `Role required:` readout with a sharp orange `<kbd>` role chip, Request access danger-outline CTA, Home ghost CTA, and the 10-item marquee.

## Actual

The running page used a library empty-state component with different copy, panel styling, action order, and no skeleton marquee. The required role was not surfaced in the audited mono/kbd treatment.

## Fix

Added no-footer shell routing for `/access-denied`, replaced the empty-state component with the audited RBAC block, bound the required role from the `required` query param with a `sysadmin` fallback, scoped the red emphasis to this page, and added the shared 10-item marquee.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- DOM/responsive check: public auth/error Playwright assertions passed.
- Desktop screenshot: `docs/ui-audit/screenshots/access-denied/access-denied-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/access-denied/access-denied-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/access-denied/access-denied-mobile.png`
- Fix commit: pending final audit commit.
