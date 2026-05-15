# Admin Tutorial Editor — UI Audit

- **Route:** `/admin/tutorials/:id/edit`
- **Skeleton:** [`docs/skeletons/admin-tutorial-editor.html`](../../skeletons/admin-tutorial-editor.html)
- **Pattern:** B (`@material/web` MD3 components + Roboto Flex / Mona Sans / Material Symbols Outlined, admin shell with sticky top app bar + 240 px left nav rail)
- **Bug log:** [`bugs/admin-tutorial-editor.md`](../../bugs/admin-tutorial-editor.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/admin-tutorial-editor-page`

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
2. Sign in via the public `/signin` page using an OAuth account that maps to a user with the `sysadmin` role (the editor is gated by the admin guard — viewer/editor roles will be redirected). Once signed in, navigate to **Tutorials** in the admin nav rail, pick any tutorial, and click **Edit** to land on `/admin/tutorials/{id}/edit`.
3. Open `docs/skeletons/admin-tutorial-editor.html` directly in a second tab (file:// is fine — the skeleton only needs Google Fonts + the `@material/web` importmap from esm.run).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar). The editor grid collapses to a single column at 1100 px; the nav rail collapses to a 72 px icon-only rail at 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/admin-tutorial-editor.md`](../../bugs/admin-tutorial-editor.md) using ID prefix `EDITOR-`.

---

## Composition (DOM order, from `admin-tutorial-editor.html:264-354`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             ← sticky, z-index 50
  │   ├─ menu md-icon-button
  │   ├─ .brand-row  (Prompt/Sharp + Admin tag)
  │   ├─ .spacer
  │   └─ .top-actions  (Save draft · Publish… · notifications · QB avatar)
  ├─ <div class="admin-layout">    ← grid 240px / 1fr
  │   ├─ <ps-admin-nav-rail>       ← Tutorials = active
  │   └─ <main class="admin-main">
  │       └─ <ps-admin-tutorial-editor>
  │           ├─ <header class="page-header">  (breadcrumb · H1 · summary · Preview)
  │           └─ <section class="editor-grid"> ← 280 / 1fr / 320 three-pane
  │               ├─ <aside class="card pad">          ← Step outline
  │               ├─ <section class="card pad block-stack">  ← Step editor
  │               └─ <aside class="card pad block-stack">    ← Metadata
</ps-admin-shell>
```

Live counterpart: `admin-tutorial-editor-page.ts`. Verify the three-pane grid is rendered via `tutorial-editor-layout` and the panes use `step-outline`, `step-block-editor`, and `tutorial-metadata-panel` respectively (these components already exist under `domain/src/lib/admin/tutorials/`).

---

## 1. `<ps-admin-topbar>` — Sticky top app bar (Pattern B shared chrome)

Source: `admin-tutorial-editor.html:266-275`

### Layout
- **Height:** `var(--topbar-h)` = **64 px**.
- **Position:** `sticky; top: 0; z-index: 50`.
- **Display:** `flex`, `align-items: center`, `gap: 16px`, `padding: 0 12px`.
- **Background:** `var(--md-sys-color-surface-container)` = `#0F1A30`.
- **Border-bottom:** `1px solid var(--md-sys-color-outline-variant)` = `#3A4880`.

### Left cluster
- `<md-icon-button aria-label="Toggle menu"><md-icon>menu</md-icon></md-icon-button>` — Material Symbols Outlined `menu` glyph.
- `.brand-row`: inline-flex, `gap: 12px`, `padding-left: 4px`.
  - `.brand` text: literal `Prompt<span class="slash">/</span>Sharp`. Mona Sans, `font-variation-settings: 'wdth' 82, 'wght' 700`, **22 px**, `letter-spacing: -0.035em`, `line-height: 1`.
  - `.slash`: `color: var(--md-sys-color-primary)` (`#FF9800`), `font-style: italic`, `'wdth' 92, 'wght' 500`.
  - `.admin-tag`: literal text `Admin`. Roboto Flex, **11 px / weight 600**, `letter-spacing: 0.18em`, uppercase, `color: #00000F` on `background: #FF9800`, `padding: 4px 10px`, `border-radius: 4px`.

### `.spacer`
- `flex: 1` — pushes the editor-specific actions to the right.

### `.top-actions` (right cluster — **editor-specific**)
- Inline-flex, `align-items: center`, `gap: 8px`.
- **`<md-outlined-button>Save draft</md-outlined-button>`** — MD3 outlined button, label text `Save draft` (no leading icon, no trailing arrow).
- **`<md-filled-button>Publish&hellip;</md-filled-button>`** — MD3 filled button. Label includes the HTML entity `&hellip;` rendering as `Publish…` (single ellipsis glyph, **not** three periods). Container color `var(--md-sys-color-primary)` (`#FF9800`), label color `var(--md-sys-color-on-primary)` (`#00000F`).
- `<md-icon-button aria-label="Notifications"><md-icon>notifications</md-icon></md-icon-button>`.
- `.avatar`: 36 × 36 circle, `background: #FF9800`, `color: #00000F`, **14 px / weight 600**, content `QB` (initials of `Quinntyne Brown`, sourced from the signed-in user — in production should derive from the user claims).

### Typography
- All chrome text is Roboto Flex except the wordmark (Mona Sans) and icons (Material Symbols Outlined).

### Colors (MD3 token map)
| Element | Token | Hex |
|---|---|---|
| Top bar bg | `--md-sys-color-surface-container` | `#0F1A30` (deep navy) |
| Top bar border | `--md-sys-color-outline-variant` | `#3A4880` |
| Wordmark slash + admin tag bg + avatar bg | `--md-sys-color-primary` | `#FF9800` |
| Admin tag fg + avatar fg | `--md-sys-color-on-primary` | `#00000F` (near-black) |
| Menu / Notifications icons | `--md-sys-color-on-surface-variant` | `#C5CDE4` (periwinkle-ink) |

### Responsive
- **1100 px:** unchanged (top bar layout is single-row flex; the page header below wraps).
- **720 px:** `.admin-tag` is hidden (`display: none`). The brand wordmark + buttons remain. `padding` of `main.admin-main` shrinks from `32px 40px 96px` to `24px 20px 96px`.

### Checks
- [ ] Top bar is exactly 64 px tall and sticky-positioned (verify it stays visible while scrolling the editor body).
- [ ] Wordmark renders Mona Sans condensed-heavy (`wdth 82 / wght 700`), with the `/` italic orange (`wdth 92 / wght 500`). (Memory: foot-mark wordmark style is the canonical brand mark — see `MEMORY.md`.)
- [ ] `Admin` chip is solid orange with near-black 11 px uppercase text, `letter-spacing: 0.18em`.
- [ ] **Save draft** is an `md-outlined-button` (transparent fill + 1 px outline using `--md-sys-color-outline`), label text **exactly** `Save draft`.
- [ ] **Publish…** is an `md-filled-button` with the orange container, label text **exactly** `Publish…` (one ellipsis glyph, indicating that pressing it opens the publish confirm dialog — see `admin-publish-dialog.html`).
- [ ] Save draft sits **before** Publish… in the flex row, with a 8 px gap.
- [ ] Notifications icon-button is present and unread badge logic is wired (the skeleton does not show a count, but the Angular `<ps-notification-bell>` should still render and tick the unread state).
- [ ] Avatar shows the signed-in user's initials (here `QB`), not a placeholder.
- [ ] At 720 px the orange `Admin` chip is hidden but the `Save draft` / `Publish…` buttons remain accessible.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/shared/admin-top-bar` (or the layout-level shell). The editor page must supply its own `Save draft` + `Publish…` slot — verify via projected content (`<ng-content select="[topbar-actions]">`) rather than baking them into the shell.

---

## 2. `<ps-admin-nav-rail>` — Left navigation rail (Pattern B shared chrome)

Source: `admin-tutorial-editor.html:278-310`

### Layout
- **Width:** `var(--rail-w)` = **240 px**.
- **Position:** sticky `top: var(--topbar-h)`, `height: calc(100vh - 64px)`, `overflow-y: auto`, `overflow-x: hidden`.
- **Background:** `var(--md-sys-color-surface-container-low)` = `#0A1428`.
- **Border-right:** `1px solid #3A4880`.
- **Padding:** `16px 12px`.

### Group 1 — `Manage`
- Eyebrow `.nav-label`: literal text `Manage`. **11 px / weight 600**, `letter-spacing: 0.12em`, uppercase, `color: #C5CDE4`, padding `16px 16px 8px`.
- Seven `.nav-item` rows (`flex; gap: 14px; padding: 14px 16px; border-radius: 999px`, **14 px / weight 500**):
  1. `dashboard` · `Dashboard`
  2. `menu_book` · `Tutorials` · badge `12` (**active**)
  3. `category` · `Categories`
  4. `sell` · `Tags`
  5. `image` · `Media`
  6. `group` · `Users`
  7. `manage_search` · `Audit log`
- Icons: Material Symbols Outlined, `font-size: 22px`, `flex: 0 0 auto`. The active item's icon has `font-variation-settings: 'FILL' 1` (filled variant).
- Badge `12` on Tutorials: orange container (`#FF9800`), near-black fg, **11 px / weight 700**, `padding: 2px 10px`, fully rounded.

### Active state — Tutorials
- `background: var(--md-sys-color-secondary-container)` = `#2A3970` (deep periwinkle).
- `color: var(--md-sys-color-on-secondary-container)` = `#D8E2FF`.
- `font-weight: 600`.

### Divider
- `<md-divider style="margin: 20px 8px;">` between the two groups.

### Group 2 — `Account`
- Eyebrow `Account`.
- Two items: `settings` · `Settings`, `logout` · `Sign out`.

### Responsive
- **1100 px:** unchanged.
- **720 px:** `--rail-w: 72px`. `.nav-label` and `.badge` are hidden. Each item becomes `flex-direction: column; gap: 4px; padding: 12px 4px; font-size: 10px; text-align: center` — icon stacks on top of its label.

### Checks
- [ ] Rail is 240 px wide at desktop and sticky against the top bar.
- [ ] Seven items in **Manage** in this exact order: Dashboard, Tutorials (active, badge `12`), Categories, Tags, Media, Users, Audit log.
- [ ] Active item is **Tutorials** (since we're inside the tutorial editor). Background is periwinkle `--secondary-container`; icon is filled (`FILL 1`).
- [ ] Account group below the divider has exactly **Settings** then **Sign out**.
- [ ] Badge `12` on Tutorials is an orange pill (not a count chip in periwinkle).
- [ ] At 720 px the rail collapses to 72 px with icon-over-label stacks and no badges.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/shared/admin-nav-rail` (or wherever the shared rail lives). The active state is driven by the router URL — confirm that `/admin/tutorials/...` paths (including the editor) all light up the `Tutorials` rail item, not `Dashboard`.

---

## 3. `<header class="page-header">` — Editor page header

Source: `admin-tutorial-editor.html:315-322`

### Layout
- `display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap`.
- Two children: an info column (breadcrumb + H1 + summary) and a `.actions` cluster.

### Breadcrumb
- `display: inline-flex; gap: 6px`, **13 px**, `color: #C5CDE4`, `margin-bottom: 8px`.
- Three spans: `Admin`, literal `/`, then `.current` `Tutorials / Edit` (the segment after the slash is the active page).
- `.current`: `color: #FBFFFF; font-weight: 500`.

### H1
- Roboto Flex, **36 px / weight 400**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`.
- Exact text: `Tutorial editor`.

### Summary row
- `font-size: 14px`, `color: #C5CDE4`, `display: flex; gap: 14px; flex-wrap: wrap`.
- Two spans:
  - `Draft saved 38 seconds ago` — should be a live timer driven by the autosave subject in the editor service.
  - `22 steps` — current step count from `step-outline`.

### Actions cluster (right)
- `display: flex; gap: 12px; flex-wrap: wrap; align-items: center`.
- One button: `<md-text-button><md-icon slot="icon">visibility</md-icon>Preview</md-text-button>`. Material `visibility` glyph, label `Preview`.

### Typography
- H1 is Roboto Flex (not Mona Sans on admin headlines — Mona Sans is reserved for the brand wordmark only).

### Colors
- Breadcrumb sep span uses default `color: #C5CDE4` (the parent breadcrumb's color); skeleton does not assign a separate `.sep` color here.
- H1: `--md-sys-color-on-surface` = `#FBFFFF`.

### Responsive
- **1100 px:** unchanged.
- **720 px:** `flex-direction: column; align-items: flex-start` — Preview button drops below the summary.

### Checks
- [ ] Breadcrumb reads exactly `Admin / Tutorials / Edit` with `Tutorials / Edit` as the bold `current` segment.
- [ ] H1 text is **exactly** `Tutorial editor` (lowercase `e` on `editor`, no trailing slug like the tutorial title).
- [ ] Summary row shows the autosave timestamp (e.g., `Draft saved 38 seconds ago`) and the step count (e.g., `22 steps`). Both numbers must be bound to live editor state, not hardcoded.
- [ ] `Preview` is an `md-text-button` (no fill, no outline) with a leading `visibility` icon.
- [ ] Header wraps cleanly at 720 px with Preview moving below the title block.
- [ ] **Live component:** `admin-tutorial-editor-page.html` — header markup may live directly in the page template or in a thin `<ps-editor-page-header>` shell.

---

## 4. Step outline rail (left pane) — `<aside class="card pad">`

Source: `admin-tutorial-editor.html:324-333`

### Layout
- Outer grid cell: column 1 of `.editor-grid` (`280px`).
- `.card`: `background: var(--md-sys-color-surface-container)` = `#0F1A30`, `border-radius: 16px`, `overflow: hidden`.
- `.card.pad`: `padding: 20px`.

### Title
- `<h2>Step outline</h2>`. **18 px / weight 500**, `margin: 0`, default color `#FBFFFF`.

### `<md-list>` (Material Web list)
- Four list items (three step rows + an `Add step` row), with a divider between the steps and the add row.
- Each step row is `<md-list-item type="button">` containing:
  - **start slot** `<md-icon>drag_indicator</md-icon>` — the `drag_indicator` Material Symbols glyph (six-dot drag handle).
  - **headline** text — numbered step:
    - `01 Project shape`
    - `02 Requests and handlers`
    - `03 Validation pipeline`
  - **end slot** present **only on step 01**: `<md-icon>check</md-icon>` — indicates step is marked complete / saved.
- `<md-divider>` between the last step and the Add row.
- Add row: `<md-list-item type="button">` with `<md-icon slot="start">add</md-icon>` and headline `Add step`.

### Typography
- List item headline: MD3 list typography (Roboto Flex 14 px / weight 500). Numeric prefix `01`, `02`, `03` is part of the headline string — confirm zero-padded, two-digit format.

### Colors
- List items: default surface-container background. Hover / focus / pressed states use MD3 `state-layer` opacities on `--md-sys-color-on-surface`.
- `drag_indicator` icon: `--md-sys-color-on-surface-variant` (`#C5CDE4`).
- `check` glyph on step 01: should inherit `--md-sys-color-primary` (`#FF9800`) to signal "saved" — verify whether the live component applies this color or leaves it as default ink.

### Material Web components
- `md-list`, `md-list-item type="button"`, `md-icon`, `md-divider`.

### Interaction
- Each step row should be draggable (the `drag_indicator` is purely visual unless wired). The skeleton does not show an active drag state, but the live `step-outline` must support keyboard reorder (Up/Down) and pointer drag.
- Clicking a step row activates that step in the centre editor pane.
- Clicking `Add step` appends a new empty step and focuses its title input.

### Responsive
- **1100 px:** `.editor-grid` collapses to `1fr` (single column). The outline becomes a horizontal section above the editor.
- **720 px:** unchanged from 1100 px (still stacked single column).

### Checks
- [ ] Title text reads exactly `Step outline`.
- [ ] Three step rows in this order with zero-padded prefixes: `01 Project shape`, `02 Requests and handlers`, `03 Validation pipeline`.
- [ ] Each step row has a leading `drag_indicator` icon (six dots), not a generic handle glyph.
- [ ] Step 01 has a trailing `check` icon; steps 02 and 03 do **not**.
- [ ] An `md-divider` sits between step 03 and the `Add step` row.
- [ ] `Add step` row has a leading `add` (+) icon and headline `Add step`.
- [ ] Drag-and-drop reorders steps and updates the centre pane's focus.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/step-outline` (renders the `md-list`) composed of `step-outline-item` rows. Verify the items use `<md-list-item type="button">`, not a generic `<button>`.

---

## 5. Step editor centre pane — `<section class="card pad block-stack">`

Source: `admin-tutorial-editor.html:334-340`

### Layout
- Centre column of `.editor-grid` (`minmax(0, 1fr)`, with explicit `min-width: 0` via `minmax(0,...)` so long lines wrap).
- `.card.pad`: `padding: 20px`.
- `.block-stack`: `display: grid; gap: 14px`.

### Step title field
- `<md-outlined-text-field label="Step title" value="Requests and handlers"></md-outlined-text-field>`.
- Width fills the centre pane.
- Label `Step title`; current value bound to the active step (here `Requests and handlers`).

### Block stack — four `.block-editor` cards

Each block editor:
- `border: 1px solid var(--md-sys-color-outline-variant)` (`#3A4880`).
- `border-radius: 12px`.
- `padding: 16px`.
- `background: var(--md-sys-color-surface-container-low)` (`#0A1428`).
- First child is a `.pill` chip declaring the block type.

### 5.1 Prose block
- Pill: `<span class="pill">Prose</span>` — default pill style (`background: #2A3970`, `color: #D8E2FF`, **11 px / weight 600**, `letter-spacing: 0.06em`, fully rounded).
- Body: nested `.block-stack` (margin-top 14 px) with two shimmer `<sk-line>` rows at widths **92%** and **76%** (`delay="1"` on the second).
- In production this body is the WYSIWYG / markdown surface — until a rich text editor is wired, the shimmer is acceptable.

### 5.2 Code block
- Pill: `<span class="pill primary">Code</span>` — primary variant (`background: #4A2F00`, `color: #FFDAA8`).
- Mono caption (`<div class="mono" style="margin: 12px 0;">Handlers/CreateTutorialHandler.cs</div>`) — Roboto Flex 12 px, `letter-spacing: 0.04em`, `color: #C5CDE4`. This is the **file path** label.
- Two shimmer lines at **88%** and **62%**.

### 5.3 Image block
- Pill: `<span class="pill">Image</span>` (default variant).
- Body: `<sk-tile>` at `margin-top: 14px` — 16:10 aspect ratio shimmer tile.

### 5.4 Callout block
- Pill: `<span class="pill">Callout</span>`.
- Body: `<md-outlined-text-field label="Callout text" value="Keep transaction boundaries in the pipeline.">` — single-line text field with that exact value.

### Material Web components
- `md-outlined-text-field` (step title + callout text).
- Block-internal toolbars (not in skeleton) should use `md-icon-button` clusters once wired.

### Colors (block pills)
| Block | Pill variant | Container | Foreground |
|---|---|---|---|
| Prose | default `.pill` | `#2A3970` | `#D8E2FF` |
| Code | `.pill.primary` | `#4A2F00` | `#FFDAA8` (warm cream) |
| Image | default | `#2A3970` | `#D8E2FF` |
| Callout | default | `#2A3970` | `#D8E2FF` |

### Responsive
- **1100 px:** centre pane stretches full width below the outline.
- **720 px:** same as 1100 px. Inside the block editors the layout already wraps because their content is single-column.

### Checks
- [ ] Step title field is an `md-outlined-text-field` with label `Step title` and value bound to the active step.
- [ ] Four block editors in this exact order: **Prose, Code, Image, Callout**.
- [ ] Prose pill is the default (periwinkle) variant; Code pill is the orange `.primary` variant; Image and Callout pills are default.
- [ ] Code block shows the file path `Handlers/CreateTutorialHandler.cs` in mono caption above the shimmer lines. The path comes from block metadata in production.
- [ ] Image block contains a 16:10 `sk-tile` placeholder until the media picker is wired.
- [ ] Callout block contains an `md-outlined-text-field` with label `Callout text` and the seed value `Keep transaction boundaries in the pipeline.`.
- [ ] Block cards have a 1 px outline-variant border, 12 px radius, and 16 px padding — not a heavier card style.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/step-block-editor`. Each block type should be a child of `step-block-row` discriminated by `block.kind`. Confirm new block types can be appended via the `+ Add block` affordance (not present in skeleton — likely a footer in the live editor).

---

## 6. Metadata panel (right pane) — `<aside class="card pad block-stack">`

Source: `admin-tutorial-editor.html:341-347`

### Layout
- Right column of `.editor-grid` (`320px`).
- `.card.pad`: `padding: 20px`; `.block-stack`: `display: grid; gap: 14px`.

### Title
- `<h2>Metadata</h2>` — **18 px / weight 500**.

### 6.1 Slug field
- `<md-outlined-text-field label="Slug" value="wiring-mediatr-into-clean-architecture-api"></md-outlined-text-field>`.
- Value is the URL-safe slug for the tutorial; should re-validate on blur against the catalog for collisions.

### 6.2 Categories chip set
- Mono caption above: `<div class="mono" style="margin-bottom: 8px;">Categories</div>` — literal text `Categories`.
- `<md-chip-set>` containing three `<md-filter-chip>`:
  - `label=".NET"` `selected`
  - `label="MediatR"` `selected`
  - `label="Architecture"` (unselected)
- Filter-chip selected state: container `#2A3970`, label `#D8E2FF`, leading `check` icon. Unselected: outline-only.

### 6.3 Difficulty segmented buttons (rendered as chip-set in skeleton)
- Mono caption: `<div class="mono" style="margin-bottom: 8px;">Difficulty</div>`.
- `<md-chip-set>` with three `<md-filter-chip>`:
  - `label="Beginner"` (unselected)
  - `label="Intermediate"` `selected`
  - `label="Advanced"` (unselected)
- Behaves as a single-select segmented control — selecting one deselects the others. (The skeleton uses filter-chips; the live app may swap to `md-radio` or true segmented buttons if MD3 ships them — keep the visual identical: pill chips with checked state.)

### 6.4 Save state readout — `.diff-block`
- `border: 1px solid #3A4880; border-radius: 10px; padding: 14px; background: #0A1428; display: grid; gap: 8px`.
- Two mono lines (Roboto Flex 12 px, `letter-spacing: 0.04em`, `color: #C5CDE4`):
  - `save_state = clean`
  - `last_publish = draft`
- These read as a **machine-style key=value** log line. The values must update live:
  - `save_state` ∈ `clean | dirty | saving | error`.
  - `last_publish` ∈ `draft | <ISO timestamp of last publish>`.

### Material Web components
- `md-outlined-text-field`, `md-chip-set`, `md-filter-chip`.

### Colors
| Element | Token | Hex |
|---|---|---|
| Card bg | `--md-sys-color-surface-container` | `#0F1A30` |
| Diff-block bg | `--md-sys-color-surface-container-low` | `#0A1428` |
| Diff-block border | `--md-sys-color-outline-variant` | `#3A4880` |
| Mono caption fg | `--md-sys-color-on-surface-variant` | `#C5CDE4` |
| Selected chip container | `--md-sys-color-secondary-container` | `#2A3970` |

### Responsive
- **1100 px:** metadata moves below the centre pane (third in the single-column stack).
- **720 px:** unchanged from 1100 px.

### Checks
- [ ] Title text reads exactly `Metadata`.
- [ ] Slug field is an `md-outlined-text-field` with label `Slug` and the current tutorial slug bound to the value.
- [ ] `Categories` caption sits above the chip set as mono caption (not as the field's floating label).
- [ ] Three category chips in the exact order `.NET`, `MediatR`, `Architecture` with `.NET` and `MediatR` selected; chip set is multi-select.
- [ ] `Difficulty` caption above its chip set; three chips in the order `Beginner`, `Intermediate`, `Advanced` with `Intermediate` selected; chip set behaves as single-select.
- [ ] `.diff-block` shows exactly two mono lines `save_state = clean` and `last_publish = draft` (with single spaces around `=`, lowercase keys, snake_case values). Values bind to the autosave state.
- [ ] At 1100 px the metadata pane stacks below the centre editor.
- [ ] **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/tutorial-metadata-panel`. The save-state readout is a small atom — if it currently renders prose like `Saved 38s ago`, swap to the `key = value` mono format from the skeleton.

---

## 7. Page-level visual checks (global)

- [ ] **`:root` MD3 tokens** are defined verbatim from `admin-tutorial-dialog.html` (see the block at `admin-tutorial-editor.html:34-82`). Spot-check `--md-sys-color-primary: #FF9800`, `--md-sys-color-surface: #00000F`, `--md-sys-color-surface-container-high: #002A54`.
- [ ] **Body background** is solid `#00000F` (near-black) — no radial gradient overlay on the admin pages (unlike public `home.md`).
- [ ] **`main.admin-main`** padding is `32px 40px 96px` and `max-width: 1480px`. The 96 px bottom padding leaves room for transient bottom toasts / snackbars.
- [ ] **Card radius** is consistently 16 px on `.card`, 12 px on `.block-editor`, 10 px on `.diff-block`, and 8 px on swatches (verify no drift to 4 / 6 / 20 px).
- [ ] **Three-column editor grid** is exactly `280px minmax(0, 1fr) 320px` with `gap: 20px; align-items: start`.
- [ ] **No custom-element console warnings** — `<ps-admin-shell>`, `<ps-admin-topbar>`, `<ps-admin-nav-rail>`, `<ps-admin-tutorial-editor>` must each be replaced by the matching Angular component (lower-cased with the `ps-` prefix where appropriate, or directly bound via the page template).
- [ ] **Material Web modules load** from the importmap — DevTools should show no 404s on `https://esm.run/@material/web/...`.
- [ ] **Fonts loaded** — `Roboto Flex`, `Mona Sans`, `Material Symbols Outlined`. If any glyph renders as `□` (tofu), the icon font failed.

---

## 8. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-tutorial-editor.md`](../../bugs/admin-tutorial-editor.md).
2. Append a new entry using the `EDITOR-NNN` prefix.
3. Include:
   - The section + check that failed.
   - Expected value (copy from this doc; for skeleton text, copy verbatim).
   - Actual value (from the running app).
   - Suggested fix location (component path).
4. Once fixed, append the commit SHA and mark `resolved`.

## 9. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Top bar `Save draft` / `Publish…` missing or in wrong order | `admin-tutorial-editor-page.html` — projected `[topbar-actions]` slot |
| Wordmark wrong weight/width | shared `admin-top-bar` SCSS — copy `'wdth' 82, 'wght' 700` from skeleton |
| Active nav rail item highlights `Dashboard` instead of `Tutorials` | router-link `routerLinkActive` config on `admin-nav-rail.html` — match `/admin/tutorials/**` |
| Editor grid not three-pane at desktop | `tutorial-editor-layout.scss` — `grid-template-columns: 280px minmax(0,1fr) 320px` |
| Step rows missing `drag_indicator` / numbered prefix | `step-outline-item.html` |
| Step 01 missing trailing `check` glyph | `step-outline-item.ts` — bind `completed` input |
| Block editor pills wrong color (e.g., Code not orange) | `step-block-editor.scss` — `.pill.primary` map |
| Code block missing file-path mono caption | `step-block-row.html` (or a `<ps-code-block-editor>` child) |
| Slug field not validating uniqueness | wire `(blur)` to the catalog service in `tutorial-metadata-panel.ts` |
| Categories chip set not multi-select | confirm `md-filter-chip` not `md-assist-chip` in `tutorial-metadata-panel.html` |
| Difficulty chip set not single-select | wrap selection logic to deselect siblings in `tutorial-metadata-panel.ts` |
| Save-state readout rendering prose ("Saved 38s ago") | refactor to `key = value` mono format in `tutorial-metadata-panel.html` |
| Top bar `Publish…` opens wrong dialog | route to `admin-publish-dialog` component (see `admin-publish-dialog.html` skeleton) |
| Color token drift | `frontend/projects/tokens/_md3-tokens.scss` (or wherever `:root` MD3 tokens live globally) |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-TUTORIAL-EDITOR-001-editor-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-tutorial-editor/admin-tutorial-editor-desktop.png`; `docs/ui-audit/screenshots/admin-tutorial-editor/admin-tutorial-editor-tablet.png`; `docs/ui-audit/screenshots/admin-tutorial-editor/admin-tutorial-editor-mobile.png`
