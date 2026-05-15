# Admin Media — UI Audit

- **Route:** `/admin/media`
- **Skeleton:** [`docs/skeletons/admin-media.html`](../../skeletons/admin-media.html)
- **Pattern:** B (`@material/web` MD3 components + Roboto Flex / Mona Sans / Material Symbols Outlined, admin shell with sticky top app bar + 240 px left nav rail)
- **Bug log:** [`bugs/admin-media.md`](../../bugs/admin-media.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/media/admin-media-page`

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
2. Sign in via the public `/signin` page using an OAuth account that maps to a user with the `sysadmin` role (the route is gated by the admin guard — viewer/editor roles will be redirected). Once signed in, click **Media** in the admin nav rail to land on `/admin/media`.
3. To audit the selection-mode bottom bar, multi-select three media tiles (skeleton hardcodes the count `3 selected`).
4. Open `docs/skeletons/admin-media.html` directly in a second tab (file:// fine — Google Fonts + `@material/web` importmap only).
5. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px. The two-column `media-layout` (260 px filter rail / `1fr` grid) collapses to single column at 1100 px; the media grid reflows from 3 → 2 → 1 columns.
6. Walk the checks below in DOM order. Log every gap in [`bugs/admin-media.md`](../../bugs/admin-media.md) using ID prefix `MEDIA-`.

---

## Composition (DOM order, from `admin-media.html:264-335`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             ← sticky, z-index 50
  │   ├─ menu md-icon-button
  │   ├─ .brand-row  (Prompt/Sharp + Admin tag)
  │   ├─ .spacer
  │   └─ .top-actions  (Upload md-filled-button · notifications · QB avatar)
  ├─ <div class="admin-layout">    ← grid 240px / 1fr
  │   ├─ <ps-admin-nav-rail>       ← Media = active
  │   └─ <main class="admin-main">
  │       └─ <ps-admin-media>
  │           ├─ <header class="page-header">  (breadcrumb · H1 · summary · Upload)
  │           └─ <section class="media-layout">  ← grid 260px / 1fr
  │               ├─ <aside class="card pad right-rail">  ← Filter rail
  │               └─ <div class="media-grid">             ← 3-col card grid
  └─ <div class="bottom-bar">      ← fixed, selection-mode only
</ps-admin-shell>
```

Live counterpart: `admin-media-page.ts` composes `media-filter-rail`, `media-grid` (with `media-card` rows), and `media-selection-bar`.

Pattern B foundations (top bar + nav rail + MD3 `:root`) are shared — see [`admin-tutorial-editor.md`](./admin-tutorial-editor.md) sections 1 and 2 for the full breakdown; only the **active nav item**, the **page body**, and the **bottom selection bar** differ here.

---

## 1. `<ps-admin-topbar>` — Sticky top app bar

Source: `admin-media.html:266-271`

### Layout
- Identical to other admin pages: 64 px height, sticky `top: 0; z-index: 50`, `background: #0F1A30`, `border-bottom: 1px solid #3A4880`, `padding: 0 12px`, flex with `gap: 16px`.

### Right cluster — `.top-actions` (Media-specific)
- `<md-filled-button><md-icon slot="icon">upload</md-icon>Upload</md-filled-button>` — MD3 filled button, orange container, near-black label, leading `upload` icon, label `Upload`. **This duplicates the page-header Upload button intentionally** so the action is reachable on long-scrolled pages.
- `<md-icon-button aria-label="Notifications"><md-icon>notifications</md-icon></md-icon-button>`.
- `.avatar` 36 × 36 circle, content `QB`, orange container + near-black fg.

### Checks
- [ ] Top bar shows the orange `Upload` filled button in the right cluster (with leading `upload` glyph), then notifications icon-button, then the QB avatar.
- [ ] **There is no `help` icon-button** in the Media top bar (unlike Categories/Users/Audit log) — the Upload button takes its slot.
- [ ] Wordmark renders Mona Sans `wdth 82 / wght 700`, with the `/` italic orange.
- [ ] `Admin` chip is solid orange.
- [ ] At 720 px the orange `Admin` chip is hidden but the `Upload` button remains.
- [ ] **Live component:** `admin-top-bar` with the media page projecting `<md-filled-button>` into the top-actions slot.

---

## 2. `<ps-admin-nav-rail>` — Left navigation rail

Source: `admin-media.html:274-306`

Same seven-item rail as every admin screen. **Active item: `Media`** (`image` icon).

### Checks
- [ ] Active item is **Media**, with `background: #2A3970`, `color: #D8E2FF`, `font-weight: 600`, and the `image` icon in its filled variant (`'FILL' 1`).
- [ ] `Tutorials` shows the `12` orange badge.
- [ ] Items appear in this exact order: Dashboard, Tutorials (badge 12), Categories, Tags, Media (**active**), Users, Audit log.
- [ ] At 720 px the rail collapses to 72 px icon-over-label cells.
- [ ] **Live component:** `admin-nav-rail` — `routerLinkActive` on the Media link matches `/admin/media`.

---

## 3. `<header class="page-header">` — Page header

Source: `admin-media.html:311-318`

### Layout
- `display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap`.

### Breadcrumb
- `Admin` · `/` · `.current` `Media`. 13 px, ink-dim, `inline-flex`, `gap: 6px`, `margin-bottom: 8px`. `.current` color `#FBFFFF`, weight 500.

### H1
- Exact text: `Media library`.
- Roboto Flex, **36 px / weight 400**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`.

### Summary
- `font-size: 14px`, `color: #C5CDE4`, `display: flex; gap: 14px; flex-wrap: wrap`.
- Two spans:
  - `<b>286</b> assets`
  - `3 selected` (no `<b>` wrap on this span — selection count is part of the dim ink because it's the **current** selection state, not a corpus stat).

### Actions
- `<md-filled-button><md-icon slot="icon">upload</md-icon>Upload</md-filled-button>` — same as the top-bar Upload button. Tapping it opens the `admin-media-upload-dialog`.

### Responsive
- **720 px:** `flex-direction: column; align-items: flex-start` — Upload button drops below the summary.

### Checks
- [ ] Breadcrumb reads exactly `Admin / Media` with `Media` as the bold `current` segment.
- [ ] H1 text is **exactly** `Media library`.
- [ ] Summary shows `286 assets` with `286` bold (`<b>`), then `3 selected` with no bold. The `3 selected` text must bind to live selection state and disappear when the selection is empty.
- [ ] Page-header `Upload` is the same `md-filled-button` variant as the top bar, with the same leading `upload` icon and identical label `Upload`.
- [ ] Both Upload buttons open `admin-media-upload-dialog` — see `docs/skeletons/admin-media-upload-dialog.html`.
- [ ] Header wraps cleanly at 720 px.

---

## 4. `<aside class="card pad right-rail">` — Filter rail

Source: `admin-media.html:320-325`

### Layout
- Left column of `.media-layout` (`260px`).
- `.card.pad`: `padding: 20px`, `background: #0F1A30`, `border-radius: 16px`.
- `.right-rail`: `display: grid; gap: 16px` — despite the misleading class name, this rail is on the **left** of the media grid; the `.right-rail` class is a shared layout utility.

### Title
- `<h2>Filters</h2>`. **18 px / weight 500**, `margin: 0`, color `#FBFFFF`.

### 4.1 Type chip set
- `<md-chip-set>` with three `<md-filter-chip>`:
  - `label="Images"` `selected`
  - `label="SVG"`
  - `label="Video"`
- Chips behave as multi-select (filter-chips, not assist-chips). Selected state: container `#2A3970`, label `#D8E2FF`, leading `check` icon.

### 4.2 `Used in` field
- `<md-outlined-text-field label="Used in"></md-outlined-text-field>` — empty value, no helper text. In production this should be an autocomplete / typeahead against tutorial titles.

### 4.3 `Uploader` field
- `<md-outlined-text-field label="Uploader"></md-outlined-text-field>` — empty value. Autocomplete against user names.

### Material Web components
- `md-chip-set`, `md-filter-chip`, `md-outlined-text-field`.

### Colors
- Card bg: `--md-sys-color-surface-container` (`#0F1A30`).
- Selected chip container: `--md-sys-color-secondary-container` (`#2A3970`).
- Unselected chip outline: `--md-sys-color-outline` (`#6B7AAF`).
- Text-field outline: `--md-sys-color-outline-variant` (`#3A4880`) when unfocused, `--md-sys-color-primary` (`#FF9800`) when focused.

### Responsive
- **1100 px:** `.media-layout` collapses to a single column — the filter rail stacks above the grid.
- **720 px:** unchanged from 1100 px.

### Checks
- [ ] Title text reads exactly `Filters`.
- [ ] Three type chips in this order: `Images` (selected), `SVG`, `Video`. Selected chip has a leading `check` icon.
- [ ] `Used in` and `Uploader` are MD3 outlined text fields with empty values and label-only state (label floats inside the outline at rest).
- [ ] Filter rail is **not** a sticky sidebar — it scrolls with the page.
- [ ] At 1100 px the filter rail moves **above** the media grid in the stacked layout.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/media/media-filter-rail`. Confirm it emits a structured filter event combining the selected chip types plus the two text-field values.

---

## 5. `<div class="media-grid">` — Media card grid

Source: `admin-media.html:326-328`

### Layout
- Right column of `.media-layout` (`1fr`).
- `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px`.

### Cards — nine `<article class="media-card">` items (verbatim filenames + captions)

| # | Filename | Caption (mono) |
|---|---|---|
| 1 | `promptsharp-diagram-1.png` | `120 KB · 1920×1080` |
| 2 | `promptsharp-diagram-2.png` | `138 KB · 1600×900` |
| 3 | `promptsharp-diagram-3.png` | `156 KB · 1920×1080` |
| 4 | `promptsharp-diagram-4.png` | `174 KB · 1600×900` |
| 5 | `promptsharp-diagram-5.png` | `192 KB · 1920×1080` |
| 6 | `promptsharp-diagram-6.png` | `210 KB · 1600×900` |
| 7 | `promptsharp-diagram-7.png` | `228 KB · 1920×1080` |
| 8 | `promptsharp-diagram-8.png` | `246 KB · 1600×900` |
| 9 | `promptsharp-diagram-9.png` | `264 KB · 1920×1080` |

In the skeleton HTML the captions use `&middot;` for the separator dot and `&times;` for the dimension cross — both render as `·` (U+00B7) and `×` (U+00D7) respectively. The Angular component should output those exact glyphs (or their named HTML entities) — **not** an ASCII `*` or `x`.

### Card structure
- `.media-card`: `background: var(--md-sys-color-surface-container)` (`#0F1A30`), `border-radius: 16px`, `overflow: hidden` (corners clip the thumbnail).
- Two children:
  - `<sk-tile>` — 16:10 shimmer placeholder until the thumbnail loads. In production this is an `<img>` (or `<picture>`) with a `loading="lazy"` and the same 16:10 ratio enforced via CSS.
  - `.body`: `padding: 14px 16px 18px; display: grid; gap: 6px`.
    - `<strong>` — filename, default 14 px / weight 700 ink (`#FBFFFF`). No truncation in the skeleton, but in production filenames should `text-overflow: ellipsis` if they overflow.
    - `<span class="mono">` — caption, Roboto Flex 12 px, `letter-spacing: 0.04em`, `color: #C5CDE4`. Format: `{size} · {width}×{height}`.

### Selection state (not rendered in skeleton)
- The page-header summary shows `3 selected`, implying three of these cards are in a selected state. The skeleton does **not** annotate which three nor visualize the selection — the live component must paint a `selected` state via a 2 px primary-color outline + a checked `md-checkbox` overlay (typical M3 pattern).

### Responsive
- **1100 px:** grid becomes `repeat(2, 1fr)` (2-col).
- **720 px:** grid becomes `1fr` (1-col), stacked vertically.

### Checks
- [ ] Grid is exactly 3 columns at desktop with `gap: 16px`.
- [ ] Nine cards rendered in the exact filename order `promptsharp-diagram-1.png` → `promptsharp-diagram-9.png`. Filenames are case-sensitive lowercase with the `.png` extension.
- [ ] Each card has a 16:10 thumbnail (shimmer in the skeleton — real image in production) clipped by the card's 16 px radius.
- [ ] Each card body shows the filename in `<strong>` followed by the size + dimensions caption in `.mono`.
- [ ] Captions use the `·` (middle dot) and `×` (multiplication sign) glyphs — not `*` or `x`.
- [ ] Size and dimension data come from the asset's metadata, not hardcoded.
- [ ] Selected cards (when in selection mode) show a 2 px `--md-sys-color-primary` outline and a checked `md-checkbox` in the top-left corner.
- [ ] At 1100 px the grid reflows to 2 columns; at 720 px to 1 column.
- [ ] Clicking a card toggles selection (and emits selection events to the page); shift-clicking should range-select.
- [ ] **Live components:** `frontend/projects/domain/src/lib/admin/media/media-grid` (the container) composed of `media-card` rows. `media-card` accepts `{ filename, sizeBytes, width, height, thumbnailUrl, selected }` inputs.

---

## 6. `<div class="bottom-bar">` — Selection-mode bottom action bar

Source: `admin-media.html:334`

### Layout
- `position: fixed; left: calc(var(--rail-w) + 32px); right: 32px; bottom: 24px; z-index: 45`.
- Resolves to `left: 272px; right: 32px; bottom: 24px` at desktop. The 240 px nav rail offset + 32 px gutter means the bar is inset from the nav rail's right edge.
- `display: flex; justify-content: space-between; align-items: center; gap: 16px`.
- `background: var(--md-sys-color-inverse-surface)` = `#FBFFFF` (inverted — bright surface).
- `color: var(--md-sys-color-inverse-on-surface)` = `#00000F` (dark text on the bright surface).
- `padding: 12px 16px; border-radius: 16px`.

### Content
- Left: `<span>3 items selected</span>` — selection count text. Roboto Flex default size (14 px), weight 400, dark text on bright surface.
- Right: `<div>` containing three buttons in this order:
  - `<md-text-button>Download</md-text-button>`
  - `<md-text-button>Move</md-text-button>`
  - `<md-filled-button>Delete</md-filled-button>`

### Material Web components
- `md-text-button`, `md-filled-button`.

### Colors
- Bar bg: `--md-sys-color-inverse-surface` (`#FBFFFF`).
- Text + text-button labels: `--md-sys-color-inverse-on-surface` (`#00000F`).
- `Delete` filled button: default orange container (not error-red in the skeleton — verify whether the live app upgrades the Delete to the `danger-button` variant or keeps the orange primary).

### Visibility
- The bottom bar appears **only when selection count > 0**. When zero items are selected, the bar must be removed from the DOM (not just visibility-hidden) so screen readers don't announce it.

### Responsive
- **1100 px:** unchanged (still uses `left: calc(var(--rail-w) + 32px) = 272px`).
- **720 px:** `left: 16px; right: 16px; flex-direction: column; align-items: stretch` — the bar spans the viewport with `16px` side gutters and stacks the count above the action cluster.

### Checks
- [ ] Bottom bar appears only when ≥ 1 media card is selected. When deselecting the last card, the bar must unmount.
- [ ] Bar is fixed, with the left edge at `272px` (nav rail width + 32 px gutter) and `bottom: 24px`.
- [ ] Background is **bright** (`#FBFFFF` inverse-surface), text **dark** (`#00000F`) — this is the only place on the admin pages where the surface inverts.
- [ ] Selection count text reads exactly `3 items selected` (or the live count + ` items selected` — pluralize as needed; `1 item selected` for a single item).
- [ ] Three action buttons in this order: `Download` (text), `Move` (text), `Delete` (filled).
- [ ] `Delete` button is `md-filled-button` (orange container) — confirm the destructive intent is communicated by the position + an `admin-confirm-delete-dialog` rather than a red container in this view.
- [ ] At 720 px the bar gutters shrink to 16 px and the actions stack below the count text.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/media/media-selection-bar`. Confirm it accepts a `selection` input array and emits `download`, `move`, `delete` events.

---

## 7. Page-level visual checks (global)

- [ ] **`:root` MD3 tokens** match `admin-tutorial-dialog.html` verbatim (lines 34-82 of the skeleton).
- [ ] **Body background** is solid `#00000F` (near-black) — no radial gradient overlays.
- [ ] **`main.admin-main`** padding is `32px 40px 96px`, `max-width: 1480px`. The 96 px bottom padding leaves room for the fixed selection bar.
- [ ] **`.media-layout`** is exactly `260px 1fr` with `gap: 24px; align-items: start`.
- [ ] **`.media-grid`** is exactly `repeat(3, 1fr)` with `gap: 16px` at desktop.
- [ ] **No custom-element console warnings** — `<ps-admin-media>` must resolve to the Angular page component.
- [ ] **Material Web modules** load from the importmap.
- [ ] **Fonts loaded** — `Roboto Flex`, `Mona Sans`, `Material Symbols Outlined`.
- [ ] **Card radius** is consistently 16 px across `.card`, `.media-card`, and `.bottom-bar`.

---

## 8. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-media.md`](../../bugs/admin-media.md).
2. Append a new entry using the `MEDIA-NNN` prefix.
3. Include:
   - The section + check that failed.
   - Expected value (copy from this doc; for skeleton text, copy verbatim).
   - Actual value (from the running app).
   - Suggested fix location (component path).
4. Once fixed, append the commit SHA and mark `resolved`.

## 9. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Active nav rail item highlights wrong page | `routerLinkActive` config on `admin-nav-rail.html` — match `/admin/media` |
| Top-bar `Upload` button missing or styled as outlined | `admin-media-page.html` — project `<md-filled-button>` into the top-actions slot |
| H1 not exactly `Media library` | `admin-media-page.html` page header |
| Summary `3 selected` not bound to live state | bind to a `selectionCount` signal in the media facade |
| Filter rail rendered as a flat list (no chips) | `media-filter-rail.html` — use `<md-chip-set>` with `<md-filter-chip>` |
| Type chips behaving as single-select | confirm `md-filter-chip` (multi) not `md-radio` |
| Media grid not 3-col at desktop | `media-grid.scss` — `grid-template-columns: repeat(3, 1fr); gap: 16px` |
| Card captions using ASCII `x` instead of `×` | `media-card.html` — output `×` or named entity `&times;` |
| Card filenames truncating mid-name | add `text-overflow: ellipsis; white-space: nowrap; overflow: hidden` to `media-card.scss` |
| Selected card lacks orange outline | `media-card.scss` — `:host([selected]) { outline: 2px solid var(--md-sys-color-primary) }` |
| Bottom selection bar always visible (even with 0 selected) | gate `*ngIf="selection().length > 0"` in `admin-media-page.html` |
| Bottom bar background not inverted | `media-selection-bar.scss` — use `--md-sys-color-inverse-surface` |
| Delete button red instead of orange | match skeleton: keep `md-filled-button` (primary) — destructive intent handled by the confirm dialog |
| Bottom bar `left` offset doesn't account for nav rail | use `left: calc(var(--rail-w) + 32px)` with `--rail-w` from the global token |
| Color token drift | `frontend/projects/tokens/_md3-tokens.scss` |
