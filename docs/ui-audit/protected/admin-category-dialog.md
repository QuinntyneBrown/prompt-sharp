# Admin Category Dialog — UI Audit

- **Trigger:** Sign in as sysadmin → navigate to `/admin/categories` → click **New category** in the page header (Create variant), or click the row overflow → **Edit** on any category row (Edit variant). Same component, headline & primary action swap by mode.
- **Skeleton:** [`docs/skeletons/admin-category-dialog.html`](../../skeletons/admin-category-dialog.html) (shows the **Create** variant prefilled with sample values).
- **Pattern:** B (chrome rules per [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md))
- **Bug log:** [`bugs/admin-category-dialog.md`](../../bugs/admin-category-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/taxonomy/admin-category-dialog` (create — sibling to `admin-taxonomy-table`)

---

## How to run this audit

1. Start API + frontend, sign in as sysadmin.
2. Go to `/admin/categories`, click **New category** (Create), then re-open via row overflow → **Edit** for the second pass.
3. Open `docs/skeletons/admin-category-dialog.html` in a second tab.
4. Audit at 1440 / 1100 / 720 / 600 px.
5. Verify slug auto-derivation on the name field, color swatch single-select behavior, and icon button single-select behavior.
6. Log gaps in [`bugs/admin-category-dialog.md`](../../bugs/admin-category-dialog.md) using prefix `CAT-DLG-`.

---

## Composition (skeleton lines 314-332)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             (backdrop)
  ├─ <ps-admin-nav-rail>           (backdrop — Categories active)
  └─ <main class="admin-main">
       └─ <ps-category-dialog>
             ├─ <header class="page-header">   ← NO .flow-underlay wrapper here
             │     (breadcrumb Admin / Categories, h1 Categories and tags, summary 18 categories, action New category)
             └─ <md-dialog class="flow-dialog wide-dialog" open data-auto-open>
                   ├─ slot="headline"  → "New category" (Create) or "Edit category" (Edit)
                   ├─ slot="content"   → <form .dialog-form>
                   │     ├─ md-outlined-text-field "Name"        (value ".NET API Foundations")
                   │     ├─ md-outlined-text-field "Slug"        (value "dotnet-api-foundations", supporting-text "Auto-derived from name")
                   │     ├─ md-outlined-text-field "Description" (textarea, rows=3)
                   │     ├─ <div>
                   │     │     ├─ <div class="mono">Color</div>
                   │     │     └─ .swatches > 8 × .swatch
                   │     └─ <div>
                   │           ├─ <div class="mono">Icon</div>
                   │           └─ 4 × md-icon-button (api, code, cloud, security)
                   └─ slot="actions"   → md-text-button Cancel + md-filled-button Create (or Save in Edit mode)
```

**Important divergence from the tutorial/delete/publish dialogs:** the backdrop here is **not** wrapped in `.flow-underlay` (no `filter: saturate(.85)`). The categories list is rendered crisply behind the scrim. This is intentional — the categories page is information-light enough that the M3 scrim alone provides sufficient focus.

---

## 1. Dialog chrome

Inherits Pattern B (see [`admin-tutorial-dialog.md §1`](./admin-tutorial-dialog.md#1-dialog-container-md-dialog-chrome)) **with the `wide-dialog` modifier**:

- **Selector:** `md-dialog.flow-dialog.wide-dialog`.
- **Max-width:** `720px` (skeleton line 222 — `wide-dialog` overrides the base 560 px). **Width:** `calc(100vw - 48px)`.
- **Shape:** `20px`. **Container color:** `#161C2C`.
- **Auto-open:** `data-auto-open`. **Dismissable:** Esc + scrim + Cancel.

### Checks
- [ ] Container max-width 720 px (not 560 px) — the form is wide enough to host the 8-tile swatch row without wrapping.
- [ ] Same 20 px corner radius and `#161C2C` container color as the other Pattern B dialogs.

---

## 2. `slot="headline"`

- **Create variant text (verbatim):** `New category`.
- **Edit variant text (verbatim):** `Edit category`.
- Plain `<div slot="headline">`, no icon, no inner wrapper.

### Checks
- [ ] Headline swaps cleanly between `New category` and `Edit category` based on the `mode` input.

---

## 3. `slot="content"`

`<form slot="content" method="dialog" class="dialog-form">` — grid, `gap: 16px`.

### 3.1 Name field
- `<md-outlined-text-field label="Name" value=".NET API Foundations">`.
- Label text exactly `Name`. Sample value `.NET API Foundations` (note the leading `.` — this is real category data, not a typo).
- No leading icon. Edits to this field should **auto-derive** the Slug field unless the user has manually overridden the slug (Pattern B convention — once the user types in the Slug field, stop auto-syncing).

### 3.2 Slug field
- `<md-outlined-text-field label="Slug" value="dotnet-api-foundations" supporting-text="Auto-derived from name">`.
- **Label:** `Slug`. **Sample value:** `dotnet-api-foundations` (lowercase, hyphenated, no leading dot — the slugifier strips it).
- **Supporting text (verbatim):** `Auto-derived from name` (sentence case, no period, no special punctuation).
- Supporting-text color: `var(--md-sys-color-on-surface-variant)` (Pattern B default supporting-text color).
- No leading icon (unlike `admin-tutorial-dialog`, which has the `link` icon — categories don't need it).

### 3.3 Description textarea
- `<md-outlined-text-field label="Description" type="textarea" rows="3" value="API tutorials for production .NET services.">`.
- **Label:** `Description`. **Sample value (verbatim):** `API tutorials for production .NET services.` (single sentence, trailing period).
- 3 rows visible; M3 textarea grows to a maximum height before scrolling internally.

### 3.4 Color swatch picker
- Caption: `<div class="mono" style="margin-bottom: 8px;">Color</div>` — exact text `Color`. Pattern B `.mono` styling (Roboto Flex 12 px / 0.04 em).
- Container: `<div class="swatches">` — `display: flex; gap: 8px; flex-wrap: wrap` (skeleton line 229).
- 8 × `<span class="swatch" style="--c:#…">` tiles in this **exact** order:
  1. `#FF9800` — primary orange
  2. `#8AA8FF` — secondary periwinkle
  3. `#FFC85C` — tertiary gold
  4. `#6CCFAE` — moss (custom)
  5. `#FFB4AB` — error
  6. `#D8E2FF` — on-secondary-container
  7. `#003E80` — surface-container-highest navy
  8. `#FBFFFF` — on-surface white
- Each tile: `width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--md-sys-color-outline-variant); background: var(--c)` (skeleton line 230).
- **Selection behavior:** single-select. The live component must add a selected-state ring (Pattern B convention: 2 px primary-color outline + 2 px inset offset) to whichever tile is active. Skeleton ships **no** default selection — verify the live component selects whatever the row's current color is (or the first swatch for Create).

### 3.5 Icon picker
- Caption: `<div class="mono" style="margin-bottom: 8px;">Icon</div>` — exact text `Icon`.
- Container: parent `<div>` only (no special class). Children are 4 × `<md-icon-button>` in a row.
- Material Symbols Outlined icons in this order: `api`, `code`, `cloud`, `security`.
- **Selection behavior:** single-select toggle group. Live component should render the selected icon with `font-variation-settings: 'FILL' 1` (Material Symbols filled axis) the way the nav rail's active item does (skeleton line 155 pattern). Skeleton ships no default selection.

### Checks
- [ ] Form has 5 children in this order: Name, Slug, Description, Color block, Icon block. 16 px gap between each.
- [ ] Name and Slug labels are exactly `Name` and `Slug` (no `Category name`, no `URL slug`).
- [ ] Slug supporting-text reads **`Auto-derived from name`** — verbatim, no period.
- [ ] Slug auto-syncs from Name input until the user manually edits Slug; then auto-sync turns off for the remainder of the session.
- [ ] Description sample value ends with the period.
- [ ] 8 color tiles in the exact hex order listed above, 30 × 30 px, 8 px gap, 8 px border-radius, 1 px outline-variant border.
- [ ] Color picker is single-select with a visible active-ring on the chosen tile.
- [ ] 4 icon buttons in order `api`, `code`, `cloud`, `security`. Each is an `md-icon-button`, single-select, active icon renders filled.
- [ ] Color and Icon block captions both use the Pattern B `.mono` style (Roboto Flex 12 px, 0.04 em) with 8 px `margin-bottom`.

---

## 4. `slot="actions"`

- **Cancel** — `<md-text-button>Cancel</md-text-button>`.
- **Create / Save** — `<md-filled-button>Create</md-filled-button>` in Create mode; the same button reads **`Save`** in Edit mode.
- Default M3 primary color (orange). Not destructive.

### Checks
- [ ] Two buttons right-aligned: Cancel (text) then Create/Save (filled).
- [ ] Create label is exactly `Create` (one word). Edit-mode label is exactly `Save` — **not** `Save changes` (different from `admin-tutorial-dialog`'s "Save changes" — categories are leaf objects with no editor view to navigate to afterwards, so the shorter label is intentional).
- [ ] Primary button disabled until name + at least one color + one icon are selected (validation rules — confirm with PM if uncertain).

---

## 5. Backdrop behavior

- **No `.flow-underlay` wrapper** — the categories list page beneath the dialog is **not** desaturated.
- Topbar + nav rail render normally; nav rail has `Categories` active (skeleton lines 289-291).
- Page header is fully visible: breadcrumb `Admin / Categories`, h1 `Categories and tags`, summary `18 categories`, action `New category` filled-button.
- M3 default scrim only.

### Checks
- [ ] Page beneath the dialog is **not** desaturated.
- [ ] `New category` button in the page header is still clickable in markup but obscured by the scrim — verify the dialog is the only focus trap.
- [ ] Page h1 reads `Categories and tags` (the section covers both categories and tags, not categories alone).

---

## 6. Responsive

Inherits Pattern B. Specifics:
- ≤ 1100 px: form remains single-column (no `.field-pair` in this dialog).
- ≤ 600 px: dialog goes full-screen edge-to-edge; the 8 swatches wrap onto two rows because the container narrows (the `flex-wrap` is in place from the start).
- ≤ 600 px: the 4 icon buttons stay in a single row (small enough to fit).

### Checks
- [ ] Swatch row wraps to two rows of four below ~360 px.
- [ ] Icon row remains horizontal at all viewport widths.

---

## 7. Bug logging procedure

Log every failure in [`bugs/admin-category-dialog.md`](../../bugs/admin-category-dialog.md) using `CAT-DLG-NNN`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Dialog renders at 560 px (too narrow) | apply both `flow-dialog` and `wide-dialog` classes |
| Slug doesn't auto-sync from Name | `admin-category-dialog.ts` — `nameControl.valueChanges` → slugifier |
| Slug supporting-text shows different copy | template — `supporting-text="Auto-derived from name"` |
| Swatches in wrong color order or wrong hex | component config array — keep the 8 tokens listed in §3.4 in order |
| Swatch picker allows multi-select | `(click)` handler must clear other selections |
| Selected swatch has no visible ring | `.swatch.selected` SCSS — add 2 px primary-color outline |
| Active icon doesn't fill | bind `[class.filled]` and apply `font-variation-settings: 'FILL' 1` |
| Primary button label says `Save changes` instead of `Save` in Edit mode | `admin-category-dialog.ts` — switch label by `mode` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-CATEGORY-DIALOG-001-category-dialog-composition.md`
- **Verification:** `npx ng build components --configuration development`; `npx ng build domain --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-category-dialog/admin-category-dialog-desktop.png`; `docs/ui-audit/screenshots/admin-category-dialog/admin-category-dialog-tablet.png`; `docs/ui-audit/screenshots/admin-category-dialog/admin-category-dialog-mobile.png`
