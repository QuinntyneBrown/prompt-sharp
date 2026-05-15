# Session Expired Dialog — UI Audit

- **Trigger:** Any authenticated API request returns `401 Unauthorized` (e.g. JWT expired or revoked while the user was idle). The HTTP interceptor catches the 401, clears local tokens, and opens this dialog. **Critically:** the dialog is **modal/non-dismissable** — the user cannot scrim-click or Esc out. The only path forward is the primary action.
- **Skeleton:** [`docs/skeletons/session-expired-dialog.html`](../../skeletons/session-expired-dialog.html)
- **Pattern:** B (chrome rules per [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md)) with a **blurred underlay** override.
- **Bug log:** [`bugs/session-expired-dialog.md`](../../bugs/session-expired-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/auth/session-expired-dialog` (create — invoked by the auth HTTP interceptor)

---

## How to run this audit

1. Start API + frontend, sign in.
2. Either: (a) wait until the JWT expires naturally, (b) revoke the token server-side via admin API, or (c) in DevTools clear the access-token cookie/local-storage entry and trigger any authenticated request (e.g. navigate to `/admin/dashboard`).
3. The next authenticated request will 401 → the dialog opens automatically over the admin Dashboard.
4. Open `docs/skeletons/session-expired-dialog.html` in a second tab to compare.
5. Audit at 1440 / 1100 / 720 / 600 px.
6. Verify the dialog **cannot** be dismissed by Esc or scrim-click — only the `Sign in again` button.
7. Log gaps in [`bugs/session-expired-dialog.md`](../../bugs/session-expired-dialog.md) using prefix `SESSION-DLG-`.

---

## Composition (skeleton lines 314-335)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             (backdrop)
  ├─ <ps-admin-nav-rail>           (backdrop — Dashboard active)
  └─ <main class="admin-main">
       └─ <ps-session-expired-dialog>
             ├─ <div class="blur-underlay">    ← blur(2px) saturate(.75) wrapper around the dashboard
             │     ├─ .page-header (breadcrumb Admin / Dashboard, h1 Dashboard, summary "Updated 2 minutes ago", action New tutorial)
             │     └─ section.grid-3 (3 KPI cards: 412 Tutorials, 23 Drafts, 128.4K Views)
             └─ <md-dialog class="flow-dialog" open data-auto-open
                            scrim-click-action=""
                            escape-key-action="">
                   ├─ slot="headline"  → "Session expired"
                   ├─ slot="content"   → <form .dialog-form>
                   │     └─ <p>Your session token has expired. Sign in again to continue editing.</p>
                   └─ slot="actions"   → md-filled-button Sign in again        (single button — no Cancel)
```

The **single distinguishing feature** of this dialog vs. every other Pattern B dialog: the underlay uses `.blur-underlay` (`filter: blur(2px) saturate(.75)`) instead of `.flow-underlay` (`saturate(.85)`). The blur signals "this is not a workflow you can abandon — your data is at risk" and visually disables interaction with the page behind.

---

## 1. Dialog chrome

Inherits Pattern B with two critical overrides on the `md-dialog` element:

- **Selector:** `md-dialog.flow-dialog`.
- **Max-width:** `560px`. **Shape:** `20px`. **Container color:** `#161C2C`.
- **`scrim-click-action=""`** — explicit empty value disables the default scrim-dismiss behavior (M3 reads `""` as "don't fire any action, don't close").
- **`escape-key-action=""`** — explicit empty value disables Esc-dismiss.
- **Auto-open:** `data-auto-open`.

### Modal / non-dismissable behavior
- Once open, the dialog **cannot** be closed except by clicking `Sign in again`.
- The button navigates to `/signin?returnUrl={original}` so the user lands back on their previous page after re-authenticating.
- The live component **must** also block the back button (subscribe to `popstate` and push a new history entry, or set a route guard).

### Checks
- [ ] Container 560 px max-width, standard Pattern B shape and color.
- [ ] Esc key does **nothing** when the dialog is open (no close, no animation).
- [ ] Clicking the scrim does **nothing** (no close, no ripple).
- [ ] Browser back button does not close the dialog or navigate away from it.
- [ ] The dialog persists across viewport resizes without re-opening / flickering.

---

## 2. `slot="headline"`

- **Exact text:** `Session expired` (sentence case, two words). No icon, no question mark, no inner wrapper.
- M3 default headline typography (Roboto Flex 24 px, weight 400).

### Checks
- [ ] Headline reads exactly `Session expired`.
- [ ] No leading warning icon (Pattern B intentionally avoids icon scaffolding in headlines).

---

## 3. `slot="content"`

`<form slot="content" method="dialog" class="dialog-form">` — grid, `gap: 16px`.

### 3.1 Explanatory paragraph
- `<p>Your session token has expired. Sign in again to continue editing.</p>` — **verbatim**.
- Two sentences in a single paragraph: cause then next-step.
- Color: `var(--md-sys-color-on-surface-variant)` (`#C5CDE4`).

### Checks
- [ ] Body has exactly one child: the paragraph.
- [ ] Verbatim text: `Your session token has expired. Sign in again to continue editing.` — two periods, single space after the first.
- [ ] No banner, no diff block, no icon — keep it minimal and unambiguous.
- [ ] No "Why?" link or "Keep me signed in" checkbox (those belong on the Sign-in page, not here).

---

## 4. `slot="actions"`

**Single button** — this is the only Pattern B dialog in the system with one action.

- **Sign in again** — `<md-filled-button>Sign in again</md-filled-button>`. Default primary color (orange). On click: navigate to `/signin?returnUrl={location.pathname}{location.search}`.
- **No Cancel button.** No text-button alternative. The user must either sign in again or close the tab.

### Checks
- [ ] Exactly **one** button in the actions slot.
- [ ] Button is a filled-button (not text-button, not danger-button).
- [ ] Label is exactly `Sign in again` — three words, sentence case. Not `Sign in`, not `Re-authenticate`, not `Continue`.
- [ ] The button is right-aligned (M3 default).
- [ ] After click: the route changes to `/signin` with the previous URL preserved as `returnUrl`.

---

## 5. Backdrop behavior

- `.blur-underlay` wraps the admin dashboard content (`filter: blur(2px) saturate(.75)` — skeleton line 236).
- Topbar + nav rail render unfiltered.
- Dashboard page-header (breadcrumb `Admin / Dashboard`, h1 `Dashboard`, summary `Updated 2 minutes ago`, action `New tutorial`) and the 3 KPI cards (`412 Tutorials`, `23 Drafts`, `128.4K Views`) are all visible **but blurred**.
- Scrim: M3 default black scrim on top of the blur — so the underlay is dimmed *and* defocused.

### Checks
- [ ] Underlay is **blurred 2 px** (not just desaturated like the other Pattern B dialogs).
- [ ] Saturation is 75% (more aggressive than `.flow-underlay`'s 85%) — signals higher gravity.
- [ ] Topbar and nav rail are **not** blurred (they sit outside `.blur-underlay`).
- [ ] No content behind the dialog is interactive (verify by trying to click a KPI card through the scrim — the dialog must trap pointer events).

---

## 6. Responsive

Inherits Pattern B. ≤ 600 px goes full-screen edge-to-edge. The single primary button remains at the bottom (no stacking required because there's only one button).

### Checks
- [ ] ≤ 600 px: full-screen, no rounded corners.
- [ ] Single action button takes full width inside the actions slot on mobile (M3 fullscreen convention).
- [ ] Underlay blur remains 2 px at all viewport widths (do not increase on mobile — the dashboard cards are already smaller and would become unreadable).

---

## 7. Bug logging procedure

Log every failure in [`bugs/session-expired-dialog.md`](../../bugs/session-expired-dialog.md) using `SESSION-DLG-NNN`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Esc closes the dialog | dialog template — add `escape-key-action=""` attribute |
| Scrim-click closes the dialog | dialog template — add `scrim-click-action=""` attribute |
| Backdrop only desaturated, not blurred | apply `.blur-underlay` wrapper (`filter: blur(2px) saturate(.75)`) instead of `.flow-underlay` |
| Topbar / nav rail blurred too | move `.blur-underlay` to wrap only the admin page content, not the shell |
| Sign in again button doesn't preserve returnUrl | route handler — `router.navigate(['/signin'], { queryParams: { returnUrl: state.url } })` |
| Browser back button escapes the dialog | push a no-op history state on open + listen for `popstate` to re-push |
| Dialog flashes / re-opens on resize | open it from the auth interceptor's RxJS subject once, not in a component lifecycle hook |
| Two buttons rendered (Cancel + Sign in again) | template — only one `<md-filled-button>`, no Cancel |
| Label says `Sign in` (missing "again") | template — `Sign in again` verbatim |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/SESSION-001-session-expired-dialog-composition.md`
- **Verification:** `npx ng build components --configuration development`; `npx ng build domain --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/session-expired-dialog/session-expired-dialog-desktop.png`; `docs/ui-audit/screenshots/session-expired-dialog/session-expired-dialog-tablet.png`; `docs/ui-audit/screenshots/session-expired-dialog/session-expired-dialog-mobile.png`
