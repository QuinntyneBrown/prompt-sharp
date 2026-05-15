# Admin Tutorial Dialog — UI Audit

- **Trigger:** Sign in as an editor/sysadmin, navigate to `/admin/tutorials`, click **New tutorial** (in the page header) or the row overflow → **Edit** on any row. The same dialog component renders both flows:
  - Create flow → headline **`New tutorial`**, primary action **`Create draft → open editor`**.
  - Edit flow  → headline **`Edit tutorial`**, primary action **`Save changes`**.
- **Skeleton:** [`docs/skeletons/admin-tutorial-dialog.html`](../../skeletons/admin-tutorial-dialog.html) (shows the **Edit** variant pre-filled with `Wiring MediatR into a Clean Architecture API`)
- **Pattern:** B (Material 3 admin · Roboto Flex + Mona Sans wordmark)
- **Bug log:** [`bugs/admin-tutorial-dialog.md`](../../bugs/admin-tutorial-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/admin-tutorial-dialog`
- **Reference for other Pattern B dialogs:** the chrome / scrim / shape rules below are inherited by every dialog in the admin shell. Sibling dialog docs cross-reference this file rather than re-stating those rules.

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
2. Sign in at `http://localhost:4200/signin` with an account that has the `editor` or `sysadmin` role.
3. Navigate to `/admin/tutorials`.
4. Trigger the dialog two ways and verify both variants:
   - Click the **New tutorial** filled button in the page header → **Create** variant.
   - Open the row overflow on any existing row and pick **Edit** → **Edit** variant (this is the variant pre-filled in the skeleton).
5. Open `docs/skeletons/admin-tutorial-dialog.html` directly in a second tab to compare side-by-side.
6. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar). Below 600 px the dialog must go full-screen with an `X` close button — verify this breakpoint.
7. Walk the checks below in DOM order. Log every gap in [`bugs/admin-tutorial-dialog.md`](../../bugs/admin-tutorial-dialog.md) using ID prefix `TUT-DLG-`.

---

## Composition (skeleton lines 504-601)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>            (backdrop — sticky, z-index 5)
  ├─ <ps-admin-nav-rail>          (backdrop — sticky rail, 240 px desktop / 72 px mobile)
  └─ <main class="admin-main">
       └─ <ps-admin-tutorial-list-mini>   (backdrop — 4 dummy rows, top row highlighted)
  └─ <ps-tutorial-dialog>
       └─ <md-dialog class="tutorial-dialog">
            ├─ slot="headline"   → .dialog-headline (title + close-btn)
            ├─ slot="content"    → <form id="tutorialForm"> .dialog-form
            │     ├─ md-outlined-text-field   "Title"     (required)
            │     ├─ md-outlined-text-field   "Slug"      (leading link icon + supporting text)
            │     ├─ .field-pair (2-col)
            │     │     ├─ md-outlined-select "Category"   (required, 6 options)
            │     │     └─ md-outlined-select "Difficulty" (required, 3 options)
            │     ├─ md-outlined-text-field   "Summary"   (textarea, rows=3)
            │     ├─ md-chip-set              (4 remove-only tags + Add-tag suggestion chip)
            │     └─ .toggles                 (2 toggle-rows)
            │           ├─ Editor's pick   (md-switch, off)
            │           └─ Featured        (md-switch, on)
            └─ slot="actions"    → md-text-button Cancel + md-filled-button Save changes
```

The **backdrop** is the admin tutorial list (4-row mini table). Auditors should verify both the dialog content **and** that the underlying list still renders correctly behind the scrim (M3 dialog provides its own scrim — page content stays mounted and is dimmed via the dialog's `--md-sys-color-scrim` overlay).

Live counterpart: `frontend/projects/domain/src/lib/admin/tutorials/admin-tutorial-dialog/admin-tutorial-dialog.ts` (+ `.html` / `.scss`). It must consume the `admin-tutorial-list-page` as its hosting page so the backdrop renders identically when the dialog is open.

---

## 1. Dialog container (md-dialog chrome)

Source: skeleton lines 277-286, 508

### Geometry / surface
- **Selector:** `md-dialog.tutorial-dialog`.
- **Max-width:** `520px`. **Min-width:** `360px`. **Width:** `calc(100vw - 48px)` — i.e. 24 px gutter on each side, capped at 520 px.
- **Corner radius:** `--md-dialog-container-shape: 20px`.
- **Container color:** `--md-dialog-container-color: #161C2C` (desaturated near-black with a hint of cool — intentionally distinct from `--md-sys-color-surface-container` `#0F1A30` used by the cards behind it so the dialog reads as elevated, but never competes with the orange accent).
- **Headline color:** `var(--md-sys-color-on-surface)` (`#FBFFFF`).
- **Supporting text color:** `var(--md-sys-color-on-surface-variant)` (`#C5CDE4`).
- **Scrim:** default M3 scrim using `--md-sys-color-scrim: #000000` (the dialog supplies it — do **not** add a custom backdrop element). `main.admin-main` is filtered `saturate(0.95)` so the orange in the page beneath reads slightly cooler while the dialog is open.

### Open / dismiss behavior
- The dialog is **non-modal by trap** but dismissable: clicking the scrim, pressing `Esc`, or pressing Cancel closes it (default M3 behavior — no `scrim-click-action=""` / `escape-key-action=""` overrides applied).
- On open: `dialog.show()` is invoked inside `requestAnimationFrame` after `customElements.whenDefined('md-dialog')` resolves — verify the live component awaits the upgrade before showing (Pattern B convention; see skeleton lines 592-600).

### Checks
- [ ] Container is exactly 520 px wide at ≥568 px viewport, 24 px from each viewport edge otherwise.
- [ ] Corner radius 20 px (all four corners) — no half-rounded variants.
- [ ] Container color `#161C2C`, **not** `var(--md-sys-color-surface-container)` (which would render too blue).
- [ ] Page backdrop dims via the M3 scrim — no custom overlay div behind the dialog.
- [ ] Page saturate(0.95) filter on `main.admin-main` while dialog is open.
- [ ] Esc, scrim-click, and Cancel all dismiss the dialog (no modal trap).

---

## 2. `slot="headline"` — Title row

Source: skeleton lines 287-294, 510-515

### Layout
- `<div slot="headline" class="dialog-headline">` — flex row, `align-items: center`, `gap: 8px`.
- Title `<span class="title">` flex-grows (`flex: 1; min-width: 0`).
- Close button `<md-icon-button class="close-btn">` is `display: none` by default and only revealed at the mobile full-screen breakpoint (see §6).

### Typography
- `font-size: 22px`, `font-weight: 500`, `color: var(--md-sys-color-on-surface)`.
- Family: Roboto Flex (inherits from body — Pattern B brand typeface).

### Exact text
- Edit flow → `Edit tutorial`
- Create flow → `New tutorial`

### Checks
- [ ] Headline reads **`Edit tutorial`** (Edit variant) or **`New tutorial`** (Create variant) — no other casing/wording.
- [ ] 22 px, weight 500. **No** material-typography display/headline class baked in.
- [ ] No icon precedes the title text in either variant (close button only appears on mobile).

---

## 3. `slot="content"` — Form fields (`form#tutorialForm.dialog-form`)

Source: skeleton lines 296-328, 517-583

### Form-level layout
- `<form id="tutorialForm" slot="content" method="dialog" class="dialog-form" novalidate>`.
- `.dialog-form`: flex column, `gap: 18px`.
- `method="dialog"` so the Cancel / Save buttons submit the form and the dialog reads `returnValue` — verify the live component listens to `close` / `cancel` events rather than raw click handlers.
- `novalidate` — validation is handled by Angular reactive forms, **not** native HTML5 validation popups.

### 3.1 Title field
- `<md-outlined-text-field label="Title" required value="Wiring MediatR into a Clean Architecture API">`.
- Edit variant pre-fills the value; Create variant renders empty.
- Required indicator: the asterisk is supplied by M3 from the `required` attribute — do not duplicate.

### 3.2 Slug field
- `<md-outlined-text-field label="Slug" value="wiring-mediatr-into-clean-architecture-api" supporting-text="/tutorials/wiring-mediatr-into-clean-architecture-api · available">` with `<md-icon slot="leading-icon">link</md-icon>`.
- **Exact supporting-text (verbatim):** `/tutorials/wiring-mediatr-into-clean-architecture-api · available`. The middle dot is `·` (U+00B7), not `-` or `•`.
- Leading icon: Material Symbols Outlined `link`.
- Slug should auto-derive from Title on input but remain editable (Pattern B convention — slug field has `link` icon to reinforce its URL-ness).

### 3.3 Category + Difficulty pair (`.field-pair`)
- Grid `1fr 1fr`, `gap: 14px` (collapses to single column ≤880 px).
- **Category select** options, in this order: `.NET` (selected), `Blazor`, `Azure`, `EF Core`, `Auth / RBAC`, `Architecture`.
- **Difficulty select** options, in this order: `Beginner`, `Intermediate` (selected), `Advanced`.
- Both `required`.

### 3.4 Summary textarea
- `<md-outlined-text-field label="Summary" type="textarea" rows="3" value="…">`.
- **Exact value (verbatim, Edit variant):** `Vertical-slice handlers, validators and the pipeline behaviors I'd ship to production — without the ceremony or the surprises.`
- The em-dash is `—` (U+2014), the apostrophe in `I'd` is a curly `'` (U+2019).

### 3.5 Tags (`md-chip-set`)
- Four `md-input-chip` with `remove-only` attribute, in order:
  1. `Clean Architecture`
  2. `MediatR`
  3. `CQRS`
  4. `.NET 9`
- Trailing `md-suggestion-chip` labeled `Add tag` with `<md-icon slot="icon">add</md-icon>` (leading `+`).
- `aria-label="Tags"` on the chip-set.

### 3.6 Toggle rows (`.toggles`)
- Container: flex column, `border-top: 1px solid var(--md-sys-color-outline-variant)` (`#3A4880`).
- Each `.toggle-row`: flex `justify-content: space-between`, `gap: 16px`, `padding: 14px 0`, `border-bottom: 1px solid var(--md-sys-color-outline-variant)` (last row has no bottom border).
- Text block: `.t` (title 14 px, weight 500, `--md-sys-color-on-surface`) + `.s` (helper 12 px, `--md-sys-color-on-surface-variant`, `margin-top: 2px`).

Row 1 — **Editor's pick** (switch **off**):
- Title: `Editor's pick`
- Helper: `Promote at the top of the home page`

Row 2 — **Featured** (switch **on** via `selected`):
- Title: `Featured`
- Helper: `Include in the home page grid`

### Checks
- [ ] Form gap is 18 px between every direct child.
- [ ] Title field renders with `required` indicator and pre-fills with the verbatim string in the Edit variant.
- [ ] Slug supporting-text uses the **middle dot** `·` separator and the word `available`, not `Available` / `OK`.
- [ ] Leading `link` icon present on the Slug field (Material Symbols Outlined, not Filled).
- [ ] Field-pair is a 2-column grid at desktop, collapses to single column below 880 px.
- [ ] Category select default value `.NET`; Difficulty select default value `Intermediate`.
- [ ] Summary uses em-dash (`—`) and curly apostrophe (`'`), not `--` or `'`.
- [ ] Four tag chips in the exact order, each removable (`remove-only`), trailing `+ Add tag` suggestion chip.
- [ ] Toggle group has divider lines above the first row and between rows, but **not** after the last row.
- [ ] Default switch states: Editor's pick = **off**, Featured = **on**.
- [ ] **Live component fields** are bound through Angular reactive forms — the Save button is disabled until the form is valid + dirty (Pattern B convention).

---

## 4. `slot="actions"` — Footer buttons

Source: skeleton lines 585-588

### Layout
- `<div slot="actions">` — M3 stacks the buttons right-aligned, with the primary on the far right.
- Order in DOM: Cancel first, Save changes second.

### Buttons
- **Cancel** — `<md-text-button form="tutorialForm" value="cancel">Cancel</md-text-button>`. No icon. Submits the form with `value="cancel"` so the close handler can skip validation/save.
- **Save changes** (Edit variant) — `<md-filled-button form="tutorialForm" value="save">Save changes</md-filled-button>`.
- **Create draft → open editor** (Create variant) — same button atom, label changes. After successful POST the live component must navigate to `/admin/tutorials/{id}/edit`.

### Checks
- [ ] Two buttons total, right-aligned, with Cancel as text variant and Save as filled.
- [ ] Filled button uses default primary container color (orange `#FF9800` background, `#00000F` label) — do **not** apply `.danger-button` class here.
- [ ] Edit variant label is exactly `Save changes`; Create variant label is exactly `Create draft → open editor` (with `→` U+2192, not `-->`).
- [ ] Both buttons use `form="tutorialForm"` and submit via `method="dialog"` (no manual click→close glue).

---

## 5. Backdrop behavior (page beneath the dialog)

Source: skeleton lines 330-332, 387-502

### What renders behind the scrim
- The `admin-tutorial-list-mini` page is fully rendered:
  - Topbar (`Prompt/Sharp` wordmark + orange `Admin` tag pill, notifications/help icons, `QB` avatar).
  - Nav rail with `Tutorials` (badge `12`) active.
  - Page header: breadcrumb `Admin / Tutorials`, h1 `Tutorials`, summary `412 total · 23 drafts`, actions `Export` (outlined) + `New tutorial` (filled).
  - Card table with 4 rows; the first row (`Wiring MediatR into a Clean Architecture API`) is `.highlight` — primary-tinted background with a 1 px primary outline to indicate "this is the row being edited".

### Scrim treatment
- M3 default scrim — translucent black overlay.
- `main.admin-main` gets `filter: saturate(0.95)` (subtle desaturation, **not** blur).
- The nav rail and topbar are **not** filtered — they remain crisp because they sit outside `.admin-main`.

### Checks
- [ ] The list page beneath remains fully laid out (no white flash, no remount).
- [ ] The row matching the tutorial being edited has the `.highlight` background + outline.
- [ ] Topbar and nav rail are not desaturated/blurred.
- [ ] Scrim covers the entire viewport including the topbar and rail (M3 default — verify the dialog is not nested inside a stacking context that clips it).

---

## 6. Responsive

Source: skeleton lines 334-367

### ≤ 880 px
- Nav rail collapses to 72 px icon-only mode (handled by the shell, not the dialog).
- `.field-pair` becomes single column (Category and Difficulty stack).
- Padding on `main.admin-main` reduces to `24px 20px 96px`.

### ≤ 600 px — Full-screen dialog (M3 fullscreen spec)
- `md-dialog.tutorial-dialog` styles override:
  - `max-width: 100vw`, `width: 100vw`, `min-width: 0`.
  - `height: 100vh` then `100dvh` (dynamic viewport — accounts for mobile chrome).
  - `max-height: 100dvh`, `margin: 0`, `--md-dialog-container-shape: 0`.
- `.dialog-headline .close-btn` becomes `display: inline-flex` — the `X` (`md-icon close`) icon-button appears in the top-left of the headline as the exit affordance.
- Form scrolls inside the dialog body; the actions slot remains pinned at the bottom.

### Checks
- [ ] At 880 px the Category/Difficulty pair stacks vertically.
- [ ] At 600 px exactly the dialog snaps to edge-to-edge full-screen (no margin, no rounded corners).
- [ ] At 600 px the `X` close button is visible to the left of the title in the headline slot.
- [ ] On mobile Safari/Chrome the dialog uses `100dvh` so it doesn't get clipped by the URL bar.

---

## 7. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-tutorial-dialog.md`](../../bugs/admin-tutorial-dialog.md).
2. Append a new entry using the `TUT-DLG-NNN` prefix.
3. Include:
   - The section + check that failed (e.g. "§3.5 Tags · 4th chip label").
   - Expected value (copy verbatim from this doc).
   - Actual value (from the running app).
   - Suggested fix location (component path).
4. Once fixed, append the commit SHA and mark `resolved`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Container color too blue / wrong shape | `admin-tutorial-dialog.scss` — `--md-dialog-container-color`, `--md-dialog-container-shape` |
| Headline missing / wrong text per variant | `admin-tutorial-dialog.ts` — `mode: 'create' \| 'edit'` input drives headline |
| Slug supporting-text formatting drift | `admin-tutorial-dialog.html` — `supporting-text` binding (live + availability check) |
| Category / Difficulty select options wrong order or labels | `admin-tutorial-dialog.ts` — option arrays |
| Toggle defaults wrong (Featured should default **on**) | `admin-tutorial-dialog.ts` — form initial state |
| Cancel/Save not closing the dialog | check `method="dialog"` + `form="tutorialForm"` on buttons, and that `(close)` handler reads `returnValue` |
| Field-pair not stacking ≤880 px | `admin-tutorial-dialog.scss` — `.field-pair` media query |
| Mobile dialog not going full-screen | `admin-tutorial-dialog.scss` — `@media (max-width: 600px)` block missing |
| Close (X) not appearing on mobile | `.close-btn` `display: inline-flex` inside the 600 px media query |
| Backdrop list not mounted behind the dialog | `admin-tutorial-list-page.html` — render the dialog as a child so the list stays in the DOM tree |
| Color token drift | `frontend/projects/tokens/_colors.scss` and `_md-sys.scss` |
