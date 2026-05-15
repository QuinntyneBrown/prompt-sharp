# SIGNOUT-001 - Sign Out Dialog Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/protected/signout-dialog.md`
- **Trigger:** `/profile` sign out action
- **Skeleton:** `docs/skeletons/signout-dialog.html`
- **Section:** Pattern A sign-out confirmation dialog

## Expected

The sign-out confirmation renders with the audited dialog copy, supporting text, action order, signed-in shell context, and responsive sizing from the skeleton.

## Actual

The running Angular sign-out dialog did not match the skeleton copy and supporting-text treatment.

## Fix

Updated `sign-out-dialog` content and ensured the signed-in profile route can present the audited sign-out state.

## Evidence

- Build: `npx ng build components --configuration development` passed.
- Build: `npx ng build domain --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/signout-dialog/signout-dialog-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/signout-dialog/signout-dialog-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/signout-dialog/signout-dialog-mobile.png`
- Fix commit: `7f6a37d`
