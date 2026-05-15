# Admin Categories — UI Audit

- **Route:** `/admin/categories`
- **Skeleton:** [`docs/skeletons/admin-categories.html`](../../skeletons/admin-categories.html)
- **Pattern:** B (`@material/web` MD3 components + Roboto Flex / Mona Sans / Material Symbols Outlined, admin shell with sticky top app bar + 240 px left nav rail)
- **Bug log:** [`bugs/admin-categories.md`](../../bugs/admin-categories.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/taxonomy/admin-taxonomy-page`

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
2. Sign in via the public `/signin` page using an OAuth account that maps to a user with the `sysadmin` role (the route is gated by the admin guard — viewer/editor roles will be redirected). Once signed in, click **Categories** in the admin nav rail to land on `/admin/categories`.
3. Open `docs/skeletons/admin-categories.html` directly in a second tab (file:// is fine — only Google Fonts + the `@material/web` importmap are needed).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (DevTools device toolbar). At 720 px the nav rail collapses to a 72 px icon-only rail and the data table becomes horizontally scrollable.
5. Walk the checks below in DOM order. Log every gap in [`bugs/admin-categories.md`](../../bugs/admin-categories.md) using ID prefix `CAT-`.

---

## Composition (DOM order, from `admin-categories.html:264-341`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             ← sticky, z-index 50
  │   ├─ menu md-icon-button
  │   ├─ .brand-row  (Prompt/Sharp + Admin tag)
  │   ├─ .spacer
  │   └─ .actions  (notifications · help · QB avatar)
  ├─ <div class="admin-layout">    ← grid 240px / 1fr
  │   ├─ <ps-admin-nav-rail>       ← Categories = active
  │   └─ <main class="admin-main">
  │       └─ <ps-admin-categories>
  │           ├─ <header class="page-header">  (breadcrumb · H1 · summary · New category)
  │           ├─ <md-tabs>  (Categories / Tags)
  │           └─ <section class="card table-wrap">  (data-table)
  └─ <div class="fab-cluster">     ← fixed, bottom-right "+ New category" FAB
</ps-admin-shell>
```

Live counterpart: `admin-taxonomy-page.ts`. The shared `admin-table-shell` + `admin-taxonomy-table` + `admin-taxonomy-row` components handle the table chrome.

Pattern B foundations (top bar + nav rail + MD3 `:root`) are the same as every other admin screen — see [`admin-tutorial-editor.md`](./admin-tutorial-editor.md) sections 1 and 2 for the full breakdown; only the **active nav item** and the **page body** differ here.

---

## 1. `<ps-admin-topbar>` — Sticky top app bar

Source: `admin-categories.html:266-276`

### Layout
- Identical to other admin pages: 64 px height, sticky `top: 0; z-index: 50`, `background: #0F1A30`, `border-bottom: 1px solid #3A4880`, `padding: 0 12px`, flex with `gap: 16px`.

### Right cluster — `.actions` (no editor-style action buttons)
- `<md-icon-button aria-label="Notifications"><md-icon>notifications</md-icon></md-icon-button>`.
- `<md-icon-button aria-label="Help"><md-icon>help</md-icon></md-icon-button>`.
- `.avatar` 36 × 36 circle, content `QB`, `title="Quinntyne Brown"`, orange container + near-black fg, **14 px / weight 600**.

### Checks
- [ ] Top bar contains only `notifications`, `help`, and the user avatar in the right cluster — **no** Save/Publish buttons (those are editor-only).
- [ ] Wordmark renders Mona Sans `wdth 82 / wght 700`, with the `/` italic orange `wdth 92 / wght 500`.
- [ ] `Admin` chip is solid orange with **11 px / weight 600** uppercase text, `letter-spacing: 0.18em`.
- [ ] Avatar shows signed-in user's initials.
- [ ] At 720 px the orange `Admin` chip is hidden.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/shared/admin-top-bar` — categories page uses the default action slot (icons + avatar), not the editor variant.

---

## 2. `<ps-admin-nav-rail>` — Left navigation rail

Source: `admin-categories.html:279-311`

Same seven-item rail as every admin screen. **Active item: `Categories`** (`category` icon).

### Checks
- [ ] Active item is **Categories**, with `background: #2A3970`, `color: #D8E2FF`, `font-weight: 600`, and the `category` icon in its filled variant (`'FILL' 1`).
- [ ] `Tutorials` still shows the `12` orange badge (active state does not move the badge).
- [ ] Items appear in this exact order: Dashboard, Tutorials (badge 12), Categories (**active**), Tags, Media, Users, Audit log.
- [ ] At 720 px the rail collapses to 72 px icon-over-label cells; labels remain visible (only `.nav-label` eyebrow + `.badge` are hidden, not the per-item labels).
- [ ] **Live component:** `admin-nav-rail` — confirm the `routerLinkActive` on the Categories link matches `/admin/categories` (not `/admin/categories/...` only; the bare path must light up too).

---

## 3. `<header class="page-header">` — Page header

Source: `admin-categories.html:316-323`

### Layout
- `display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap`.

### Breadcrumb
- `Admin` · `/` · `.current` `Categories`.
- 13 px, `color: #C5CDE4`, `inline-flex`, `gap: 6px`, `margin-bottom: 8px`.
- `.current` color `#FBFFFF`, weight 500.

### H1
- Exact text: `Categories and tags`.
- Roboto Flex, **36 px / weight 400**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`.

### Summary
- `font-size: 14px`, `color: #C5CDE4`, `display: flex; gap: 14px; flex-wrap: wrap`.
- Two spans (with `<b>` wrapping the numeric prefix in each — so the count is bold ink, the label is dim):
  - `<b>18</b> categories`
  - `<b>64</b> tags`

### Actions
- `<md-filled-button><md-icon slot="icon">add</md-icon>New category</md-filled-button>` — MD3 filled button with leading `add` icon, label text `New category`. Orange container, near-black label.

### Responsive
- **720 px:** `flex-direction: column; align-items: flex-start` — the New category button drops below the summary.

### Checks
- [ ] Breadcrumb reads exactly `Admin / Categories` with `Categories` as the bold `current` segment.
- [ ] H1 text is **exactly** `Categories and tags` (lowercase `and`).
- [ ] Summary shows `18 categories` and `64 tags` with the **digits bold** (`<b>` wrap) and label text dim.
- [ ] `New category` is an `md-filled-button` (filled orange), with a leading `add` icon and label `New category`.
- [ ] Header wraps cleanly at 720 px with the button moving below the summary.
- [ ] Summary counts must bind to live taxonomy totals — `18` and `64` are placeholders.

---

## 4. `<md-tabs>` — Tabs row

Source: `admin-categories.html:324-327`

### Layout
- `<md-tabs>` is a Material Web tab bar containing two `<md-primary-tab>` children. Default MD3 tab height is 48 px; the underline indicator sits flush with the bottom.

### Content
- Tab 1: `<md-primary-tab active>Categories</md-primary-tab>` — label `Categories`, active.
- Tab 2: `<md-primary-tab>Tags</md-primary-tab>` — label `Tags`, inactive.

### Colors
- Active tab: label `--md-sys-color-on-surface` (`#FBFFFF`), indicator `--md-sys-color-primary` (`#FF9800`).
- Inactive tab: label `--md-sys-color-on-surface-variant` (`#C5CDE4`).
- Hover / focus state-layer uses `state-layer-color: var(--md-sys-color-primary)` per MD3.

### Material Web components
- `md-tabs`, `md-primary-tab`.

### Behaviour
- Switching to **Tags** must replace the table body below with the tags dataset (no full reload — keep the FAB + page-header in place).
- The route may use a query param (e.g., `?tab=tags`) or a child route — verify the live app preserves tab state across navigation.

### Checks
- [ ] Exactly two tabs in this order: `Categories` (active), `Tags`.
- [ ] Tab labels are literal `Categories` and `Tags` — no leading icons.
- [ ] Active indicator bar is **2 px tall orange** (`#FF9800`) aligned with the active tab's bottom edge.
- [ ] Clicking `Tags` swaps the table contents without reloading the header or FAB.
- [ ] Tab bar has `margin-top: 0` (the table card below uses `margin-top: 20px` to space itself from the tabs).
- [ ] **Live component:** `admin-taxonomy-page.html` — confirm a real `md-tabs` is used (not a custom div), and that tab state lives in a query param or signal.

---

## 5. `<section class="card table-wrap">` — Categories data table

Source: `admin-categories.html:328-335`

### Layout
- `.card`: `background: #0F1A30`, `border-radius: 16px`, `overflow: hidden`.
- `.table-wrap`: `overflow-x: auto` — table can horizontally scroll on narrow viewports.
- `margin-top: 20px` from the tabs above.

### Table
- `<table class="data-table">`: `width: 100%; border-collapse: collapse; min-width: 860px`.
- **Six columns** (in DOM order): `(icon)`, `Name`, `Slug`, `Tutorial count`, `Last edited`, `(row actions)`.

### `<thead>`
- `font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase`.
- `color: #C5CDE4`.
- `background: #0A1428` (surface-container-low) — the header is slightly darker than the body.
- `border-bottom: 1px solid #3A4880`.
- `padding: 14px 16px`, `text-align: left`, `white-space: nowrap`.
- Header cells: `<th></th>` (icon column, empty header), `<th>Name</th>`, `<th>Slug</th>`, `<th>Tutorial count</th>`, `<th>Last edited</th>`, `<th></th>` (row actions, empty header).

### `<tbody>` — Four rows (verbatim content)

| Icon (md-icon) | Name | Slug (mono) | Tutorial count | Last edited | Row actions |
|---|---|---|---|---|---|
| `api` | `.NET API Foundations` | `dotnet-api-foundations` | `142` | `2 min ago` | `more_vert` |
| `sell` | `Auth / RBAC` | `auth-rbac` | `23` | `1 hr ago` | `more_vert` |
| `cloud` | `Azure for Builders` | `azure-for-builders` | `94` | `Yesterday` | `more_vert` |
| `code` | `Blazor UI` | `blazor-ui` | `68` | `2 days ago` | `more_vert` |

Each `<td>`:
- `padding: 14px 16px`, `font-size: 14px`, `border-bottom: 1px solid #3A4880`, `vertical-align: middle`.
- Last row has no bottom border (`tr:last-child td { border-bottom: none; }`).
- **Icon column:** `<md-icon>` with the Material Symbols glyph (e.g., `api`, `sell`, `cloud`, `code`). Width is intrinsic.
- **Slug column:** `class="mono"` — Roboto Flex 12 px, `letter-spacing: 0.04em`, `color: #C5CDE4`. Slugs are URL-safe lowercase-hyphen format.
- **Row actions column:** `<md-icon-button><md-icon>more_vert</md-icon></md-icon-button>` — opens a row-level menu (Edit, Rename, Delete, etc.).

### Material Web components
- `md-icon`, `md-icon-button`.

### Responsive
- **1100 px:** `.card.table-wrap` activates horizontal scroll (table has `min-width: 860px`).
- **720 px:** same — table scrolls horizontally inside the card; FAB remains fixed bottom-right.

### Checks
- [ ] Table has exactly six columns in this order: icon, Name, Slug, Tutorial count, Last edited, row actions.
- [ ] Header row uses uppercase **11 px / weight 600 / letter-spacing 0.08em** labels on the `#0A1428` background; the empty icon and actions columns have no header text.
- [ ] Four rows present in the exact order above with verbatim text content (especially `.NET API Foundations` with the leading dot, `Auth / RBAC` with the space-slash-space, `Azure for Builders`, `Blazor UI`).
- [ ] Each row's icon column uses a Material Symbols `md-icon` with the listed glyph name (e.g., `api`, `sell`, `cloud`, `code`).
- [ ] Slug cell uses the `.mono` class (Roboto Flex 12 px, ink-dim, `letter-spacing: 0.04em`) — not the default 14 px ink.
- [ ] Tutorial counts are plain integers (`142`, `23`, `94`, `68`), right-justified by default left alignment (cell `text-align` is not overridden — verify it stays left in the live app).
- [ ] Last edited values are humanized relative times (`2 min ago`, `1 hr ago`, `Yesterday`, `2 days ago`) — wire to a relative-time pipe.
- [ ] Row actions column contains an `md-icon-button` with `more_vert`.
- [ ] Last row has no bottom border (it's hidden by the `tr:last-child` CSS rule, not by removing the `<td>` border).
- [ ] At 720 px the card scrolls horizontally inside its 16 px-radius container; the radius does not clip the scrollbar.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/taxonomy/admin-taxonomy-table` composes `admin-taxonomy-row` rows. Confirm the row component accepts `icon`, `name`, `slug`, `tutorialCount`, `lastEdited` inputs and emits a menu event.

---

## 6. `<div class="fab-cluster">` — Floating action button

Source: `admin-categories.html:339`

### Layout
- `position: fixed; bottom: 32px; right: 32px; z-index: 40`.

### Component
- `<md-fab variant="primary" label="New category"><md-icon slot="icon">add</md-icon></md-fab>`.
- MD3 extended FAB (primary variant): orange container, near-black label and icon, leading `add` glyph, label `New category`.

### Behaviour
- Clicking the FAB opens the **Category dialog** (see `admin-category-dialog.html`) in "New" mode.
- The FAB duplicates the page-header `New category` button intentionally — at 720 px the header button drops to a second row and the FAB becomes the dominant call-to-action.

### Colors
- Container: `--md-sys-color-primary` (`#FF9800`).
- Label + icon: `--md-sys-color-on-primary` (`#00000F`).

### Responsive
- Fixed positioning means the FAB stays anchored bottom-right at all viewports. At 720 px the FAB does **not** translate up — bottom-bar / snackbar interactions need to dodge it (none on this page).

### Checks
- [ ] FAB is fixed at `bottom: 32px; right: 32px`, **above** the table content (z-index 40 is below the inverse-surface `bottom-bar` at 45 but well above table content).
- [ ] FAB renders as **extended** (`label="New category"` + `slot="icon"` glyph) — not the plain circular variant.
- [ ] Variant is `primary` (orange container). The FAB and the page-header button must visually match.
- [ ] Clicking the FAB opens the same dialog as the page-header `New category` button.
- [ ] **Live component:** the FAB likely lives directly in `admin-taxonomy-page.html` — confirm it's `md-fab variant="primary"` with both `label` attr and an icon-slotted `md-icon`.

---

## 7. Page-level visual checks (global)

- [ ] **`:root` MD3 tokens** match `admin-tutorial-dialog.html` verbatim (lines 34-82 of the skeleton). Primary `#FF9800`, secondary `#8AA8FF`, surface `#00000F`, surface-container-high `#002A54`.
- [ ] **Body background** is solid `#00000F` (near-black). No radial gradient overlays.
- [ ] **`main.admin-main`** padding is `32px 40px 96px`, `max-width: 1480px`. The 96 px bottom padding leaves room for the fixed FAB plus future bottom toasts.
- [ ] **Card radius** is 16 px on `.card`.
- [ ] **No custom-element console warnings** — `<ps-admin-categories>` must resolve to the Angular page component.
- [ ] **Material Web modules** load from the importmap; no 404s on `@material/web/*`.
- [ ] **Fonts loaded** — `Roboto Flex`, `Mona Sans` (wordmark only), `Material Symbols Outlined`. No tofu glyphs in the icon column or row actions.
- [ ] **Tab switch** preserves the page-header summary counts (they describe **both** datasets — `18 categories` / `64 tags`).

---

## 8. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-categories.md`](../../bugs/admin-categories.md).
2. Append a new entry using the `CAT-NNN` prefix.
3. Include:
   - The section + check that failed.
   - Expected value (copy from this doc; for skeleton text, copy verbatim).
   - Actual value (from the running app).
   - Suggested fix location (component path).
4. Once fixed, append the commit SHA and mark `resolved`.

## 9. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Active nav rail item highlights wrong page | `routerLinkActive` config on `admin-nav-rail.html` — match `/admin/categories` |
| H1 text not exactly `Categories and tags` | `admin-taxonomy-page.html` page header |
| Summary counts hardcoded | bind `<b>{{categoryCount}}</b> categories` etc. via the taxonomy facade |
| Tabs missing or rendered as buttons | wrap with `<md-tabs>` + `<md-primary-tab>` in `admin-taxonomy-page.html` |
| Tab switch reloads the page | wire local signal (`tab = signal<'categories'|'tags'>('categories')`) instead of full router navigation |
| Table column order wrong | `admin-taxonomy-table.html` |
| Slug column not mono | `admin-taxonomy-row.scss` — add `.mono` to the slug cell |
| Row icon missing or wrong glyph | `admin-taxonomy-row.html` — bind `<md-icon>{{ icon }}</md-icon>` |
| Last edited not humanized | apply a `relativeTime` pipe in `admin-taxonomy-row.html` |
| Row actions menu doesn't open | wire `(click)` on `md-icon-button[more_vert]` to a menu service |
| FAB not extended (icon-only circle) | `admin-taxonomy-page.html` — keep both `label="New category"` and a slotted `<md-icon>add</md-icon>` |
| FAB and page-header button open different dialogs | route both to the same `admin-category-dialog` |
| Color token drift | `frontend/projects/tokens/_md3-tokens.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-CATEGORIES-001-categories-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-categories/admin-categories-desktop.png`; `docs/ui-audit/screenshots/admin-categories/admin-categories-tablet.png`; `docs/ui-audit/screenshots/admin-categories/admin-categories-mobile.png`
