# Notifications Gallery — UI Audit

- **Route:** `/admin/notifications`
- **Skeleton:** [`docs/skeletons/notifications.html`](../../skeletons/notifications.html)
- **Pattern:** B (Material 3 admin chrome) — **gallery page**, not a single screen. The page documents the snackbar + banner contract used app-wide.
- **Bug log:** [`bugs/notifications.md`](../../bugs/notifications.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/notifications-gallery-page`
- **Chrome reference:** [`admin-dashboard.md`](./admin-dashboard.md) sections 1 + 2 (top app bar and nav rail are lifted unchanged).

---

## How to run this audit

1. Start API + frontend:
   ```pwsh
   cd C:\projects\prompt-sharp\backend; dotnet run --project src/PromptSharp.Api
   ```
   In a second shell:
   ```pwsh
   cd C:\projects\prompt-sharp\frontend; npm start
   ```
2. Open `http://localhost:4200/signin`, authenticate with an account that has the **Admin** role, then navigate to `http://localhost:4200/admin/notifications`.
3. Open `docs/skeletons/notifications.html` directly in a second tab (file:// is fine — pulls Google Fonts + `@material/web` via the importmap). The skeleton auto-opens every `md-snackbar[open]` on first paint via `requestAnimationFrame`.
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px. Pattern B breakpoints are **1100px** and **720px** in this skeleton.
5. Walk the checks below in DOM order. Log every gap in [`bugs/notifications.md`](../../bugs/notifications.md) using ID prefix `NOTIF-`.

> **Why a gallery?** This page is the visual contract for every transient notification (snackbar) and persistent system banner the app emits. The live page should render every variant side-by-side so designers and engineers can confirm the contract by eyeballing — and so QA can screenshot-diff.

---

## Composition (DOM order, from `notifications.html:264-332`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>                        ← see admin-dashboard.md §1
  ├─ <div class="admin-layout">
  │   ├─ <ps-admin-nav-rail>                  ← see admin-dashboard.md §2 (Dashboard = active in skeleton)
  │   └─ <main class="admin-main">
  │       └─ <ps-notifications-gallery>
  │           ├─ <header class="page-header">
  │           ├─ <section class="block-stack">    ← two system-wide banners
  │           └─ <section class="snackbar-sheet"> ← 12 snackbar variants (3-col grid)
```

Live counterpart should be `frontend/projects/domain/src/lib/admin/notifications-gallery-page/notifications-gallery-page.html`. Verify every variant from the skeleton is rendered, not just stubbed.

---

## 1. `<ps-admin-topbar>` + `<ps-admin-nav-rail>` — Admin chrome

Lifted unchanged from `admin-dashboard.html`. See [`admin-dashboard.md` §1](./admin-dashboard.md#1-ps-admin-topbar--top-app-bar-material-3-center-aligned-variant) and [§2](./admin-dashboard.md#2-ps-admin-nav-rail--navigation-drawer-material-3-standard-drawer) for the full chrome audit.

### Differences from dashboard

- In the skeleton's static markup, `Dashboard` is marked `active` (`notifications.html:283-285`). For the live route `/admin/notifications`, **none of the existing nav items should be active**, OR an additional `Audit log` / `Notifications` nav item should be added with `manage_search` icon (the skeleton lists this item at line 302 but the dashboard render omits it).
- Verify the live admin app exposes notifications as a settings-level page or extends the Manage group; coordinate with whichever decision the live nav rail makes.

### Checks (chrome-specific to this page)

- [ ] Top app bar markup, sizing, and behaviour matches `admin-dashboard.md §1`.
- [ ] Nav rail markup, sizing, and behaviour matches `admin-dashboard.md §2`.
- [ ] If the live app surfaces a `Notifications` nav item, it carries the `notifications` Material Symbols glyph and shows in the Manage group.
- [ ] Breadcrumb (see §3) reflects `Admin / Notifications`.

---

## 2. `<main class="admin-main">` — Main content surface

Same chrome as dashboard. Padding `32px 40px 96px`, max-width `1480px`. See `admin-dashboard.md §3`.

---

## 3. `<header class="page-header">` — Page title row

Source: `notifications.html:316-323`

### Layout
- Flex row, `align-items: flex-end`, `justify-content: space-between`, gap 24 px, `margin-bottom: 28px`, flex-wrap.

### Left column
1. **`.breadcrumb`** — 13 px on-surface-variant, inline-flex gap 6 px. Contents in order:
   - `<span>Admin</span>`
   - `<span>/</span>`
   - `<span class="current">Notifications</span>` — color on-surface, weight 500.
2. **`<h1>`:** Roboto Flex weight 400, **36px**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`. Text: `Notification contract`.
3. **`.summary`** — 14 px on-surface-variant, flex row gap 14 px, flex-wrap. Single span: `Snackbars and banners gallery`.

### Right column (`.actions`)
- Empty (`<div class="actions"></div>`). No buttons on this page — verify nothing accidentally gets rendered here.

### Checks
- [ ] Breadcrumb reads exactly: `Admin / Notifications` (with `Notifications` as `.current`).
- [ ] `<h1>` reads **`Notification contract`** (verbatim — note "contract", not "centre" or "settings").
- [ ] Summary line reads exactly: `Snackbars and banners gallery`.
- [ ] No buttons in the right `.actions` slot.
- [ ] At ≤600 px the header stacks (per `.page-header` responsive rule).
- [ ] **Live component:** the page has no top-right actions in this iteration. If the live app needs an "Add system banner" CTA later, it lands here.

---

## 4. `<section class="block-stack">` — System-wide banners (top of page)

Source: `notifications.html:324-327` (CSS at `237-241`)

### Layout
- `.block-stack` — `display: grid`, `gap: 14px` (verify; this class is also used in the wider admin SCSS as `block-stack`), `margin-bottom: 24px`.
- Two `<div class="banner">` rows.

### Banner base (`.banner`)
- `border-radius: 12px`, padding `14px 18px`, flex row gap 12 px, align items center.
- **Default variant:** background `var(--md-sys-color-secondary-container)` (`#2A3970`), color `var(--md-sys-color-on-secondary-container)` (`#D8E2FF`).
- **`.banner.warning` variant:** background `var(--md-sys-color-tertiary-container)` (`#4D3800`), color `var(--md-sys-color-on-tertiary-container)` (`#FFE0A3`).

### Banner 1 — `warning` (first in DOM)
- Class: `banner warning`.
- Leading `<md-icon>warning</md-icon>` (Material Symbols Outlined `warning`).
- Text `<span>`: `System-wide warning banner with persistent context.` (verbatim).
- Trailing `<md-text-button>Review</md-text-button>`.
- Color: gold-on-deep-amber per the tertiary container token.

### Banner 2 — `info` (second in DOM)
- Class: `banner` (no modifier).
- Leading `<md-icon>info</md-icon>`.
- Text `<span>`: `System-wide info banner for planned maintenance.` (verbatim).
- Trailing `<md-text-button>Details</md-text-button>`.
- Color: periwinkle-on-deep-blue per the secondary container token.

### Checks
- [ ] Two banners render in this order at the top of the gallery: warning first, info second.
- [ ] Banner 1 background = `#4D3800`, text = `#FFE0A3`, leading `warning` icon, trailing `Review` button.
- [ ] Banner 1 text reads exactly: `System-wide warning banner with persistent context.`
- [ ] Banner 2 background = `#2A3970`, text = `#D8E2FF`, leading `info` icon, trailing `Details` button.
- [ ] Banner 2 text reads exactly: `System-wide info banner for planned maintenance.`
- [ ] Both banners use 12 px border-radius and flex row layout with the trailing `md-text-button` right-aligned.
- [ ] Icons are real Material Symbols Outlined glyphs (not text "warning" / "info").
- [ ] At ≤720 px the banners remain a single column (no special collapse for `.block-stack`).
- [ ] **Live component:** `system-banner` atom in `components/src/lib/system-banner` with variants `info` (default) / `warning` / `error` / `success`. The variants must map onto the M3 container tokens documented above. The banner accepts a leading icon, body text, and trailing action button.

---

## 5. `<section class="snackbar-sheet">` — Snackbar gallery (3-col grid of 12 variants)

Source: `notifications.html:328-330` (CSS at `242-243`)

### Layout
- **Grid:** `repeat(3, 1fr)`, `gap: 18px`.
- Each cell is an `<article class="snack-card">` — `border-radius: 16px`, background `var(--md-sys-color-surface-container)` (`#0F1A30`), padding 16 px, `display: grid`, gap 10 px, `min-height: 160px`.

### Each cell contains
1. **`.mono` caption** — Roboto Flex 12 px, `letter-spacing: 0.04em`, color on-surface-variant. Reads the exact variant name in the form `snackbar / <severity> / <shape>` (e.g. `snackbar / success / with-action`).
2. **`<md-snackbar open label-text="...">`** — Material 3 snackbar, force-opened. May contain a slotted `<md-text-button slot="action">Undo</md-text-button>` for the `with-action` variants. Two-line variants pass a longer label.

### 12 cells (exact, in DOM order from `notifications.html:329`)

Each row of the table = one `.snack-card`. The body text uses the literal pattern from the skeleton — note that **all severities currently reuse the same body text** ("success: Tutorial saved.", "error: Tutorial saved.", "info: Tutorial saved.", "warning: Tutorial saved.") which is intentional for the contract sheet but should differ in the live app's actual emit code. Flag if the live page changes these strings; the goal is to mirror the gallery's verbatim copy.

| # | `.mono` caption | `label-text` (verbatim) | Action button? |
|---|-----------------|-------------------------|----------------|
| 1 | `snackbar / success / single-line` | `success: Tutorial saved.` | no |
| 2 | `snackbar / success / with-action` | `success: Tutorial saved.` | yes — `Undo` |
| 3 | `snackbar / success / two-line` | `success: Tutorial saved and queued for publishing review.` | yes — `Undo` |
| 4 | `snackbar / error / single-line` | `error: Tutorial saved.` | no |
| 5 | `snackbar / error / with-action` | `error: Tutorial saved.` | yes — `Undo` |
| 6 | `snackbar / error / two-line` | `error: Tutorial saved and queued for publishing review.` | yes — `Undo` |
| 7 | `snackbar / info / single-line` | `info: Tutorial saved.` | no |
| 8 | `snackbar / info / with-action` | `info: Tutorial saved.` | yes — `Undo` |
| 9 | `snackbar / info / two-line` | `info: Tutorial saved and queued for publishing review.` | yes — `Undo` |
| 10 | `snackbar / warning / single-line` | `warning: Tutorial saved.` | no |
| 11 | `snackbar / warning / with-action` | `warning: Tutorial saved.` | yes — `Undo` |
| 12 | `snackbar / warning / two-line` | `warning: Tutorial saved and queued for publishing review.` | yes — `Undo` |

> **Severity note:** the skeleton uses a single `<md-snackbar>` element for every severity — the visible severity is conveyed by the **label-text prefix** (`success:`, `error:`, `info:`, `warning:`). The Material 3 component does **not** ship distinct severity styles out of the box. The live page must add a wrapper (or use a custom snackbar atom) to colour-code by severity. See "Live component" below.

### Auto-open mechanic
- The skeleton's script (`notifications.html:388-394`) iterates every `md-dialog[data-auto-open]` and calls `.show()`. For `md-snackbar`, the `open` attribute is what activates it; the snackbars are already attribute-open so they render visible on load. The live page must do the same — show every variant statically (not on-click).

### Responsive
- **1100px:** grid → `repeat(2, 1fr)`.
- **720px:** grid → `1fr` (single column).

### Checks
- [ ] Twelve `.snack-card` cells render in the order listed above, in a 3-column grid at desktop.
- [ ] Each cell shows the exact `.mono` caption text from the table.
- [ ] Captions are 12 px Roboto Flex with 0.04em tracking, color on-surface-variant.
- [ ] Card chrome: 16 px radius, surface-container background, 16 px padding, min-height 160 px.
- [ ] Every snackbar is **visible on load** (no click required) — `open` attribute is set, or the component is force-shown after `whenDefined`.
- [ ] Each snackbar's body text exactly matches the `label-text` column above (severity prefix + body).
- [ ] `with-action` and `two-line` variants have a trailing `Undo` `md-text-button` in the action slot.
- [ ] Two-line variants render their label as two visible lines (M3 default).
- [ ] At 1100 px the grid collapses to 2 columns; at 720 px to 1 column.
- [ ] **Live component:** `ps-snackbar` atom in `components/src/lib/snackbar` should accept a `severity: 'success' | 'error' | 'info' | 'warning'` input and apply a left-accent border (or icon) per severity. Behind the scenes it wraps `<md-snackbar>`. The gallery page composes this atom; **do not** render raw `<md-snackbar>` in the page template.

---

## 6. Page-level visual checks (global)

- [ ] **Color tokens:** every M3 token (`--md-sys-color-*`) matches admin-dashboard. Identical palette.
- [ ] **Roboto Flex** loads; **Material Symbols Outlined** ligatures resolve for `warning`, `info`, plus chrome icons.
- [ ] **`@material/web/all.js`** is loaded for `md-snackbar`, `md-text-button`, `md-icon-button`, `md-icon`, `md-divider`.
- [ ] **All 12 snackbars + 2 banners render concurrently on first paint.** If they appear empty until interacted with, the live page has the wrong activation pattern — fix per §5 "Auto-open mechanic".
- [ ] **No body radial gradients** (Pattern A only).
- [ ] **Page does not auto-dismiss** the snackbars (Material default is to auto-hide after ~5 s). For a contract gallery, override `--md-snackbar-supporting-text-duration` or set `timeout-ms="-1"` so they stay visible. Verify the live page handles this.

---

## 7. Bug logging procedure

For every failed check above:

1. Open [`bugs/notifications.md`](../../bugs/notifications.md).
2. Append a new entry using the `NOTIF-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| H1 wrong text | `notifications-gallery-page.html` — set `<h1>Notification contract</h1>` |
| Banners missing or in wrong order | `notifications-gallery-page.html` — render warning banner first, then info |
| Banner colors wrong | `components/src/lib/system-banner/system-banner.scss` — apply tertiary-container for warning, secondary-container for info |
| `system-banner` atom missing | Create `components/src/lib/system-banner` with `severity` + `action` inputs |
| Snackbars not auto-visible | Apply `timeout-ms="-1"` and `open` on each snackbar in the gallery template (live emit code keeps default timeout) |
| Severity not colour-coded | Wrap `md-snackbar` in a `ps-snackbar` atom that applies a severity-coloured left-accent border |
| Grid is 1-col on desktop | Verify `.snackbar-sheet` CSS: `grid-template-columns: repeat(3, 1fr)` |
| `.mono` caption typography wrong | `components/src/lib/snackbar/snack-card.scss` — 12 px Roboto Flex, 0.04em tracking, on-surface-variant |
| `Undo` action missing on with-action / two-line variants | Slot `<md-text-button slot="action">Undo</md-text-button>` inside the snackbar element |
| Card background wrong | `.snack-card` background must be `var(--md-sys-color-surface-container)` (`#0F1A30`) |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
