# Admin Unsaved Changes Dialog — UI Audit

- **Trigger:** In the Tutorial Editor (`/admin/tutorials/{id}/edit`), make at least one change to a step, then attempt to navigate away — click any nav-rail item, hit the breadcrumb back link, press the browser back button, or close the tab. The route guard intercepts and opens this dialog.
- **Skeleton:** [`docs/skeletons/admin-unsaved-changes-dialog.html`](../../skeletons/admin-unsaved-changes-dialog.html)
- **Pattern:** B (chrome rules per [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md))
- **Bug log:** [`bugs/admin-unsaved-changes-dialog.md`](../../bugs/admin-unsaved-changes-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/admin-unsaved-changes-dialog` (create — invoked by the editor's `CanDeactivate` guard)

---

## How to run this audit

1. Start API + frontend, sign in as editor/sysadmin.
2. Open any tutorial in the editor: `/admin/tutorials/{id}/edit`.
3. Edit a step block (e.g. change the title or add a paragraph), confirm the dirty indicator appears in the page header summary (`Unsaved edits in current step`).
4. Click any nav-rail item (e.g. `Categories`) to trigger the guard → the dialog opens.
5. Open `docs/skeletons/admin-unsaved-changes-dialog.html` in a second tab.
6. Audit at 1440 / 1100 / 720 / 600 px.
7. Verify all three actions: Discard (loses changes, navigates), Keep editing (closes dialog, stays on page), Save and close (saves then navigates).
8. Log gaps in [`bugs/admin-unsaved-changes-dialog.md`](../../bugs/admin-unsaved-changes-dialog.md) using prefix `UNSAVED-DLG-`.

---

## Composition (skeleton lines 314-335)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             (backdrop)
  ├─ <ps-admin-nav-rail>           (backdrop — Tutorials active)
  └─ <main class="admin-main">
       └─ <ps-unsaved-changes-dialog>
             ├─ <div class="flow-underlay">    ← saturate(.85) wrapper around the editor
             │     ├─ .page-header (breadcrumb Admin / Tutorials / Edit, h1 Tutorial editor, summary "Unsaved edits in current step", action Save draft)
             │     └─ section.editor-grid (3-column layout: step outline · step editor · metadata panel — Pattern B editor template)
             └─ <md-dialog class="flow-dialog" open data-auto-open>
                   ├─ slot="headline"  → "Unsaved changes"
                   ├─ slot="content"   → <form .dialog-form>
                   │     ├─ <p>You have changes that are not saved.</p>
                   │     └─ .diff-block
                   │           ├─ <span class="mono">~ title</span>
                   │           ├─ <span class="mono">+ step 14</span>
                   │           └─ <span class="mono">~ metadata.tags</span>
                   └─ slot="actions"   → md-text-button Discard + md-text-button Keep editing + md-filled-button Save and close
```

Backdrop: the tutorial editor (`admin-tutorial-editor.html`) desaturated to 85% (`.flow-underlay`). Important — the user must see *which* editor they're about to leave; the desaturation preserves the editor layout legibility while the dialog grabs focus.

---

## 1. Dialog chrome

Inherits Pattern B. Base 560 px width (no `wide-dialog`).

- **Selector:** `md-dialog.flow-dialog`.
- **Max-width:** `560px`. **Shape:** `20px`. **Container color:** `#161C2C`.
- **Auto-open:** `data-auto-open` (in practice, the route guard triggers `dialog.show()` from within the `CanDeactivate` returning an Observable).
- **Dismissable:** Esc + scrim + the **`Keep editing`** action are all equivalent (treat as "stay on page"). **Important:** dismissing via Esc/scrim must **not** discard changes — it should always behave like Keep editing.

### Checks
- [ ] Dialog renders at 560 px max-width.
- [ ] Esc / scrim-click are equivalent to `Keep editing` — neither destroys unsaved data.
- [ ] Standard Pattern B chrome (color, shape).

---

## 2. `slot="headline"`

- **Exact text:** `Unsaved changes` (sentence case, two words). No icon, no inner wrapper.

### Checks
- [ ] Headline reads exactly `Unsaved changes`.

---

## 3. `slot="content"`

`<form slot="content" method="dialog" class="dialog-form">` — grid, `gap: 16px`.

### 3.1 Lede paragraph
- `<p>You have changes that are not saved.</p>` — **verbatim**.
- Single line at typical viewport widths. Inherits dialog supporting-text color `var(--md-sys-color-on-surface-variant)` (`#C5CDE4`).

### 3.2 Diff block (`.diff-block`)
- Source: skeleton line 209 for style.
- Style: `border: 1px solid var(--md-sys-color-outline-variant)` (`#3A4880`), `border-radius: 10px`, `padding: 14px`, `display: grid; gap: 8px`, `background: var(--md-sys-color-surface-container-low)` (`#0A1428`).
- Children: 3 × `<span class="mono">{diff-line}</span>`.
- Each diff line: Pattern B `.mono` styling (Roboto Flex 12 px, 0.04 em, color `var(--md-sys-color-on-surface-variant)`).
- **Diff conventions (Pattern B):**
  - `~ {path}` — modified field (tilde + space + path). The skeleton shows tilde for both **modified** value and **renamed**; treat tilde as "modified" consistently.
  - `+ {path}` — added field/step.
  - `-` (not shown in skeleton, but live component should support it) — deleted field/step.
- The **path** uses dotted notation for nested fields (e.g. `metadata.tags`).

### Exact diff lines (verbatim from skeleton):
1. `~ title`
2. `+ step 14`
3. `~ metadata.tags`

### Checks
- [ ] Lede paragraph reads exactly `You have changes that are not saved.` (trailing period).
- [ ] Diff block has 1 px outline-variant border, 10 px corner radius, 14 px padding, and a slightly darker `surface-container-low` background to feel like a code block.
- [ ] Diff lines are stacked vertically with 8 px gap.
- [ ] Each line uses Pattern B `.mono` (Roboto Flex 12 px / 0.04 em), **not** uppercase, **not** Plex Mono.
- [ ] The three skeleton lines render verbatim: `~ title`, `+ step 14`, `~ metadata.tags`.
- [ ] In the live component, the diff list is **dynamic** — it reflects the actual dirty form controls of the editor (verify by changing different fields and re-triggering the guard).

---

## 4. `slot="actions"`

**Three buttons** (unusual — most Pattern B dialogs have two). In DOM order:

1. **Discard** — `<md-text-button>Discard</md-text-button>`. Loses unsaved changes and proceeds with the original navigation. Pattern B convention: **do not** apply `.danger-button` styling here even though the action is destructive — the text variant signals "secondary" weight and the explicit `Discard` label is enough. (Compare to `admin-confirm-delete-dialog`, where the destructive action is *primary* and warrants the red filled button.)
2. **Keep editing** — `<md-text-button>Keep editing</md-text-button>`. Closes the dialog without navigating. Equivalent to Esc / scrim-click.
3. **Save and close** — `<md-filled-button>Save and close</md-filled-button>`. Default primary color. Triggers Save then completes the pending navigation on success.

### Layout
- M3 stacks them right-aligned by default. Three buttons may push the row close to the dialog edge; ensure they remain on a single row at the 560 px width. Below 600 px (full-screen) they may wrap — verify the wrap stacks the buttons full-width with the **primary action on top** (Pattern B convention for full-screen dialogs).

### Checks
- [ ] Three buttons in this DOM order: Discard, Keep editing, Save and close.
- [ ] Discard is a **text-button** (not filled, not danger-button).
- [ ] Keep editing is a **text-button**.
- [ ] Save and close is a **filled-button** with default primary color (orange).
- [ ] Labels are verbatim: `Discard`, `Keep editing`, `Save and close` — sentence case, no ampersands.
- [ ] At ≥ 600 px the three buttons fit on a single row.
- [ ] On full-screen mobile the buttons stack full-width with Save and close at the top, Keep editing middle, Discard bottom.

---

## 5. Backdrop behavior

- `.flow-underlay` wraps the entire editor (page header + editor-grid), applying `filter: saturate(.85)`.
- Topbar + nav rail unfiltered.
- Editor grid renders 3 columns: step outline (left card with `02 Requests and handlers` list-item), step block editor (center card with the title field `Requests, handlers and results` + 2 sk-line shimmer placeholders), metadata panel (right card with `Metadata` header + 1 sk-line). All survive desaturation.

### Checks
- [ ] Editor remains mounted and visible (just desaturated).
- [ ] Editor's `Save draft` filled-button in the page header is visible but click-inert behind the scrim.
- [ ] Page-header summary shows `Unsaved edits in current step` (verbatim, sentence case) — confirms the dirty state.
- [ ] M3 scrim covers the whole viewport.

---

## 6. Responsive

- ≤ 1100 px: editor grid collapses to single column behind the scrim (per Pattern B media query line 246 in skeleton).
- ≤ 600 px: dialog goes full-screen. Action buttons stack vertically (see §4).

### Checks
- [ ] Editor grid responds correctly behind the scrim at ≤ 1100 px.
- [ ] Dialog full-screen at ≤ 600 px, with buttons stacked primary-first.

---

## 7. Bug logging procedure

Log every failure in [`bugs/admin-unsaved-changes-dialog.md`](../../bugs/admin-unsaved-changes-dialog.md) using `UNSAVED-DLG-NNN`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Dialog opens but Esc/scrim discards changes | wire Esc/scrim handler to `Keep editing` semantics, not a no-op cancel |
| Diff block missing border / wrong background | `admin-unsaved-changes-dialog.scss` — `.diff-block` styles |
| Diff lines render uppercase or in Plex Mono | use Pattern B shared `.mono` (Roboto Flex 12 px / 0.04 em) |
| Diff lines hard-coded (don't reflect actual dirty fields) | `admin-unsaved-changes-dialog.ts` — accept a `dirtyFields: DiffLine[]` input from the editor |
| Discard styled as danger-button (red) | remove `.danger-button` — Discard is a text-button per Pattern B |
| Buttons overflow at 560 px width | shorten label only if absolutely necessary; otherwise let M3 default action layout handle |
| Mobile full-screen stack order wrong (Discard on top) | media-query CSS in `.mat-dialog-actions` / slot — reverse flex direction so primary is top |
| Guard not firing on tab close | use `beforeunload` + Angular `CanDeactivate` in tandem (browser still prompts independently) |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-UNSAVED-001-unsaved-dialog-composition.md`
- **Verification:** `npx ng build components --configuration development`; `npx ng build domain --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-unsaved-changes-dialog/admin-unsaved-changes-dialog-desktop.png`; `docs/ui-audit/screenshots/admin-unsaved-changes-dialog/admin-unsaved-changes-dialog-tablet.png`; `docs/ui-audit/screenshots/admin-unsaved-changes-dialog/admin-unsaved-changes-dialog-mobile.png`
