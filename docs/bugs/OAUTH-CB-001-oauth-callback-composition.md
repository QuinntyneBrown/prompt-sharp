# OAUTH-CB-001 - OAuth Callback Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/oauth-callback.md`
- **Route:** `/auth/callback?provider=microsoft&returnUrl=/admin`
- **Skeleton:** `docs/skeletons/oauth-callback.html`
- **Section:** Public nav, centered loading panel, spinner, shimmer placeholders, provider metadata, cancel action

## Expected

The route renders a transient authentication card inside the public shell with no footer: spinner plus `AUTHENTICATING…`, `Returning to Prompt/Sharp` with the app name italic orange, a 16:10 shimmer tile, two shimmer lines, dynamic provider/return-url metadata, and a single ghost Cancel action.

## Actual

The running page showed only a basic `OAuth callback` heading and status/error text. It lacked the centered panel, spinner, shimmer placeholders, provider metadata layout, and no-footer shell treatment.

## Fix

Added no-footer shell routing for `/auth/callback`, replaced the callback template with the audited loading card, bound provider and return URL from query params, and added shared auth-card utilities for spinner, center stage, and shimmer sizing.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- DOM/responsive check: public auth/error Playwright assertions passed.
- Desktop screenshot: `docs/ui-audit/screenshots/oauth-callback/oauth-callback-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/oauth-callback/oauth-callback-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/oauth-callback/oauth-callback-mobile.png`
- Fix commit: pending final audit commit.
