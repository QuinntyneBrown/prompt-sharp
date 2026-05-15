# SESSION-001 - Session Expired Dialog Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/protected/session-expired-dialog.md`
- **Trigger:** `/sign-in?reason=expired`
- **Skeleton:** `docs/skeletons/session-expired-dialog.html`
- **Section:** Pattern B session expired dialog

## Expected

The expired-session state renders the modal Pattern B session dialog with blurred underlay, non-dismissable recovery copy, primary sign-in action, and responsive sizing from the skeleton.

## Actual

The running Angular sign-in route did not expose the audited session-expired dialog state and the dialog copy/chrome did not fully match the skeleton.

## Fix

Restored the session-expired dialog mount on `sign-in-page` and updated `session-expired-dialog` copy through the shared dialog shell.

## Evidence

- Build: `npx ng build components --configuration development` passed.
- Build: `npx ng build domain --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/session-expired-dialog/session-expired-dialog-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/session-expired-dialog/session-expired-dialog-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/session-expired-dialog/session-expired-dialog-mobile.png`
- Fix commit: `7f6a37d`
