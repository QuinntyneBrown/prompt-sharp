# Admin Tutorial List — UI Audit

- **Route:** `/admin/tutorials`
- **Skeleton:** [`docs/skeletons/admin-tutorial-list.html`](../../skeletons/admin-tutorial-list.html)
- **Pattern:** B (Material 3 admin chrome — Roboto Flex + Mona Sans wordmark + Material Symbols Outlined)
- **Bug log:** [`bugs/admin-tutorial-list.md`](../../bugs/admin-tutorial-list.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/admin-tutorial-list-page`
- **Chrome reference:** [`admin-dashboard.md`](./admin-dashboard.md) sections 1 + 2 (top app bar and nav rail are lifted unchanged, with only the active nav-item differing).

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
2. Open `http://localhost:4200/signin`, authenticate with an account that has the **Admin** role, then navigate to `http://localhost:4200/admin/tutorials`.
3. Open `docs/skeletons/admin-tutorial-list.html` directly in a second tab (file:// is fine — pulls Google Fonts + `@material/web` via the importmap).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px. This skeleton's responsive breakpoints are **1200px**, **880px**, and **600px**.
5. Walk the checks below in DOM order. Log every gap in [`bugs/admin-tutorial-list.md`](../../bugs/admin-tutorial-list.md) using ID prefix `TUTLIST-`.

---

## Composition (DOM order, from `admin-tutorial-list.html:491-507, 613-713`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>                        ← see admin-dashboard.md §1
  ├─ <div class="admin-layout">
  │   ├─ <ps-admin-nav-rail>                  ← see admin-dashboard.md §2 (Tutorials = active)
  │   └─ <main class="admin-main">
  │       └─ <ps-admin-tutorial-list>
  │           ├─ <header class="page-header">
  │           ├─ <div class="toolbar">         ← search + sort
  │           ├─ <div class="chip-row">        ← status filter chips
  │           └─ <section class="table-card">
  │               ├─ <table class="data-table">
  │               └─ <div class="table-foot"> ← pagination
  └─ <div class="fab-cluster">                 ← floating `md-fab`
```

Live counterpart should be `frontend/projects/domain/src/lib/admin/admin-tutorial-list-page/admin-tutorial-list-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-admin-topbar>` + `<ps-admin-nav-rail>` — Admin chrome

Lifted unchanged from `admin-dashboard.html`. See [`admin-dashboard.md` §1](./admin-dashboard.md#1-ps-admin-topbar--top-app-bar-material-3-center-aligned-variant) and [§2](./admin-dashboard.md#2-ps-admin-nav-rail--navigation-drawer-material-3-standard-drawer) for the full chrome audit (topbar layout, brand, admin tag, action buttons, nav-rail layout, item styling, responsive behaviour).

### Differences from dashboard

- The **active nav item is now `Tutorials`** (not `Dashboard`). Source: `admin-tutorial-list.html:536-543`.
- Item array remains: Dashboard, **Tutorials (active, badge `12`)**, Categories, Tags, Media, Users. Account group: Settings, Sign out.

### Checks (chrome-specific to this page)

- [ ] Top app bar markup, sizing, and behaviour matches `admin-dashboard.md §1`.
- [ ] Nav rail markup, sizing, and behaviour matches `admin-dashboard.md §2`.
- [ ] `Tutorials` nav item is the only `.active` item: filled `menu_book` glyph, pill background `var(--md-sys-color-secondary-container)` (`#2A3970`), text `var(--md-sys-color-on-secondary-container)` (`#D8E2FF`), weight 600.
- [ ] `Tutorials` still shows the `12` badge on the right (orange pill).
- [ ] `Dashboard` item is no longer active (no pill background, unfilled `dashboard` glyph).
- [ ] **Live component:** active state should be driven by the Angular router (e.g., `routerLinkActive="active"`). Confirm no hardcoded `active` classes leak across routes.

---

## 2. `<main class="admin-main">` — Main content surface

Same chrome as dashboard. Padding `32px 40px 96px`, max-width `1480px`. See `admin-dashboard.md §3`.

---

## 3. `<header class="page-header">` — Page title row

Source: `admin-tutorial-list.html:613-640`

### Layout
- Flex row, `align-items: flex-end`, `justify-content: space-between`, `gap: 24px`, `margin-bottom: 28px` (note: 28 px here vs 32 px on dashboard — verify spec), `flex-wrap: wrap`.

### Left column
1. **`.breadcrumb`** — Roboto Flex 13 px, color `var(--md-sys-color-on-surface-variant)`, inline-flex gap 6 px, margin-bottom 8 px. Contents in order:
   - `<a>Admin</a>` (link styling — verify hover state)
   - `<span class="sep">/</span>`
   - `<span class="current">Tutorials</span>` — color `var(--md-sys-color-on-surface)`, weight 500.
2. **`<h1>`:** Roboto Flex weight 400, **36px**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`. Text: `Tutorials`.
3. **`.summary`** — Roboto Flex 14 px, color on-surface-variant, flex row gap 14 px, flex-wrap wrap. Three spans separated by `<span class="sep">·</span>`:
   - `<span><b>412</b> total</span>`
   - `<span><b>23</b> drafts</span>`
   - `<span><b>5</b> awaiting review</span>`
   - The `<b>` digits are weight 600 on-surface; the surrounding text is on-surface-variant.

### Right column (`.actions`)
- Flex row, gap 12 px, flex-wrap wrap:
  1. **`md-outlined-button`** — leading icon `file_download`, label `Export`.
  2. **`md-filled-button`** — leading icon `add`, label `New tutorial`.

### Responsive
- **≤600px:** `.page-header { flex-direction: column; align-items: flex-start; }`.

### Checks
- [ ] Breadcrumb reads exactly: `Admin / Tutorials`, with the trailing `Tutorials` segment in `current` styling.
- [ ] `<h1>` reads **`Tutorials`** (singular page heading), Roboto Flex 36 px weight 400.
- [ ] Summary line shows the three counts in the exact order with bold digits: `412 total`, `23 drafts`, `5 awaiting review`.
- [ ] Separator between summary spans is a middle-dot `·`.
- [ ] Export = outlined; New tutorial = filled orange.
- [ ] At ≤600 px the actions row drops below the title block.
- [ ] **Live component:** counts must come from API data (`TutorialStats` DTO). Don't hardcode.

---

## 4. `<div class="toolbar">` — Search + sort

Source: `admin-tutorial-list.html:642-656` (CSS at `258-272`)

### Layout
- Flex row, `flex-wrap: wrap`, gap 12 px, margin-bottom 16 px (verify — chip-row directly below has `margin-bottom: 24px`).

### Left — Search field
- `.search-field` — `flex: 1 1 360px`, `min-width: 240px`.
- Contains `<md-outlined-text-field type="search" label="Search tutorials, authors, tags…">` with slotted leading `md-icon` `search`.
- Override on the text field: `--md-outlined-text-field-container-shape: 28px` (pill-shaped).

### Right — Sort
- `.sort` — `flex: 0 0 auto`.
- Contains `<md-outlined-button trailing-icon>` with text `Sort: Most recent` and trailing `md-icon` `arrow_drop_down`.

### Responsive
- **≤600px:** `.toolbar { flex-direction: column; align-items: stretch; }` and `.toolbar .sort { width: 100%; }`.

### Checks
- [ ] Search input occupies the full available width to the left of the sort button (min 360 px target, min 240 px floor).
- [ ] Search container shape is **28 px** radius (pill / capsule).
- [ ] Leading `search` icon visible inside the text field.
- [ ] Label text is exactly `Search tutorials, authors, tags…` (with the Unicode horizontal ellipsis `…`, not three periods).
- [ ] Sort button has the trailing `arrow_drop_down` glyph and reads `Sort: Most recent`.
- [ ] At ≤600 px search and sort stack vertically full-width.
- [ ] **Live component:** the search input must debounce (300 ms) and emit a search event. Sort button should open an `md-menu` of sort options (Most recent, Title A→Z, Views, Updated).

---

## 5. `<div class="chip-row">` — Status filter chips

Source: `admin-tutorial-list.html:658-667` (CSS at `275-285`)

### Layout
- Flex row, `flex-wrap: wrap`, gap 8 px, align center, `margin-bottom: 24px`.

### Content
- **`.label`** — 12 px weight 500, `letter-spacing: 0.08em`, uppercase, color on-surface-variant, `margin-right: 8px`. Text: `Status`.
- **`<md-chip-set>`** with five `<md-filter-chip>` children in order:
  1. `<md-filter-chip label="All" selected>` (initially selected → orange tint per M3)
  2. `<md-filter-chip label="Published">`
  3. `<md-filter-chip label="Draft">`
  4. `<md-filter-chip label="Awaiting review">`
  5. `<md-filter-chip label="Archived">`

### Checks
- [ ] Leading `Status` label appears uppercase muted with 0.08em tracking.
- [ ] Five filter chips in this exact order with the exact labels above.
- [ ] `All` chip is selected by default (filled state per M3 default).
- [ ] Only one chip can be selected at a time (filter-chip default is single-select unless attributed).
- [ ] **Live component:** status filter should bind to a route query param (e.g. `?status=draft`). Confirm `Awaiting review` maps to the correct backend status code.

---

## 6. `<section class="table-card">` — Data table card

Source: `admin-tutorial-list.html:669-712` (CSS at `290-432`)

### Card chrome
- Background `var(--md-sys-color-surface-container)`, `border-radius: 16px`, `overflow: hidden`.

### Table (`.data-table`)
- `width: 100%`, `border-collapse: collapse`, `min-width: 900px`.
- Wrapped in `.table-wrap` with `overflow-x: auto` (horizontal scroll on narrow screens).

### `<thead>`
- Background `var(--md-sys-color-surface-container-low)`.
- Each `<th>`: text-align left, 11 px weight 600, `letter-spacing: 0.08em`, uppercase, color on-surface-variant, padding `14px 16px`, `border-bottom: 1px solid outline-variant`, white-space nowrap, `user-select: none`.
- `.sortable` → `cursor: pointer`.
- `.sorted` → color `var(--md-sys-color-primary)` (orange), `.sort-icon` opacity 1.
- `.sort-icon` (Material Symbols, 16 px, `vertical-align: middle`, `margin-left: 4px`, opacity 0.6).

### Header cells (exact, in order)
1. `<th class="check-col">` — contains `<md-checkbox touch-target="wrapper" aria-label="Select all">`. Padding-left 20 px, padding-right 8 px, `width: 1px`.
2. `<th class="sortable sorted">` — label `Title` + trailing `<span class="ico sort-icon">arrow_downward</span>`. **This is the currently-sorted column** (orange).
3. `<th class="sortable">Category</th>`
4. `<th class="sortable">Author</th>`
5. `<th class="sortable">Status</th>`
6. `<th class="sortable">Updated</th>`
7. `<th class="sortable">Views · 30d</th>`
8. `<th></th>` (empty, row-actions column)

### `<tbody>` — 10 rows (exact, in order)

| # | Title | Steps | Cat | Author (av + name) | Status | Updated | Views | Pinned |
|---|-------|-------|-----|--------------------|--------|---------|-------|--------|
| 1 | Wiring MediatR into a Clean Architecture API | 22 | `.NET` | `AC` Alex Chen | `PUBLISHED` | `2 min ago` | `4.2K` | **yes** |
| 2 | RBAC, properly — claims and policy design | 14 | `AZURE` | `JR` Jamie Ruiz | `DRAFT` | `34 min ago` | `—` | no |
| 3 | Atomic design for Blazor components | 9 | `BLAZOR` | `QB` Quinntyne B. | `DRAFT` | `1 hr ago` | `—` | no |
| 4 | EF Core 9 migrations under load | 18 | `EF CORE` | `AC` Alex Chen | `PUBLISHED` | `3 hr ago` | `2.8K` | no |
| 5 | OAuth2 confidential clients, in one sitting | 12 | `AUTH` | `SL` Sam Lee | `PUBLISHED` | `Yesterday` | `3.1K` | no |
| 6 | A MediatR pipeline I would ship to production | 10 | `.NET` | `AC` Alex Chen | `PUBLISHED` | `2 days ago` | `5.6K` | no |
| 7 | Aspire 9 dashboards for local development | 16 | `ASPIRE` | `PT` Pat Thakur | `PUBLISHED` | `3 days ago` | `1.9K` | no |
| 8 | Building the admin shell — CMS without a CMS | 28 | `BLAZOR` | `JR` Jamie Ruiz | `DRAFT` | `4 days ago` | `—` | no |
| 9 | Responsive admin tables from xs to xl | 7 | `CSS` | `QB` Quinntyne B. | `PUBLISHED` | `1 week ago` | `894` | no |
| 10 | Old Identity Server tutorial | 19 | `AUTH` | `SL` Sam Lee | `ARCHIVED` | `2 weeks ago` | `12.4K` | no |

### Row cell styling
- `<td>` base: padding `14px 16px`, 14 px, border-bottom outline-variant, color on-surface.
- **Hover:** background `var(--md-sys-color-surface-container-high)` (`#002A54`).
- **Selected row:** background `var(--md-sys-color-secondary-container)` (`#2A3970`).
- `.check-cell`: padding-left 20 px, padding-right 8 px, width 1 px. Contains `<md-checkbox touch-target="wrapper" aria-label="Select row">`.
- `.title-cell`: weight 500, min-width 280 px, max-width 420 px (280 px below 1200 px).
  - `.title-link`: color on-surface, no underline, single-line ellipsis. Hover → color primary orange + underline (offset 3 px).
  - `.meta` (below the title): 12 px on-surface-variant, margin-top 2 px, flex gap 12 px, items center.
    - `.pin` (only for row 1): Material Symbols `push_pin`, color `var(--md-sys-color-tertiary)` (`#FFC85C`), 16 px, with `title="Editor's pick"`.
    - Text: `<span>{steps} steps</span>` — e.g. `22 steps`.
- `.cat`: inline-block, 11 px weight 600, `letter-spacing: 0.1em`, uppercase, color on-surface-variant, padding `3px 8px`, `border: 1px solid outline-variant`, `border-radius: 4px`. **Note: outlined chip — distinct from the dashboard's borderless `.cat`.**
- `.author`: inline-flex gap 10 px. `.av` 28×28 circle, secondary-container background, on-secondary-container text, 11 px weight 600.
- `.status` pill: inline-flex gap 6 px, 11 px weight 600, `letter-spacing: 0.06em`, padding `4px 10px`, `border-radius: 999px`. Leading `.ico` 12 px.
  - `.status.published` → background `primary-container` (`#4A2F00`), color `on-primary-container` (`#FFDAA8`). Leading icon `check_circle`.
  - `.status.draft` → background `secondary-container`, color `on-secondary-container`. Leading icon `edit`.
  - `.status.archived` → background `surface-container-highest` (`#003E80`), color on-surface-variant. Leading icon `archive`.
- `.updated-cell`: color on-surface-variant, `white-space: nowrap`.
- `.views`: color on-surface-variant.
- `.row-actions`: `width: 1px`, `padding-right: 8px`, text-align right. Contains `md-icon-button` with `more_vert` (`aria-label="Row actions"`).

### `.table-foot` — Pagination

Source: `admin-tutorial-list.html:692-711` (CSS at `412-432`)

#### Layout
- Flex row, space-between, align center, padding `16px 24px`, top border outline-variant, background surface-container-low, flex-wrap, gap 16 px.

#### Left — `.page-count`
- 13 px on-surface-variant. `<b>` bold on-surface weight 600.
- Text: `Showing <b>1–10</b> of <b>412</b>` (verbatim — use en-dash `–` not hyphen `-`).

#### Right — `.page-controls`
- Inline-flex, align center, gap 16 px.
- **`.rows-per`** — inline-flex gap 8 px, 13 px on-surface-variant. Text `Rows` + `<md-outlined-button trailing-icon>` reading `25` with trailing `arrow_drop_down`. Button override: `--md-outlined-button-container-shape: 4px` (squared corners).
- **`.page-arrows`** — inline-flex gap 4 px. Four `md-icon-button`s in order:
  1. `first_page` (disabled, `aria-label="First page"`)
  2. `chevron_left` (disabled, `aria-label="Previous page"`)
  3. `chevron_right` (`aria-label="Next page"`)
  4. `last_page` (`aria-label="Last page"`)

### Responsive
- **≤1200px:** `.title-cell { max-width: 280px; }`.
- **≤880px:** chrome collapses (see admin-dashboard §2).
- **≤600px:** `.toolbar` stacks; `.table-foot { flex-direction: column; align-items: flex-start; }`.

### Checks
- [ ] Table card has a 16 px radius and clips its content (`overflow: hidden`).
- [ ] Header row: 8 columns in the order: checkbox / Title (sorted, orange + arrow_downward) / Category / Author / Status / Updated / Views · 30d / (blank).
- [ ] `Title` header is the only sorted column — text is orange and the trailing arrow is fully opaque.
- [ ] All 10 rows render in the order above with verbatim titles. Em-dashes (`—`) are real em-dashes.
- [ ] Row 1 (`Wiring MediatR…`) shows the orange `push_pin` icon before `22 steps` in the meta line.
- [ ] Step counts in each row's meta: `22 steps`, `14 steps`, `9 steps`, `18 steps`, `12 steps`, `10 steps`, `16 steps`, `28 steps`, `7 steps`, `19 steps`.
- [ ] Category cell is the **outlined** chip variant (1 px outline-variant border, 4 px radius).
- [ ] Status pill icons: PUBLISHED = `check_circle`, DRAFT = `edit`, ARCHIVED = `archive`.
- [ ] Archived row pill background = `surface-container-highest` (`#003E80`), text muted.
- [ ] Views column shows `—` for draft rows (em-dash).
- [ ] Every row ends with `more_vert` icon-button right-aligned (1 px column).
- [ ] Hover any row → background `#002A54`.
- [ ] Pagination footer reads `Showing 1–10 of 412` with bold digits.
- [ ] First/Previous arrows are disabled on page 1; Next/Last are enabled.
- [ ] At ≤600 px the `.toolbar` and `.table-foot` stack vertically.
- [ ] **Live components:** `data-table` atom in `components/src/lib/data-table` (or use Material 3 data-table directly). The status pill is the same `pill` atom as dashboard. Row click should route to `/admin/tutorials/:id`.

---

## 7. `<div class="fab-cluster">` — Floating action button

Identical to admin-dashboard §8. One `<md-fab variant="primary" label="New tutorial">` with slotted `md-icon` `add`, fixed `bottom: 32px / right: 32px`, `z-index: 40`.

### Checks
- [ ] Same FAB appears in the bottom-right.
- [ ] Clicking opens the new-tutorial dialog/flow (cross-check with `docs/skeletons/admin-tutorial-dialog.html`).
- [ ] **Live component:** ideally one FAB lives in `admin-shell`, not duplicated per page.

---

## 8. Page-level visual checks (global)

- [ ] **Color tokens:** every M3 token matches admin-dashboard. Pattern B uses the same `--md-sys-color-*` palette.
- [ ] **No body radial gradients** (Pattern A only).
- [ ] **Roboto Flex** loads; Material Symbols Outlined ligatures resolve.
- [ ] **`@material/web/all.js`** is loaded for `md-checkbox`, `md-chip-set`, `md-filter-chip`, `md-outlined-text-field`, `md-outlined-button`, `md-filled-button`, `md-icon-button`, `md-fab`, `md-divider`.
- [ ] **Horizontal scroll** on `.table-wrap` activates when viewport < 900 px (the table's `min-width`).

---

## 9. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-tutorial-list.md`](../../bugs/admin-tutorial-list.md).
2. Append a new entry using the `TUTLIST-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 10. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| `Tutorials` nav item not active | Confirm `routerLinkActive="active"` is set in `admin-nav-rail.html` |
| Breadcrumb missing or wrong | `admin-tutorial-list-page` template — add `<ps-breadcrumb>` atom |
| Summary counts hardcoded | Bind to `tutorialStats$ \| async` from a `TutorialStatsApiService` |
| Search field not pill-shaped | Apply `--md-outlined-text-field-container-shape: 28px` in component SCSS |
| Sort button has no menu | Wire `md-menu` to the sort button click |
| Filter chips not bound to query param | Use `ActivatedRoute.queryParams` ↔ `Router.navigate` for `?status=` |
| `Title` column not sorted by default | Set initial sort state in the page component's `sort` signal |
| Pin icon missing on Editor's-pick row | `data-table` row template: render `push_pin` icon when `pinned === true` |
| `.cat` chip missing border | `components/src/lib/category-chip/category-chip.scss` — admin variant has outlined border |
| Status pill icons wrong | `components/src/lib/pill/pill.ts` — map `status → icon` (`published → check_circle`, etc.) |
| Pagination footer not flex space-between | Verify `.table-foot { display: flex; justify-content: space-between; }` |
| FAB duplicated per route | Move to `admin-shell` template |
| Horizontal scroll missing on narrow viewports | Ensure `.table-wrap { overflow-x: auto; }` and table has `min-width: 900px` |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-TUTORIAL-LIST-001-tutorial-list-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-tutorial-list/admin-tutorial-list-desktop.png`; `docs/ui-audit/screenshots/admin-tutorial-list/admin-tutorial-list-tablet.png`; `docs/ui-audit/screenshots/admin-tutorial-list/admin-tutorial-list-mobile.png`
