# ADMIN-TUTORIAL-DIALOG-001 - Admin Tutorial Dialog Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/protected/admin-tutorial-dialog.md`
- **Trigger:** `/admin/tutorials?auditDialog=tutorial`
- **Skeleton:** `docs/skeletons/admin-tutorial-dialog.html`
- **Section:** Pattern B admin tutorial create/edit dialog

## Expected

The admin tutorial dialog uses the Pattern B dialog shell, blurred scrim, Material text fields, select controls, default edit values, supporting text, toggles, validation states, and correct primary action label from the skeleton.

## Actual

The running Angular dialog did not match the skeleton chrome, prefilled edit variant, or Material field composition.

## Fix

Updated the shared dialog shell, `admin-tutorial-dialog` markup/default values, Material Web schema usage, and tutorial list audit trigger so the dialog opens in the audited state.

## Evidence

- Build: `npx ng build components --configuration development` passed.
- Build: `npx ng build domain --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/admin-tutorial-dialog/admin-tutorial-dialog-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/admin-tutorial-dialog/admin-tutorial-dialog-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/admin-tutorial-dialog/admin-tutorial-dialog-mobile.png`
- Fix commit: `7f6a37d`
