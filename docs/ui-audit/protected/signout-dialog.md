# Sign-out Dialog — UI Audit

- **Trigger:** As any signed-in user (public site visit), click the **avatar** in the top-right of the public nav → **Sign out** menu item. The dialog confirms the destructive-but-recoverable action. (Note: from the admin shell, signing out goes through the admin nav rail's `logout` item; this same dialog component is reused.)
- **Skeleton:** [`docs/skeletons/signout-dialog.html`](../../skeletons/signout-dialog.html)
- **Pattern:** Pattern B dialog (M3 `md-dialog`) **over a Pattern A backdrop** (the public home page with the `ps-public-nav` + radial-gradient backdrop). This is the only dialog in the system that validates Pattern B chrome rendering correctly on top of Pattern A typography.
- **Bug log:** [`bugs/signout-dialog.md`](../../bugs/signout-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/auth/signout-dialog` (create — used by both `public-nav` user menu and admin nav rail logout)

---

## How to run this audit

1. Start API + frontend, sign in.
2. From the public home page (`http://localhost:4200/`), click the avatar in the top-right of the nav → **Sign out**.
3. Open `docs/skeletons/signout-dialog.html` in a second tab.
4. Audit at 1440 / 1100 / 720 / 600 px.
5. Verify the dialog chrome (Pattern B / Material 3) renders correctly when the backdrop uses Pattern A's Mona Sans display headline + radial gradient — no color clash, scrim covers the orange glow.
6. Repeat the audit from the admin shell: open `/admin/dashboard`, click nav-rail **Sign out** — same dialog should appear, this time over the admin Pattern B chrome.
7. Log gaps in [`bugs/signout-dialog.md`](../../bugs/signout-dialog.md) using prefix `SIGNOUT-DLG-`.

---

## Composition (skeleton lines 308-330)

```
<ps-signout-dialog>
  ├─ <ps-public-nav>             (backdrop — Pattern A sticky nav with brand wordmark + links + Sign in btn)
  ├─ <ps-public-backdrop>        (backdrop — radial gradient + Pattern A display headline + sk-tile)
  │     └─ .home-teaser
  │           ├─ <h1>Build apps with Microsoft. <em>Step</em> by <em>step.</em></h1>
  │           └─ <sk-tile></sk-tile>
  └─ <md-dialog class="flow-dialog" open data-auto-open>
        ├─ slot="headline"  → "Sign out of Prompt/Sharp?"
        ├─ slot="content"   → <form .dialog-form>
        │     └─ <p>Your saved progress stays attached to this account.</p>
        └─ slot="actions"   → md-text-button Cancel + md-filled-button Sign out
```

**Cross-pattern note:** the backdrop here is Pattern A (`ps-public-nav` + `ps-public-backdrop` — Mona Sans, radial gradients, no Material 3 admin shell). The dialog itself is Pattern B (`md-dialog` with Roboto Flex inside). The scrim must visually unify the two patterns — the M3 black scrim covers the entire viewport including the Pattern A nav.

---

## 1. Dialog chrome

Inherits Pattern B. Base 560 px width (no `wide-dialog` modifier — this is a small, decisive dialog).

- **Selector:** `md-dialog.flow-dialog`.
- **Max-width:** `560px`. **Shape:** `20px`. **Container color:** `#161C2C`.
- **Auto-open:** `data-auto-open` triggers `dialog.show()` once `md-dialog` is upgraded.
- **Dismissable:** Esc + scrim + Cancel all close (default M3). No modal trap — `Sign out` should remain reversible up to the final click.

### Checks
- [ ] Container 560 px max-width, 24 px gutter on narrow viewports.
- [ ] Same `#161C2C` container color and 20 px radius as other Pattern B dialogs (verify it doesn't accidentally pick up Pattern A's tokens via cascading).
- [ ] Scrim covers the entire viewport — including the Pattern A sticky nav at the top (which has `position: sticky; z-index` lower than the dialog). Confirm the nav's `backdrop-filter: blur(14px) saturate(160%)` does not show *through* the scrim.

---

## 2. `slot="headline"`

- **Exact text (verbatim):** `Sign out of Prompt/Sharp?` (question mark, ASCII `?`, single space before).
- The literal text contains the brand `Prompt/Sharp` but **without** the wordmark styling — the slash is a plain `/` character because dialog headlines render through M3 typography, not the Pattern A foot-mark treatment. (See the memory note: the canonical foot-mark wordmark is reserved for the home page and footer, not body copy.)
- Plain `<div slot="headline">`, no icon, no inner wrapper.

### Checks
- [ ] Headline reads exactly `Sign out of Prompt/Sharp?` — slash is plain, no italic-orange treatment, no `<em>` wrapper.
- [ ] Question mark is ASCII `?`.
- [ ] Font is Roboto Flex (Pattern B headline), 24 px, weight 400 (M3 default).

---

## 3. `slot="content"`

`<form slot="content" method="dialog" class="dialog-form">` — grid, `gap: 16px`.

### 3.1 Reassurance paragraph
- `<p>Your saved progress stays attached to this account.</p>` — **verbatim**.
- Single line at typical viewport widths. Color: `var(--md-sys-color-on-surface-variant)` (`#C5CDE4`).
- No icon, no mono caption, no diff block — this is a small dialog intentionally; the entire body is one reassuring sentence.

### Checks
- [ ] Body has exactly one child: the paragraph.
- [ ] Verbatim text: `Your saved progress stays attached to this account.` (trailing period).
- [ ] No additional confirmation prompts (no "Type SIGNOUT to confirm" or similar — Sign out is light enough that a single confirmation is sufficient).

---

## 4. `slot="actions"`

- **Cancel** — `<md-text-button>Cancel</md-text-button>`.
- **Sign out** — `<md-filled-button>Sign out</md-filled-button>`. **Default primary color** (orange) — not `.danger-button` red. Pattern B reserves the danger-button red strictly for *irreversible* destructive actions (delete row, drop record). Sign out is fully reversible (the user can sign back in) and should therefore use the standard primary affordance.

### Checks
- [ ] Two buttons right-aligned, Cancel (text) then Sign out (filled).
- [ ] Sign out button background is the M3 primary container orange `#FF9800`, label `#00000F` — **not** the error red `#93000A` used by Delete.
- [ ] Sign out label is exactly `Sign out` (two words, sentence case) — not `Log out`, not `Sign me out`.
- [ ] After clicking Sign out: the live component clears tokens, navigates to `/` (home), and shows a snackbar `Signed out` (Pattern A snackbar — out of scope for this dialog but should not regress).

---

## 5. Backdrop behavior

Two backdrop scenarios — the dialog must validate correctly against both.

### 5.1 Public backdrop (skeleton: `ps-public-nav` + `ps-public-backdrop`)
- Top: Pattern A sticky nav with brand wordmark `Prompt/Sharp` (Mona Sans wdth 82 / wght 700, slash italic-orange), three links (`Tutorials` active, `Categories`, `About`), and a `Sign in` text button on the right.
- Below: full-bleed `ps-public-backdrop` with radial gradient (900 × 500 px orange glow at top-right) over `--md-sys-color-surface` (`#00000F`).
- Inside: `.home-teaser` card (1 px outline-variant border, surface-container-high background, 34 px padding) containing the Pattern A display headline `Build apps with Microsoft. <em>Step</em> by <em>step.</em>` (Mona Sans wdth 75 / wght 600, `clamp(48px, 8vw, 104px)`, line-height 0.92, em styled italic orange wdth 85 / wght 500) and an `<sk-tile>` shimmer.
- `ps-public-backdrop` itself has `filter: saturate(.8)` baked in (skeleton line 292) — the backdrop is **always** slightly desaturated to keep focus on the dialog.

### 5.2 Admin backdrop (when triggered from admin nav rail)
- Topbar + nav rail + whatever admin page the user was on (typically `/admin/dashboard`).
- M3 default scrim only; no additional `.flow-underlay`.

### Checks (public backdrop)
- [ ] Pattern A nav remains visible at the top behind the scrim, with the brand wordmark still using `Mona Sans wdth 82 / wght 700` and the slash italic-orange.
- [ ] `ps-public-backdrop` shows the radial orange glow at top-right and the display headline (italic orange "Step" and "step.").
- [ ] Backdrop is `filter: saturate(.8)` — verify the orange glow reads cooler when the dialog is open.
- [ ] Dialog container `#161C2C` reads as **darker** than the surrounding `surface-container-high` (`#002A54`) used inside `.home-teaser` — never the same value.

### Checks (admin backdrop)
- [ ] Admin topbar + nav rail (Pattern B) render unfiltered behind the scrim.
- [ ] Whatever admin page was current remains mounted (no remount on dialog open).

---

## 6. Responsive

- Inherits Pattern B responsive rules. ≤ 600 px goes full-screen edge-to-edge per [`admin-tutorial-dialog.md §6`](./admin-tutorial-dialog.md#6-responsive).
- Body is one paragraph and never needs to scroll.

### Checks
- [ ] ≤ 600 px: full-screen, no rounded corners, two action buttons still fit on one row (the dialog is small enough).
- [ ] Public-pattern backdrop responsive rules continue to apply behind the scrim (links hidden at 720 px, etc.).

---

## 7. Bug logging procedure

Log every failure in [`bugs/signout-dialog.md`](../../bugs/signout-dialog.md) using `SIGNOUT-DLG-NNN`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Headline picks up Pattern A typography (Mona Sans) | dialog SCSS — explicitly set `font-family: 'Roboto Flex'` on the headline slot, override any inherited Mona Sans cascading from `ps-public-nav` |
| Slash inside the headline rendered italic orange | the `Prompt/Sharp` literal in the headline must not be wrapped in `<span class="slash">` — keep it as plain text |
| Sign out button red (treated as danger) | remove `.danger-button` class — Sign out is reversible, use default primary |
| Scrim doesn't cover the sticky nav | dialog must be appended to `<body>` (or a high-stacking-context portal), not nested under `ps-public-nav` |
| Pattern A backdrop loses saturation filter | `ps-public-backdrop` SCSS — `filter: saturate(.8)` must remain |
| Snackbar after sign-out missing | not in scope of this dialog — log against the auth service / public snackbar host |
| Headline copy uses `Log out` instead of `Sign out` | template — `Sign out of Prompt/Sharp?` verbatim |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/SIGNOUT-001-signout-dialog-composition.md`
- **Verification:** `npx ng build components --configuration development`; `npx ng build domain --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/signout-dialog/signout-dialog-desktop.png`; `docs/ui-audit/screenshots/signout-dialog/signout-dialog-tablet.png`; `docs/ui-audit/screenshots/signout-dialog/signout-dialog-mobile.png`
