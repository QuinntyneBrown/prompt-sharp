# Admin Confirm Delete Dialog — UI Audit

- **Trigger:** Sign in as editor/sysadmin → navigate to `/admin/tutorials` → open the overflow menu (`more_vert`) on any row → click **Delete**. The dialog also opens from the Tutorial Editor toolbar (`Delete tutorial`) and from any other destructive action that asks for confirmation.
- **Skeleton:** [`docs/skeletons/admin-confirm-delete-dialog.html`](../../skeletons/admin-confirm-delete-dialog.html)
- **Pattern:** B (Material 3 admin — chrome rules per [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md))
- **Bug log:** [`bugs/admin-confirm-delete-dialog.md`](../../bugs/admin-confirm-delete-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/admin-confirm-delete-dialog` (create — sibling to `admin-tutorial-dialog`)

---

## How to run this audit

1. Start API + frontend (see [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md#how-to-run-this-audit) for commands).
2. Sign in as editor/sysadmin, go to `/admin/tutorials`.
3. Click the `more_vert` overflow on any tutorial row → **Delete** menu item.
4. Open `docs/skeletons/admin-confirm-delete-dialog.html` in a second tab to compare.
5. Audit at 1440 / 1100 / 720 / 600 px. Below 600 px the dialog goes full-screen per Pattern B conventions (see `admin-tutorial-dialog.md §6`).
6. Log gaps in [`bugs/admin-confirm-delete-dialog.md`](../../bugs/admin-confirm-delete-dialog.md) using prefix `DEL-DLG-`.

---

## Composition (skeleton lines 314-345)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             (backdrop)
  ├─ <ps-admin-nav-rail>           (backdrop — Tutorials active, badge 12)
  └─ <main class="admin-main">
       └─ <ps-confirm-delete-dialog>
             ├─ <div class="flow-underlay">   ← saturate(.85) wrapper, contains the list
             │     ├─ .page-header (breadcrumb Admin / Tutorials, h1 Tutorials, summary 412 total / 23 drafts, action New tutorial)
             │     └─ section.card.table-wrap > .data-table (3 rows: MediatR/.NET/PUBLISHED, RBAC/AZURE/DRAFT, Atomic/BLAZOR/DRAFT)
             └─ <md-dialog class="flow-dialog" open data-auto-open>
                   ├─ slot="headline"  → "Delete tutorial?"
                   ├─ slot="content"   → <form .dialog-form>
                   │     ├─ <p>Delete <strong>{title}</strong> from the catalog?</p>
                   │     └─ <div class="mono">This cannot be undone.</div>
                   └─ slot="actions"   → md-text-button Cancel + md-filled-button.danger-button Delete
```

The **backdrop** is `admin-tutorial-list.html` desaturated to 85% (`.flow-underlay` wrapper). The dialog is presented over the list so the user can still see the row context behind the scrim.

---

## 1. Dialog chrome

Selectors / shape / scrim — inherit from Pattern B base. See [`admin-tutorial-dialog.md §1`](./admin-tutorial-dialog.md#1-dialog-container-md-dialog-chrome). Specifics for this dialog:

- **Selector:** `md-dialog.flow-dialog` (no `wide-dialog` modifier — uses the **560 px** narrow width).
- **Max-width:** `560px` (skeleton line 218). **Width:** `calc(100vw - 48px)`.
- **Shape:** `--md-dialog-container-shape: 20px`.
- **Container color:** `--md-dialog-container-color: #161C2C`.
- **Auto-open:** `data-auto-open` attribute fires `dialog.show()` on `customElements.whenDefined('md-dialog')` (skeleton lines 402-408). The live component must call `show()` once when navigated to.
- **Dismiss:** Esc + scrim-click + Cancel all close (no `scrim-click-action` / `escape-key-action` overrides). The dialog **must not** be modal — destructive confirmations should always offer a cheap escape.

### Checks
- [ ] Container 560 px wide max, 24 px gutter on narrow viewports.
- [ ] Corner radius 20 px on all corners.
- [ ] Container color `#161C2C`.
- [ ] Esc, scrim-click and Cancel all dismiss with no save.

---

## 2. `slot="headline"`

Source: skeleton line 339

- **Exact text (verbatim):** `Delete tutorial?` (sentence case, question mark included).
- Rendered inside a plain `<div slot="headline">` — no inner span/icon wrapper.
- M3 supplies the typography (24 px, weight 400 by default). Do **not** apply a custom `.dialog-headline` flex container here — this dialog has no leading icon and no mobile close-X (it's small enough that mobile full-screen still fits without a redundant close affordance, since Cancel + scrim dismissal are both reachable).

### Checks
- [ ] Headline reads exactly `Delete tutorial?` (no `Confirm delete`, no exclamation, no trailing period).
- [ ] No icon, no close-X next to the title.
- [ ] Question mark is ASCII `?`, not `？`.

---

## 3. `slot="content"` — Confirmation body

Source: skeleton line 341

### Layout
- `<form slot="content" method="dialog" class="dialog-form">`.
- `.dialog-form`: grid, `gap: 16px` (skeleton line 223). Two children:
  1. Paragraph (`<p>`) with the tutorial name in `<strong>`.
  2. Mono secondary `<div class="mono">`.

### 3.1 Confirmation paragraph
- **Exact text (skeleton, tutorial="Wiring MediatR into a Clean Architecture API"):**
  > `Delete `**`Wiring MediatR into a Clean Architecture API`**` from the catalog?`
- The tutorial title is wrapped in `<strong>` (default bold weight via Roboto Flex variable axis). The rest of the sentence is the dialog's `--md-dialog-supporting-text-color` (`#C5CDE4`).
- The `<strong>` text inherits `--md-sys-color-on-surface` (`#FBFFFF`) for emphasis contrast.
- Tutorial name is interpolated from the row being deleted — verify the live component truncates with ellipsis (CSS `text-overflow`) only after wrapping for at least 2 lines (Pattern B convention; never truncate to a single line in a confirmation body).

### 3.2 Mono secondary line
- **Exact text (verbatim):** `This cannot be undone.`
- Class `.mono`: `font-family: 'Roboto Flex'` (the Pattern B `.mono` is **Roboto Flex** with `letter-spacing: 0.04em` — *not* IBM Plex Mono; that's Pattern A only). See skeleton line 99.
- `font-size: 12px`, `color: var(--md-sys-color-on-surface-variant)` (`#C5CDE4`).
- Period at end, no trailing space.

### Checks
- [ ] Body has exactly two children: paragraph + mono note. No icon, no banner, no checkbox.
- [ ] Paragraph contains the literal text `Delete `, then the tutorial title in `<strong>`, then ` from the catalog?`.
- [ ] Tutorial title is the **exact** title of the row that opened the dialog (verify by editing the row title and re-opening).
- [ ] Mono line reads **`This cannot be undone.`** with the trailing period.
- [ ] `.mono` renders in Roboto Flex with 0.04 em tracking — **not** uppercase, **not** Plex Mono.

---

## 4. `slot="actions"` — Cancel / Delete

Source: skeleton line 343

### Buttons (in DOM order)
- **Cancel** — `<md-text-button>Cancel</md-text-button>`. No icon, no destructive styling.
- **Delete** — `<md-filled-button class="danger-button">Delete</md-filled-button>`. Single word, no trailing icon.

### `.danger-button` styling (skeleton lines 231-234)
- `--md-filled-button-container-color: var(--md-sys-color-error-container)` (`#93000A`).
- `--md-filled-button-label-text-color: var(--md-sys-color-on-error-container)` (`#FFDAD6`).
- Result: deep red background, pale-pink label. Distinct from the orange primary so destructive intent is unambiguous.
- **No** outline, **no** trailing icon. Hover / focus / pressed states use M3's default state-layer over the error container.

### Behavior
- Cancel closes with `returnValue=""` (or `"cancel"` if `value="cancel"` is bound).
- Delete should **disable while in-flight** to prevent double-fire (Pattern B convention — set the button to `disabled` while the DELETE request is pending).

### Checks
- [ ] Two buttons, right-aligned, Cancel (text variant) first then Delete (filled-button) second.
- [ ] Delete button background renders as the error container red `#93000A`, label `#FFDAD6` — **not** orange.
- [ ] Delete label is exactly `Delete` — no `Delete tutorial`, no destructive emoji.
- [ ] During the pending DELETE, the button shows the disabled state (lowered opacity, pointer-events none) and a spinner indicator (optional but Pattern B recommended).

---

## 5. Backdrop behavior

Source: skeleton lines 316-336

- The `.flow-underlay` wrapper applies `filter: saturate(.85)` to **only** the list page beneath the dialog (not the topbar / nav rail).
- The mini list shows 3 rows in the tutorial table: `MediatR / .NET / PUBLISHED / 2 min ago`, `RBAC / AZURE / DRAFT / 34 min ago`, `Atomic / BLAZOR / DRAFT / 1 hr ago`. (Confirm the live app shows the **actual** list rows, not the skeleton's 3 hard-coded examples — the dialog just overlays whatever list is current.)
- No `.highlight` row treatment in this skeleton (unlike `admin-tutorial-dialog.html`, which highlights the row being edited). For this dialog the **affected row** should still be visibly distinct — Pattern B convention: keep the `.highlight` background+outline on the row whose Delete was triggered, so the user can see what's about to be removed.

### Checks
- [ ] List page beneath remains mounted and visible, dimmed by saturate(0.85).
- [ ] Topbar and nav rail are **not** desaturated.
- [ ] The row whose Delete was triggered receives the `.highlight` treatment (primary-tinted background + 1 px primary outline) while the dialog is open.
- [ ] M3 scrim covers the full viewport.

---

## 6. Responsive

- Inherits Pattern B responsive rules from [`admin-tutorial-dialog.md §6`](./admin-tutorial-dialog.md#6-responsive):
  - ≤ 720 px: nav rail collapses to 72 px icon-only.
  - ≤ 600 px: dialog goes full-screen edge-to-edge, corner radius 0.
- Body content (paragraph + mono) does not require any column reflow.

### Checks
- [ ] At ≤ 600 px the dialog occupies 100 vw × 100 dvh, no rounded corners, paragraph wraps but remains readable.
- [ ] At all widths the two action buttons remain in a single row (the dialog is narrow enough that "Cancel" and "Delete" never wrap).

---

## 7. Bug logging procedure

For every failed check:

1. Open [`bugs/admin-confirm-delete-dialog.md`](../../bugs/admin-confirm-delete-dialog.md).
2. Append a new entry with `DEL-DLG-NNN` prefix.
3. Record audit section + expected (verbatim from this doc) + actual + fix location.
4. Append commit SHA on resolve.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Dialog opens too wide / wrong shape | `admin-confirm-delete-dialog.scss` — verify it uses `flow-dialog` (no `wide-dialog` modifier) |
| Tutorial name not bold inside the paragraph | `admin-confirm-delete-dialog.html` — wrap the interpolated name in `<strong>` |
| Mono note rendered uppercase or in Plex Mono | `.mono` class should inherit Pattern B Roboto Flex 12 px / 0.04 em — check shared admin SCSS |
| Delete button rendered orange (not red) | apply `.danger-button` class on the filled-button atom, or `components/src/lib/button` needs a `danger`/`destructive` variant |
| Delete fires twice if double-clicked | set the button `disabled` while the DELETE is in-flight in the component TS |
| Affected row not highlighted on the underlying list | `admin-tutorial-list-page.ts` — pass `deletingId` into the table and apply `.highlight` on match |
| Esc/scrim-click doesn't dismiss | ensure no `scrim-click-action=""` / `escape-key-action=""` attributes on `md-dialog` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-CONFIRM-DELETE-001-delete-dialog-composition.md`
- **Verification:** `npx ng build components --configuration development`; `npx ng build domain --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-confirm-delete-dialog/admin-confirm-delete-dialog-desktop.png`; `docs/ui-audit/screenshots/admin-confirm-delete-dialog/admin-confirm-delete-dialog-tablet.png`; `docs/ui-audit/screenshots/admin-confirm-delete-dialog/admin-confirm-delete-dialog-mobile.png`
