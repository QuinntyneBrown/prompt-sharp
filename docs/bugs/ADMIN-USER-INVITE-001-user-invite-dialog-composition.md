# ADMIN-USER-INVITE-001 - User Invite Dialog Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/protected/admin-user-invite-dialog.md`
- **Trigger:** `/admin/users` invite dialog
- **Skeleton:** `docs/skeletons/admin-user-invite-dialog.html`
- **Section:** Pattern B user invitation dialog

## Expected

The user invite dialog uses the Pattern B dialog shell, default email field, role chips, supporting text, action ordering, validation state, and responsive sizing from the skeleton.

## Actual

The running Angular invite dialog did not match the skeleton field defaults, role chip presentation, or Material dialog chrome.

## Fix

Updated `user-invite-dialog` markup/default values and Material Web schema usage so the invite dialog matches the audited state.

## Evidence

- Build: `npx ng build components --configuration development` passed.
- Build: `npx ng build domain --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/admin-user-invite-dialog/admin-user-invite-dialog-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/admin-user-invite-dialog/admin-user-invite-dialog-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/admin-user-invite-dialog/admin-user-invite-dialog-mobile.png`
- Fix commit: `7f6a37d`
