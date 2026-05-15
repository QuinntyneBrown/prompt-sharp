# Admin Dashboard — UI Audit

- **Route:** `/admin`
- **Skeleton:** [`docs/skeletons/admin-dashboard.html`](../../skeletons/admin-dashboard.html)
- **Pattern:** B (Material 3 admin chrome — Roboto Flex + Mona Sans wordmark + Material Symbols Outlined)
- **Bug log:** [`bugs/admin-dashboard.md`](../../bugs/admin-dashboard.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/admin-dashboard-page`
- **Chrome reference:** This document is the canonical source for the **admin chrome** (top app bar + nav rail). Sibling Pattern B audits (admin-tutorial-list, notifications) reference these chrome sections rather than re-document them.

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
2. Open `http://localhost:4200/signin`, authenticate with an account that has the **Admin** role, then navigate to `http://localhost:4200/admin`.
3. Open `docs/skeletons/admin-dashboard.html` directly in a second tab (file:// is fine — pulls Google Fonts + `@material/web` via the importmap).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar). Note that this skeleton's responsive breakpoints are `1200px` and `880px` (not `1100/720` like Pattern A) — flag any deviation accordingly.
5. Walk the checks below in DOM order. Log every gap in [`bugs/admin-dashboard.md`](../../bugs/admin-dashboard.md) using ID prefix `DASH-`.

---

## Composition (DOM order, from `admin-dashboard.html:460-498`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>                                ← sticky top app bar
  ├─ <div class="admin-layout">
  │   ├─ <ps-admin-nav-rail>                          ← sticky drawer
  │   └─ <main class="admin-main">
  │       └─ <ps-admin-dashboard>
  │           ├─ <header class="page-header">
  │           ├─ <section class="kpi-row">            ← 4 KPI cards
  │           ├─ <section class="content-row">
  │           │   ├─ <div class="card">  Recent activity
  │           │   └─ <div class="card">  Quick actions
  │           └─ <section class="card">  Recent edits table
  └─ <div class="fab-cluster">                        ← floating `md-fab`
```

Live counterpart should be `frontend/projects/domain/src/lib/admin/admin-dashboard-page/admin-dashboard-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-admin-topbar>` — Top app bar (Material 3 center-aligned variant)

Source: `admin-dashboard.html:120-162, 500-522`

### Layout
- Flex row, `align-items: center`, `gap: 16px`.
- **Height:** `--topbar-h: 64px`.
- **Padding:** `0 12px`.
- **Background:** `var(--md-sys-color-surface-container)` → `#0F1A30`.
- **Border-bottom:** `1px solid var(--md-sys-color-outline-variant)` → `#3A4880`.
- **Position:** sticky `top: 0`, `z-index: 50`.

### Children (in order)
1. **`md-icon-button` — `menu` icon** (`aria-label="Toggle menu"`). Material Symbols Outlined.
2. **`.brand-row`** — inline-flex, gap 12px, `padding-left: 4px`:
   - `.brand` — Mona Sans `wdth 82 / wght 700`, **22px**, `letter-spacing: -0.035em`, `line-height: 1`, color `var(--md-sys-color-on-surface)` (`#FBFFFF`). Renders `Prompt<span class="slash">/</span>Sharp`.
   - `.brand .slash` — `color: var(--md-sys-color-primary)` (`#FF9800`), italic, `wdth 92 / wght 500`.
   - `.admin-tag` — Roboto Flex 11px, weight 600, `letter-spacing: 0.18em`, uppercase, color `var(--md-sys-color-on-primary)` (`#00000F`), background `var(--md-sys-color-primary)` (`#FF9800`), padding `4px 10px`, `border-radius: 4px`. Text: `Admin`.
3. **`.spacer`** — `flex: 1`.
4. **`.actions`** — inline-flex, gap 4px (skeleton CSS) / 8px (notifications variant); both contain:
   - `md-icon-button` icon `notifications` (`aria-label="Notifications"`).
   - `md-icon-button` icon `help` (`aria-label="Help"`).
   - `.avatar` — 36×36 circle, `margin-left: 8px`, background `var(--md-sys-color-primary)`, color `var(--md-sys-color-on-primary)`, Roboto Flex 14px weight 600, centered, `title="Quinntyne Brown"`. Text content: `QB`.

### Responsive
- **1100px / below 880px:** layout unchanged but `.admin-tag` hides (`display: none`).
- **720px:** as above. `main.admin-main` padding shrinks to `24px 20px 96px`.

### Checks
- [ ] Sticky-positioned; remains visible on scroll.
- [ ] Wordmark uses exact `wdth 82 / wght 700` and the slash is italic orange `wdth 92 / wght 500`. (Memory: foot-mark wordmark style is the canonical brand mark — see `MEMORY.md` → "Foot-mark wordmark".)
- [ ] `Admin` chip is filled orange with dark text, uppercase, tight letter-spacing.
- [ ] Three trailing controls in order: notifications icon button, help icon button, avatar `QB`.
- [ ] Avatar is filled orange with dark `QB` initials.
- [ ] At ≤880 px the `Admin` chip is hidden.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/admin-topbar` — composes the brand atom + admin tag + the three trailing controls. Brand atom should match the public nav's brand atom exactly (same `wdth 82 / wght 700`); if it diverges, factor into `components/src/lib/brand`.

---

## 2. `<ps-admin-nav-rail>` — Navigation drawer (Material 3 standard drawer)

Source: `admin-dashboard.html:176-237, 524-560`

### Layout
- Block element, `display: block`.
- **Width:** `--rail-w: 240px` (collapses to 72px below 880 px).
- **Background:** `var(--md-sys-color-surface-container-low)` → `#0A1428`.
- **Border-right:** `1px solid var(--md-sys-color-outline-variant)`.
- **Padding:** `16px 12px`.
- **Position:** sticky `top: var(--topbar-h)`, `height: calc(100vh - 64px)`, `overflow-y: auto`, `overflow-x: hidden`.

### Group 1 — "Manage" (label + 6 nav items)
- `.nav-label` text: `Manage`. Roboto Flex 11px weight 600, `letter-spacing: 0.12em`, uppercase, color `var(--md-sys-color-on-surface-variant)` (`#C5CDE4`), padding `16px 16px 8px`.
- `.nav-item` base: flex row, gap 14px, padding `14px 16px`, `border-radius: 999px`, color `var(--md-sys-color-on-surface-variant)`, font 14px weight 500, `letter-spacing: 0.005em`, cursor pointer.
- `.nav-item .ico` (Material Symbols Outlined): 22px, leading-aligned.
- `.nav-item .label`: flex 1, single-line with ellipsis.
- `.nav-item .badge` (when present): trailing pill, background `var(--md-sys-color-primary)`, color `var(--md-sys-color-on-primary)`, 11px weight 700, padding `2px 10px`, `border-radius: 999px`.
- `.nav-item:hover`: background `color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent)`, color `var(--md-sys-color-on-surface)`.
- `.nav-item.active`: background `var(--md-sys-color-secondary-container)` (`#2A3970`), color `var(--md-sys-color-on-secondary-container)` (`#D8E2FF`), weight 600. The active icon gets `font-variation-settings: 'FILL' 1` (filled glyph).

#### Items (exact, in order)
| Icon | Label | Badge | Active on `/admin` |
|------|-------|-------|--------------------|
| `dashboard` | `Dashboard` | — | **Yes** |
| `menu_book` | `Tutorials` | `12` | no |
| `category` | `Categories` | — | no |
| `sell` | `Tags` | — | no |
| `image` | `Media` | — | no |
| `group` | `Users` | — | no |

> Note: the skeleton's source markup additionally includes `manage_search` → `Audit log` in some variants (e.g. notifications.html line 302). The dashboard render at line 526-533 omits it. Treat the data-driven JS render as canonical for `/admin`.

### `md-divider`
- `style="margin: 20px 8px;"` between groups.

### Group 2 — "Account" (label + 2 nav items)
- `.nav-label` text: `Account`.
- Items in order: `settings` → `Settings`; `logout` → `Sign out`.

### Responsive
- **1100px:** unchanged.
- **≤880px:** `:root { --rail-w: 72px; }`. Padding `12px 8px`. `.nav-label` hidden. `.nav-item` becomes column flex, gap 4px, padding `12px 4px`, font 10px, centered. Badges hidden. `md-divider` margin tightens to `12px 4px`.

### Checks
- [ ] Sticky drawer remains pinned at `top: 64px` on scroll.
- [ ] Group label `Manage` appears uppercase muted Roboto Flex 11px.
- [ ] All 6 Manage items render in the exact order above with the listed Material Symbols glyphs.
- [ ] `Tutorials` item shows the `12` badge in orange pill on the right.
- [ ] Active `Dashboard` item: pill background `#2A3970`, text `#D8E2FF`, weight 600, **filled** `dashboard` glyph.
- [ ] `md-divider` between groups with 20 px / 8 px margins.
- [ ] Account group shows `Settings` then `Sign out`.
- [ ] At ≤880 px: rail collapses to 72 px, labels stack vertically under icons in 10 px, badges and group labels hide.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/admin-nav-rail`. Items should be data-driven (an array of `{ icon, label, badge?, route, active }`). The active state should derive from the Angular router, not hardcoded.

---

## 3. `<main class="admin-main">` — Main content surface

Source: `admin-dashboard.html:242-247`

### Layout
- **Padding:** `32px 40px 96px`.
- **Max-width:** `1480px`, `width: 100%`, `min-width: 0`.
- Background: inherits `var(--md-sys-color-surface)` (`#00000F`).

### Checks
- [ ] Top padding 32 px, side 40 px, bottom 96 px (leaves room for floating FAB).
- [ ] Page content never exceeds 1480 px even on ultrawide displays.
- [ ] At ≤880 px the side padding shrinks to 20 px.

---

## 4. `<header class="page-header">` — Page title row

Source: `admin-dashboard.html:249-276, 617-633`

### Layout
- Flex row, `align-items: flex-end`, `justify-content: space-between`, `gap: 24px`, `margin-bottom: 32px`, `flex-wrap: wrap`.

### Left column
- **`<h1>`:** Roboto Flex weight **400**, **36px**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`. Text: `Dashboard`.
- **`.updated`:** Roboto Flex 14px, color `var(--md-sys-color-on-surface-variant)`, inline-flex gap 10px. Contents:
  - `.pulse` — 8×8 circle, background `var(--md-sys-color-primary)`, `box-shadow: 0 0 0 0 var(--md-sys-color-primary)`, animation `pulse 2s infinite` (keyframes shadow pulses from 0 → 8 px → 0 with orange alpha `0.6 → 0`).
  - Text: `Updated 2 minutes ago · auto-refresh on`.

### Right column (`.actions`)
- Flex row, gap 12 px. Two M3 buttons in this order:
  1. **`md-outlined-button`** — leading `md-icon` `file_download`, label `Export`.
  2. **`md-filled-button`** — leading `md-icon` `add`, label `New tutorial`. (Primary container = orange.)

### Responsive
- **1100px:** unchanged.
- **≤600px:** `.page-header { flex-direction: column; align-items: flex-start; }`.

### Checks
- [ ] `<h1>` reads **`Dashboard`** exactly (not "Admin dashboard"), Roboto Flex 36 px weight 400.
- [ ] Pulse dot animates with a 2-second cycle and emits an orange shadow ring.
- [ ] Updated subtext: `Updated 2 minutes ago · auto-refresh on` (verbatim, with middle-dot separator).
- [ ] Export button is outlined (no fill), New tutorial button is filled orange with dark text.
- [ ] Both buttons have leading icons: `file_download`, `add`.
- [ ] **Live component:** `admin-page-header` (or inline in `admin-dashboard-page`). The `lastUpdated` text should be bound to a `Signal<Date>`. The orange pulse should respect `prefers-reduced-motion`.

---

## 5. `<section class="kpi-row">` — KPI cards

Source: `admin-dashboard.html:279-314, 564-579`

### Layout
- **Grid:** `repeat(4, 1fr)`, `gap: 16px`, `margin-bottom: 24px`.

### Card structure (`.kpi-card`)
- Background `var(--md-sys-color-surface-container)` (`#0F1A30`).
- `border-radius: 16px`, padding 20 px, flex column gap 10 px, transition `background .2s ease`.
- Hover: background `var(--md-sys-color-surface-container-high)` (`#002A54`).
- `.label`: 14 px weight 500, color `var(--md-sys-color-on-surface-variant)`, flex space-between. Trailing `.ico` (Material Symbols Outlined) 22 px, color `var(--md-sys-color-primary)`.
- `.value`: 36 px weight 400, `letter-spacing: -0.02em`, color on-surface, `line-height: 1.1`.
- `.delta`: 13 px weight 500, inline-flex gap 4 px. `.delta.up` → color `#6CCFAE`; `.delta.flat` → `var(--md-sys-color-tertiary)` (`#FFC85C`). Leading `.ico` 16 px: `trending_up` if up, `remove` if flat.

### Four KPI cards (exact content, in order)
| # | Icon | Label | Value | Delta | Trend |
|---|------|-------|-------|-------|-------|
| 1 | `menu_book` | `Tutorials` | `412` | `+8 this week` | up |
| 2 | `edit_note` | `Drafts` | `23` | `5 awaiting review` | flat |
| 3 | `group` | `Authors` | `14` | `+1 this month` | up |
| 4 | `visibility` | `Views · 30d` | `128.4K` | `+12.3%` | up |

### Responsive
- **≤1200px:** grid → `repeat(2, 1fr)`.
- **≤600px:** grid → `1fr`.

### Checks
- [ ] Four cards in the order/values listed above.
- [ ] Trailing icon top-right of each label row, color primary orange.
- [ ] Value typography: 36 px weight 400, negative letter-spacing.
- [ ] Card 4 delta uses **mint** `#6CCFAE`; card 2 uses **gold** `#FFC85C`; the rest use mint.
- [ ] Hover lifts background to `#002A54`.
- [ ] At ≤1200 px the row reflows to 2-col; at ≤600 px single col.
- [ ] **Live component:** `kpi-card` atom in `components/src/lib/kpi-card` plus a `kpi-row` arranger. If the cards are inlined in the page template, refactor into the atom and feed an array.

---

## 6. `<section class="content-row">` — Recent activity + Quick actions

Source: `admin-dashboard.html:317-323, 637-685`

### Layout
- **Grid:** `1.4fr 1fr`, `gap: 24px`, `margin-bottom: 24px`.

### Card 6a — Recent activity (left, `.card`)

#### Card chrome (shared by both)
- Background `var(--md-sys-color-surface-container)`, `border-radius: 16px`, `overflow: hidden`.
- `.card-head` — padding `20px 24px 12px`, flex space-between, gap 16 px.
- `.card-head h2` — Roboto Flex 18 px weight 500, `letter-spacing: 0`, margin 0.
- `.card-body` — padding `4px 0 16px`.

#### Header
- `<h2>` text: `Recent activity`.
- Trailing `md-text-button` label: `View all`.

#### `.activity-list` (6 items)
Grid per item: `36px 1fr auto`, gap 16 px, padding `12px 24px`. Hover background `var(--md-sys-color-surface-container-high)`.
- `.avatar-sm` 36×36, background secondary-container, color on-secondary-container, font 13 px weight 600.
- `.text` 14 px on-surface, `line-height: 1.4`. `b` bold. `.ent` color primary orange, weight 500.
- `.time` 12 px on-surface-variant, `white-space: nowrap`.

#### Six items (exact, in order)
| Avatar | Text (rendered with bold name + orange entity) | Time |
|--------|-----------------------------------------------|------|
| `AC` | **Alex Chen** published *Wiring MediatR into a Clean Architecture API* | `2 min ago` |
| `JR` | **Jamie Ruiz** edited *RBAC, properly* | `34 min ago` |
| `QB` | **Quinntyne Brown** reviewed *EF Core 9 migrations under load* | `1 hr ago` |
| `SL` | **Sam Lee** uploaded *azure-gateway-diagram.svg* | `3 hr ago` |
| `PT` | **Pat Thakur** created category *Aspire* | `Yesterday` |
| `AC` | **Alex Chen** archived *Old Identity Server tutorial* | `Yesterday` |

### Card 6b — Quick actions (right, `.card`)

#### Header
- `<h2>` text: `Quick actions`.
- Trailing `.sub` (13 px on-surface-variant): `Common admin tasks`.

#### Body
- `<md-list>` with four `<md-list-item type="button">` rows, each separated by `<md-divider>`.

#### Four list items (exact)
| Leading icon | Headline | Supporting text | Trailing icon |
|--------------|----------|-----------------|---------------|
| `post_add` | `New tutorial` | `Create a step-by-step guide` | `chevron_right` |
| `category` | `New category` | `Group tutorials by Microsoft tech` | `chevron_right` |
| `upload_file` | `Upload media` | `Images and assets` | `chevron_right` |
| `person_add` | `Assign role` | `Editor / Admin permissions` | `chevron_right` |

> Body padding override on this card: `<div class="card-body" style="padding: 0 0 12px;">`.

### Responsive
- **≤1200px:** grid → `1fr` (stacks).

### Checks
- [ ] Activity card occupies the wider (1.4fr) column on desktop.
- [ ] Six activity rows in the exact order/wording above, with bold name and orange entity span.
- [ ] Each activity row has avatar initials matching the table.
- [ ] Times use ` min ago` / ` hr ago` / `Yesterday` formats exactly.
- [ ] Quick actions list has four rows, each with the specified leading + trailing icons, separated by `md-divider`.
- [ ] Headline and supporting text wording is verbatim.
- [ ] At ≤1200 px the two cards stack to one column.
- [ ] **Live components:** `activity-feed` (consuming an `ActivityItem[]`) and `quick-actions-list`. Both should live in `domain/admin`. The `.ent` orange highlighting should be a child component or directive — avoid raw `innerHTML` injection in Angular.

---

## 7. `<section class="card">` — Recent edits table

Source: `admin-dashboard.html:379-424, 687-710`

### Card chrome
- Same `.card` chrome as section 6.

### Card header
- `<h2>` text: `Recent edits`.
- Trailing `md-text-button` with `trailing-icon` slot: label `View all tutorials`, trailing `md-icon` `arrow_forward`.

### Table (`.edits-table`)
- `width: 100%`, `border-collapse: collapse`.
- `<th>`: text-align left, 11 px weight 600, `letter-spacing: 0.08em`, uppercase, color on-surface-variant, padding `14px 24px`, `border-bottom: 1px solid outline-variant`, background `surface-container-low`.
- `<td>`: padding `14px 24px`, 14 px, border-bottom outline-variant, color on-surface. Last row no border.
- `tbody tr:hover`: background `surface-container-high`.

### Columns (header row, exact)
1. `Title`
2. `Category`
3. `Author`
4. `Updated`
5. `Status`
6. (empty — actions column, `width: 1px; padding-right: 12px;`)

### Five rows (exact, in order)
| Title | Cat | Author (av + name) | Updated | Status |
|-------|-----|--------------------|---------|--------|
| Wiring MediatR into a Clean Architecture API | `.NET` | `AC` Alex C. | `2 min ago` | `PUBLISHED` |
| RBAC, properly — claims and policy design | `AZURE` | `JR` Jamie R. | `34 min ago` | `DRAFT` |
| Atomic design for Blazor components | `BLAZOR` | `QB` Quinntyne B. | `1 hr ago` | `DRAFT` |
| EF Core 9 migrations under load | `EF CORE` | `AC` Alex C. | `3 hr ago` | `PUBLISHED` |
| OAuth2 confidential clients, in one sitting | `AUTH` | `SL` Sam L. | `Yesterday` | `PUBLISHED` |

### Cell styling specifics
- `.title-cell`: weight 500.
- `.cat`: 11 px weight 600, `letter-spacing: 0.1em`, uppercase, on-surface-variant (no border on this dashboard variant — borders only appear on the tutorial list page).
- `.author`: inline-flex gap 10 px. `.av` 28×28 circle, secondary-container background, on-secondary-container text, 11 px weight 600.
- `.status` pill: 11 px weight 600, `letter-spacing: 0.06em`, padding `4px 10px`, `border-radius: 999px`.
  - `.status.published` → background `primary-container` (`#4A2F00`), color `on-primary-container` (`#FFDAA8`).
  - `.status.draft` → background `secondary-container`, color `on-secondary-container`.
- Row actions: `md-icon-button` with `more_vert` icon.

### Responsive
- **≤1200px:** layout unchanged but content row above stacks.
- **≤600px:** `.cat` and `.author .name` hidden (avatar still visible).

### Checks
- [ ] Header row reads exactly: Title / Category / Author / Updated / Status / (blank).
- [ ] Five rows render in the order above with verbatim titles.
- [ ] Em-dash in row 2 title is a real em-dash (`—`), not `--`.
- [ ] Status pill colors: PUBLISHED = warm-orange container; DRAFT = periwinkle container.
- [ ] Every row has the trailing `more_vert` icon button right-aligned (column has `width: 1px`).
- [ ] Hover row background = `surface-container-high`.
- [ ] At ≤600 px the Category column and author name (not avatar) are hidden.
- [ ] **Live component:** `recent-edits-table` in `domain/admin`. Rows should consume a `TutorialEdit` model; the status pill is a `pill` atom in `components/src/lib/pill` (variants `published` / `draft` / `archived`).

---

## 8. `<div class="fab-cluster">` — Floating action button

Source: `admin-dashboard.html:427-431, 491-495`

### Layout
- `position: fixed`, `bottom: 32px`, `right: 32px`, `z-index: 40`.
- Flex column, gap 12 px, align flex-end.

### Content
- One `<md-fab variant="primary" label="New tutorial">` with slotted `md-icon` `add`.

### Checks
- [ ] FAB sits 32 px from the bottom and right edges of the viewport.
- [ ] Variant is `primary` → orange container, dark icon.
- [ ] Extended FAB renders `New tutorial` label alongside the icon (`label` attribute is set).
- [ ] FAB never overlaps the page content because `main.admin-main` has 96 px bottom padding.
- [ ] **Live component:** the FAB should live in `admin-shell` (not the page) so it's shared across `/admin/*` routes. Clicking it routes to the new-tutorial dialog/flow.

---

## 9. Page-level visual checks (global)

- [ ] **Color tokens:** every M3 token (`--md-sys-color-*`) maps to the project palette — `primary` is `#FF9800`, `secondary` is `#8AA8FF`, `tertiary` is `#FFC85C`, `surface` is `#00000F`, etc. Verify the Angular app loads these tokens globally (e.g. in `styles.scss` or an `admin-theme.scss` partial).
- [ ] **Typography ref:** `--md-ref-typeface-brand` and `--md-ref-typeface-plain` both point to `'Roboto Flex', system-ui, sans-serif`. M3 typescale (`md-typescale-styles`) is adopted via `document.adoptedStyleSheets` in the skeleton — the Angular app must import equivalent typography styles.
- [ ] **No background gradients here.** Pattern B drops the orange/periwinkle radial glows from Pattern A. Page background is flat `#00000F`.
- [ ] **All `<md-*>` custom elements register** — open DevTools console and ensure no warnings about unknown elements like `<md-filled-button>` (would indicate `@material/web/all.js` is not loaded into the admin bundle).
- [ ] **Material Symbols Outlined** font loads and ligatures resolve (`menu`, `add`, `more_vert`, etc.). If glyphs render as text, the font isn't loaded.

---

## 10. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-dashboard.md`](../../bugs/admin-dashboard.md).
2. Append a new entry using the `DASH-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 11. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Wordmark wrong weight/width | `domain/src/lib/admin/admin-topbar` SCSS + brand atom |
| Admin tag chip wrong color | `domain/src/lib/admin/admin-topbar/admin-topbar.scss` |
| Nav rail items not data-driven | `domain/src/lib/admin/admin-nav-rail/admin-nav-rail.ts` — feed `items: NavItem[]` |
| Active nav item glyph not filled | Ensure `.nav-item.active .ico` applies `font-variation-settings: 'FILL' 1` |
| KPI cards inlined in page | Extract to `components/src/lib/kpi-card` atom |
| Activity entity not orange | Add `.ent` class or `<ps-activity-entity>` atom |
| Status pill colors wrong | `components/src/lib/pill/pill.scss` (variants `published` / `draft` / `archived`) |
| FAB missing or duplicated per route | Move FAB into `admin-shell` template |
| M3 tokens missing | `frontend/projects/promp-sharp/src/styles.scss` — load M3 tokens for admin theme |
| Material Symbols not rendering | Add Google Fonts link for `Material+Symbols+Outlined` in `index.html` |
| Roboto Flex not loading | Add Google Fonts link for `Roboto+Flex` in `index.html` |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-DASH-001-dashboard-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-dashboard/admin-dashboard-desktop.png`; `docs/ui-audit/screenshots/admin-dashboard/admin-dashboard-tablet.png`; `docs/ui-audit/screenshots/admin-dashboard/admin-dashboard-mobile.png`
