# Admin Audit Log — UI Audit

- **Route:** `/admin/audit-log`
- **Skeleton:** [`docs/skeletons/admin-audit-log.html`](../../skeletons/admin-audit-log.html)
- **Pattern:** B (`@material/web` MD3 components + Roboto Flex / Mona Sans / Material Symbols Outlined, admin shell with sticky top app bar + 240 px left nav rail)
- **Bug log:** [`bugs/admin-audit-log.md`](../../bugs/admin-audit-log.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/audit/admin-audit-log-page`

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
2. Sign in via the public `/signin` page using an OAuth account that maps to a user with the `sysadmin` role (the Audit log is **sysadmin-only** — editor/viewer roles must receive a 403 via the role guard). Once signed in, click **Audit log** in the admin nav rail to land on `/admin/audit-log`.
3. To audit the expanded row diff state, trigger at least one publish action so the seeded log contains a row with a non-trivial diff (the skeleton hardcodes the first row as expanded).
4. Open `docs/skeletons/admin-audit-log.html` directly in a second tab (file:// fine — Google Fonts + `@material/web` importmap only).
5. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px. The two-column `audit-layout` (`260px 1fr`) collapses to a single column at 1100 px.
6. Walk the checks below in DOM order. Log every gap in [`bugs/admin-audit-log.md`](../../bugs/admin-audit-log.md) using ID prefix `AUDIT-`.

---

## Composition (DOM order, from `admin-audit-log.html:264-352`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             ← sticky, z-index 50
  │   ├─ menu md-icon-button
  │   ├─ .brand-row  (Prompt/Sharp + Admin tag)
  │   ├─ .spacer
  │   └─ .actions  (notifications · help · QB avatar)
  ├─ <div class="admin-layout">    ← grid 240px / 1fr
  │   ├─ <ps-admin-nav-rail>       ← Audit log = active
  │   └─ <main class="admin-main">
  │       └─ <ps-admin-audit-log>
  │           ├─ <header class="page-header">  (breadcrumb · H1 · summary · Export)
  │           └─ <section class="audit-layout">   ← grid 260px / 1fr
  │               ├─ <div class="card table-wrap">         ← Audit table (DOM child 1)
  │               └─ <aside class="card pad right-rail">    ← Filters rail (DOM child 2)
</ps-admin-shell>
```

> **Layout note:** the shared `.audit-layout` CSS at `admin-audit-log.html:204` declares `grid-template-columns: 260px 1fr`. The DOM order in this skeleton puts the table **first** (so it lands in column 1) and the filter rail **second** (column 2). With CSS grid auto-flow this means the **table is the narrow `260px` column on the left** and the **filter rail is the wide `1fr` column on the right** — visually unusual but matches the skeleton verbatim. If the live app is intended to render with the table wide (the natural expectation), swap the `grid-template-columns` to `1fr 260px` so the wide column comes first while keeping DOM order. Document whichever choice the live app makes and verify the audit table never gets squeezed below 860 px (its `min-width`), which would trigger constant horizontal scrolling.

Live counterpart: `admin-audit-log-page.ts` composes `audit-log-table` (rows = `audit-log-row`) plus `audit-filter-rail`.

Pattern B foundations (top bar + nav rail + MD3 `:root`) are shared — see [`admin-tutorial-editor.md`](./admin-tutorial-editor.md) sections 1 and 2 for the full breakdown; only the **active nav item** and the **page body** differ here.

---

## 1. `<ps-admin-topbar>` — Sticky top app bar

Source: `admin-audit-log.html:266-276`

### Layout
- Identical to other admin pages: 64 px height, sticky `top: 0; z-index: 50`, `background: #0F1A30`, `border-bottom: 1px solid #3A4880`, `padding: 0 12px`, flex with `gap: 16px`.

### Right cluster — `.actions`
- `<md-icon-button aria-label="Notifications"><md-icon>notifications</md-icon></md-icon-button>`.
- `<md-icon-button aria-label="Help"><md-icon>help</md-icon></md-icon-button>`.
- `.avatar` 36 × 36 circle, content `QB`, orange container.

### Checks
- [ ] Top bar contains only `notifications`, `help`, and the user avatar in the right cluster (Export lives in the page header, not the top bar).
- [ ] Wordmark renders Mona Sans `wdth 82 / wght 700`, slash italic orange.
- [ ] `Admin` chip is solid orange.
- [ ] At 720 px the `Admin` chip is hidden.
- [ ] **Live component:** `admin-top-bar` — default action slot.

---

## 2. `<ps-admin-nav-rail>` — Left navigation rail

Source: `admin-audit-log.html:279-311`

Same seven-item rail. **Active item: `Audit log`** (`manage_search` icon).

### Checks
- [ ] Active item is **Audit log**, with `background: #2A3970`, `color: #D8E2FF`, `font-weight: 600`, `manage_search` icon filled (`'FILL' 1`).
- [ ] `Tutorials` shows the `12` orange badge.
- [ ] Items appear in this exact order: Dashboard, Tutorials (badge 12), Categories, Tags, Media, Users, Audit log (**active**).
- [ ] At 720 px the rail collapses to 72 px icon-over-label cells.
- [ ] **Live component:** `admin-nav-rail` — `routerLinkActive` on the Audit log link matches `/admin/audit-log`.

---

## 3. `<header class="page-header">` — Page header

Source: `admin-audit-log.html:316-323`

### Layout
- `display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap`.

### Breadcrumb
- `Admin` · `/` · `.current` `Audit log`. 13 px, ink-dim, `inline-flex`, `gap: 6px`, `margin-bottom: 8px`. `.current` color `#FBFFFF`, weight 500.

### H1
- Exact text: `Audit log`.
- Roboto Flex, **36 px / weight 400**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`.

### Summary
- `font-size: 14px`, `color: #C5CDE4`, `display: flex; gap: 14px; flex-wrap: wrap`.
- Two spans:
  - `Read-only event stream` (no bold — descriptive label).
  - `<b>9,428</b> events` (bold integer with comma-thousands separator).

### Actions
- `<md-outlined-button><md-icon slot="icon">file_download</md-icon>Export</md-outlined-button>` — MD3 outlined button (transparent fill + outline-color border), leading `file_download` glyph, label `Export`. Triggers a CSV / JSON download of the filtered audit window.

### Responsive
- **720 px:** `flex-direction: column; align-items: flex-start` — Export button drops below the summary.

### Checks
- [ ] Breadcrumb reads exactly `Admin / Audit log` with `Audit log` as the bold `current` segment.
- [ ] H1 text is **exactly** `Audit log` (sentence case, lowercase `log`).
- [ ] Summary shows `Read-only event stream` (descriptive, no bold) followed by `9,428 events` (the integer bold via `<b>`, with comma thousands).
- [ ] Event count must bind to the API count, not a literal `9,428`.
- [ ] `Export` is an `md-outlined-button` (not filled) with a leading `file_download` icon and label `Export`. The outlined variant communicates "read-only / lower-urgency" — do not upgrade to filled.
- [ ] Export honours the **currently applied filter** state (date range + actor + action checkboxes) when generating the download.
- [ ] Header wraps cleanly at 720 px.

---

## 4. Audit table — `<div class="card table-wrap">`

Source: `admin-audit-log.html:325-335`

### Layout
- DOM-order column 1 of `.audit-layout`. (See the layout note above — depending on whether `260px 1fr` is preserved or swapped, this card lands either narrow-left or wide-left.)
- `.card`: `background: #0F1A30`, `border-radius: 16px`, `overflow: hidden`.
- `.table-wrap`: `overflow-x: auto`.
- No top margin — the table card abuts the page-header directly.

### Table
- `<table class="data-table">`: `width: 100%; border-collapse: collapse; min-width: 860px`.
- **Seven columns**: `Timestamp`, `Actor`, `Action`, `Target type`, `Target id`, `IP`, `(expand caret)`.

### `<thead>`
- `font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase`, `color: #C5CDE4`, `background: #0A1428`, `border-bottom: 1px solid #3A4880`, `padding: 14px 16px`, `text-align: left`, `white-space: nowrap`.
- Header cells in order: `Timestamp`, `Actor`, `Action`, `Target type`, `Target id`, `IP`, (empty for the expand caret).

### `<tbody>` — Four rows (one primary expanded row + one expanded diff sub-row + two more collapsed rows)

#### Row 1 (expanded — primary row)
| Cell | Content | Class |
|---|---|---|
| Timestamp | `2026-05-14 14:22:08` | `.mono` |
| Actor | `Alex Chen` | — |
| Action | `publish` | — (verb token) |
| Target type | `Tutorial` | — |
| Target id | `tut_412` | `.mono` |
| IP | `192.168.1.42` | `.mono` |
| Expand caret | `<md-icon>expand_more</md-icon>` | — |

#### Row 2 (expanded sub-row — diff block under Row 1)
- Single `<td colspan="7">` spanning all columns.
- Contains a `.diff-block`:
  - `border: 1px solid #3A4880; border-radius: 10px; padding: 14px; background: #0A1428; display: grid; gap: 8px`.
  - First child: `<span class="mono">~ status: draft -&gt; published</span>` — diff line in mono, ink-dim. The `~` prefix indicates **modified**, and the arrow is rendered from `-&gt;` (literal ASCII `->`). Verify the live app preserves the ASCII arrow (not `→`) — this matches the machine-style log line aesthetic from the editor's save-state readout.
  - Two `<sk-line>` shimmer placeholders at widths **84%** and **62%** (`delay="1"` on the second) — these stand in for additional diff lines in the skeleton; the live row should render all modified fields.

#### Row 3 (collapsed)
| Cell | Content | Class |
|---|---|---|
| Timestamp | `2026-05-14 13:48:33` | `.mono` |
| Actor | `Jamie Ruiz` | — |
| Action | `update` | — |
| Target type | `Category` | — |
| Target id | `cat_auth` | `.mono` |
| IP | `192.168.1.88` | `.mono` |
| Expand caret | `<md-icon>chevron_right</md-icon>` | — |

#### Row 4 (collapsed)
| Cell | Content | Class |
|---|---|---|
| Timestamp | `2026-05-14 12:10:11` | `.mono` |
| Actor | `Sam Lee` | — |
| Action | `upload` | — |
| Target type | `Media` | — |
| Target id | `med_981` | `.mono` |
| IP | `10.0.0.8` | `.mono` |
| Expand caret | `<md-icon>chevron_right</md-icon>` | — |

### Cell anatomy

#### 4.1 Timestamp cell — `.mono`
- Format: `YYYY-MM-DD HH:mm:ss` (UTC or server time — verify the audit log records timestamps in a consistent zone). Rendered Roboto Flex 12 px, `letter-spacing: 0.04em`, `color: #C5CDE4`.

#### 4.2 Actor cell
- Plain text — Roboto Flex 14 px, ink `#FBFFFF`. Links to the actor's user-detail page (`/admin/users/:actorId`).

#### 4.3 Action cell — verb token
- Lowercase single-word verb: `publish`, `update`, `upload`, plus future verbs `create`, `delete`, `sign-in`, `sign-out`.
- Skeleton renders as plain text (no chip styling). Match the skeleton — do not upgrade to a colored verb chip unless redesigning.

#### 4.4 Target type cell
- Pascal-case noun: `Tutorial`, `Category`, `Media`, `User`, `Tag`. Plain text.

#### 4.5 Target id cell — `.mono`
- Format: `{prefix}_{shortId}` where prefix maps to the target type: `tut_`, `cat_`, `med_`, `usr_`, `tag_`. Mono caption styling.

#### 4.6 IP cell — `.mono`
- IPv4 dotted-quad (skeleton shows `192.168.1.42`, `192.168.1.88`, `10.0.0.8`). IPv6 must also be supported by the row component.

#### 4.7 Expand caret cell
- Collapsed rows: `<md-icon>chevron_right</md-icon>`.
- Expanded rows: `<md-icon>expand_more</md-icon>`.
- Clicking the row toggles the caret + reveals/hides the diff sub-row beneath.

### Diff sub-row anatomy

The diff sub-row appears immediately below its parent **only when expanded**. In the skeleton it is always rendered for Row 1; in the live app it must be conditional.

Structure:
- `<tr><td colspan="7">…</td></tr>` so the diff visually spans the full table width.
- Inside the `<td>`, a `.diff-block` (`1px solid #3A4880`, `border-radius: 10px`, `padding: 14px`, `background: #0A1428`, `display: grid; gap: 8px`).
- Diff lines use the `.mono` class and a **leading character** convention:
  - `~ {field}: {oldValue} -> {newValue}` — modified field. Skeleton example: `~ status: draft -> published`.
  - `+ {field}: {value}` — added field (not in skeleton, but document for completeness).
  - `- {field}: {value}` — removed field.
- The `->` arrow is rendered from the literal HTML entity `&gt;` after a hyphen (i.e., ASCII `->`), **not** the Unicode `→`. This matches the machine-log aesthetic of the editor's `save_state = clean` block.
- Skeleton shows two trailing `<sk-line>` placeholders to indicate "more diff lines exist" — live component should render all changed fields.

### Material Web components
- `md-icon` (expand carets, plus the page-header `file_download` icon).

### Responsive
- **1100 px:** `.audit-layout` collapses to a single column — the table stacks **above** the filter rail in the single-column flow (DOM order preserved).
- **720 px:** same as 1100 px; the table card still scrolls horizontally inside its 16 px-radius container (table has `min-width: 860px`).

### Checks
- [ ] Table has exactly seven columns in this order: Timestamp, Actor, Action, Target type, Target id, IP, expand caret.
- [ ] Header row uses uppercase **11 px / weight 600 / letter-spacing 0.08em** labels on the `#0A1428` background; the expand-caret column has an empty header.
- [ ] Three primary rows in the exact order above with verbatim content: `2026-05-14 14:22:08 / Alex Chen / publish / Tutorial / tut_412 / 192.168.1.42`, then `13:48:33 / Jamie Ruiz / update / Category / cat_auth / 192.168.1.88`, then `12:10:11 / Sam Lee / upload / Media / med_981 / 10.0.0.8`.
- [ ] Timestamp, Target id, and IP cells use the `.mono` class.
- [ ] Action verbs are lowercase single words; Target type values are Pascal-case.
- [ ] Row 1 is **expanded by default** in the skeleton — caret glyph is `expand_more` and the diff sub-row is visible directly beneath. Rows 3 and 4 are **collapsed** — caret is `chevron_right` and no diff sub-row.
- [ ] Diff block on the expanded row contains the verbatim line `~ status: draft -> published` in `.mono` (ASCII arrow `->`, single spaces around the colon, no leading/trailing whitespace).
- [ ] Diff block follows with two shimmer lines at widths 84% and 62% (these are placeholders — the live component must render all modified fields, not just two shimmers).
- [ ] Clicking a collapsed row's caret expands it (caret swaps `chevron_right` → `expand_more`) and reveals the diff sub-row beneath. Clicking again collapses it.
- [ ] The diff sub-row `<tr>` uses `<td colspan="7">` so it visually spans the full table width.
- [ ] **The audit log is read-only** — no row menu, no edit / delete affordances. Confirm there is no `more_vert` icon-button anywhere in the table.
- [ ] At 1100 px the table stacks above the filter rail in single-column flow.
- [ ] **Live components:** `frontend/projects/domain/src/lib/admin/audit/audit-log-table` composes `audit-log-row` rows. The diff sub-row is rendered via a conditional template projection inside `audit-log-row` (it lives in the same component, not a separate sibling), so a single signal flips the caret and the expanded diff together.

---

## 5. Filter rail — `<aside class="card pad right-rail">`

Source: `admin-audit-log.html:336-345`

### Layout
- DOM-order column 2 of `.audit-layout` (visually on the right of the table at desktop).
- `.card.pad`: `padding: 20px`, `background: #0F1A30`, `border-radius: 16px`.
- `.right-rail`: `display: grid; gap: 16px` — vertical stack of filter controls.

### Title
- `<h2>Filters</h2>`. **18 px / weight 500**, color `#FBFFFF`.

### 5.1 Date range field
- `<md-outlined-text-field label="Date range" value="Last 7 days"></md-outlined-text-field>`.
- Default value `Last 7 days`. In production this is a date-range picker — clicking opens a popover with preset ranges (`Today`, `Last 24 hours`, `Last 7 days`, `Last 30 days`, `Custom…`).

### 5.2 Actor field
- `<md-outlined-text-field label="Actor" value="Any actor"></md-outlined-text-field>`.
- Default value `Any actor`. In production this is an autocomplete against the user list.

### 5.3 Action-type checkbox group — `.block-stack`
- `<div class="block-stack">` (`display: grid; gap: 14px`) containing three `<label>` rows, each with an `md-checkbox` and a literal action verb:
  - `<label><md-checkbox checked></md-checkbox> Publish</label>` — checked by default.
  - `<label><md-checkbox checked></md-checkbox> Update</label>` — checked by default.
  - `<label><md-checkbox></md-checkbox> Delete</label>` — **unchecked** by default.
- Labels in title case: `Publish`, `Update`, `Delete`. (Note these are the row Action values mapped to title case — Action cells show lowercase `publish`, but the filter label is `Publish`.)
- Each `<label>` wraps its checkbox + text so the label area is clickable.

### Material Web components
- `md-outlined-text-field`, `md-checkbox`.

### Colors
- Card bg: `--md-sys-color-surface-container` (`#0F1A30`).
- Text-field outline: `--md-sys-color-outline-variant` (`#3A4880`) unfocused, `--md-sys-color-primary` (`#FF9800`) focused.
- Checkbox checked container: `--md-sys-color-primary` (`#FF9800`); check mark: `--md-sys-color-on-primary` (`#00000F`).

### Behaviour
- Filter changes must immediately re-fetch (or filter in-memory) the audit stream — no Apply button.
- The summary count (`9,428 events`) updates with the filter intersection.

### Responsive
- **1100 px:** filter rail stacks **below** the table (DOM order).
- **720 px:** unchanged from 1100 px.

### Checks
- [ ] Title text reads exactly `Filters`.
- [ ] Date range field is an `md-outlined-text-field` with label `Date range` and seed value `Last 7 days`. Clicking the field must open a date-range picker, not a plain text input.
- [ ] Actor field is an `md-outlined-text-field` with label `Actor` and seed value `Any actor`. Clicking it must open a user autocomplete.
- [ ] Three action-type checkboxes in this order: `Publish` (checked), `Update` (checked), `Delete` (unchecked).
- [ ] Each checkbox is wrapped in a `<label>` so clicking the text toggles the checkbox.
- [ ] Action filter labels are title-cased (`Publish`, `Update`, `Delete`) but match the lowercase verbs in the Action column of the table (`publish`, `update`, etc.) — the filter mapping is case-insensitive.
- [ ] Adding `Delete` to the checked set immediately includes `delete` rows in the table (no Apply button).
- [ ] At 1100 px the filter rail stacks below the table; at 720 px the rail card spans full-width.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/audit/audit-filter-rail`. The component emits a structured filter event combining date range + actor + the action-type checkbox set.

---

## 6. Page-level visual checks (global)

- [ ] **`:root` MD3 tokens** match `admin-tutorial-dialog.html` verbatim.
- [ ] **Body background** is solid `#00000F` (near-black). No radial gradients.
- [ ] **`main.admin-main`** padding is `32px 40px 96px`, `max-width: 1480px`.
- [ ] **`.audit-layout`** is exactly `260px 1fr` with `gap: 24px; align-items: start` (or swap to `1fr 260px` if the live app preserves the more conventional wide-left layout — document the choice).
- [ ] **Card radius** is 16 px on `.card`, 10 px on `.diff-block`.
- [ ] **No custom-element console warnings** — `<ps-admin-audit-log>` must resolve.
- [ ] **Material Web modules** load from the importmap.
- [ ] **Fonts loaded** — `Roboto Flex`, `Mona Sans`, `Material Symbols Outlined`. The Material Symbols font must be loaded for the `expand_more`, `chevron_right`, and `file_download` glyphs.
- [ ] **Read-only enforcement** — no row menu, no edit/delete buttons, no FAB. The page is purely informational.
- [ ] **Mono cells alignment** — verify Timestamp, Target id, and IP columns all use the same `.mono` 12 px style and align consistently across rows.

---

## 7. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-audit-log.md`](../../bugs/admin-audit-log.md).
2. Append a new entry using the `AUDIT-NNN` prefix.
3. Include:
   - The section + check that failed.
   - Expected value (copy from this doc; for skeleton text, copy verbatim).
   - Actual value (from the running app).
   - Suggested fix location (component path).
4. Once fixed, append the commit SHA and mark `resolved`.

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Active nav rail item highlights wrong page | `routerLinkActive` config on `admin-nav-rail.html` — match `/admin/audit-log` |
| Editor or viewer can access `/admin/audit-log` | tighten the route guard to require `sysadmin` claim |
| H1 not exactly `Audit log` | `admin-audit-log-page.html` page header |
| Summary `Read-only event stream` missing | first summary span in `admin-audit-log-page.html` header |
| Event count hardcoded | bind `<b>{{ totalEvents }}</b> events` via the audit facade |
| Export button rendered as filled instead of outlined | swap to `md-outlined-button` in `admin-audit-log-page.html` |
| Audit table squeezed to <860 px | swap `.audit-layout` to `1fr 260px` so the table gets the wide column |
| Table column order wrong | `audit-log-table.html` |
| Timestamp/Target id/IP cells not mono | add `.mono` class in `audit-log-row.html` |
| Action verbs rendered title-case (`Publish`) instead of lowercase (`publish`) | normalize in `audit-log-row.ts` |
| Expand caret using wrong glyph | bind to expansion state: `chevron_right` collapsed, `expand_more` expanded |
| Diff sub-row not spanning all columns | `<td colspan="7">` in `audit-log-row.html` |
| Diff arrow rendered as `→` (Unicode) instead of `->` | use literal ASCII `->` in `audit-log-row.html` |
| Row menu / edit affordance visible | remove — the audit log must be read-only |
| Date range field is plain text (no picker) | wire `(click)` to open a date-range popover; consider an `md-menu` with preset list items |
| Actor field has no autocomplete | wire to user-list service in `audit-filter-rail.ts` |
| Checkbox group missing third option | confirm three `<label>` rows with `Publish` / `Update` / `Delete` in `audit-filter-rail.html` |
| Filter changes require an Apply button | wire signals so any filter change re-fetches immediately |
| Color token drift | `frontend/projects/tokens/_md3-tokens.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-AUDIT-001-audit-log-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-audit-log/admin-audit-log-desktop.png`; `docs/ui-audit/screenshots/admin-audit-log/admin-audit-log-tablet.png`; `docs/ui-audit/screenshots/admin-audit-log/admin-audit-log-mobile.png`
