# ADMIN-UNSAVED-001 - Unsaved Changes Dialog Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/protected/admin-unsaved-changes-dialog.md`
- **Trigger:** `/admin/tutorials/new?auditDialog=unsaved`
- **Skeleton:** `docs/skeletons/admin-unsaved-changes-dialog.html`
- **Section:** Pattern B unsaved changes dialog

## Expected

The unsaved changes dialog uses the Pattern B dialog shell, explanatory body copy, keep-editing and discard actions, destructive action styling, and responsive sizing from the skeleton.

## Actual

The running Angular unsaved changes dialog did not match the skeleton content or action presentation and lacked an audit trigger state.

## Fix

Updated `unsaved-changes-dialog` markup/styles and the tutorial editor audit query hook so the dialog opens in the audited state.

## Evidence

- Build: `npx ng build components --configuration development` passed.
- Build: `npx ng build domain --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/admin-unsaved-changes-dialog/admin-unsaved-changes-dialog-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/admin-unsaved-changes-dialog/admin-unsaved-changes-dialog-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/admin-unsaved-changes-dialog/admin-unsaved-changes-dialog-mobile.png`
- Fix commit: `7f6a37d`
