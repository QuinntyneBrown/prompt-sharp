# Admin Publish Dialog — UI Audit

- **Trigger:** Sign in as editor/sysadmin → navigate to `/admin/tutorials` → open the row overflow on a tutorial whose `status === 'draft'` → click **Publish**. The dialog also opens from the Tutorial Editor toolbar `Publish` button.
- **Skeleton:** [`docs/skeletons/admin-publish-dialog.html`](../../skeletons/admin-publish-dialog.html)
- **Pattern:** B (chrome rules per [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md))
- **Bug log:** [`bugs/admin-publish-dialog.md`](../../bugs/admin-publish-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/tutorials/admin-publish-dialog` (create)

---

## How to run this audit

1. Start API + frontend, sign in as editor/sysadmin.
2. Go to `/admin/tutorials`, pick a row whose status pill reads `DRAFT`, open `more_vert` → **Publish**.
3. Open `docs/skeletons/admin-publish-dialog.html` in a second tab.
4. Audit at 1440 / 1100 / 720 / 600 px.
5. Verify the scheduled date/time field disabling toggles correctly when switching the **Now / Scheduled** radios.
6. Log gaps in [`bugs/admin-publish-dialog.md`](../../bugs/admin-publish-dialog.md) using prefix `PUB-DLG-`.

---

## Composition (skeleton lines 314-345)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             (backdrop)
  ├─ <ps-admin-nav-rail>           (backdrop — Tutorials active)
  └─ <main class="admin-main">
       └─ <ps-publish-dialog>
             ├─ <div class="flow-underlay">    ← same desaturated tutorial list as confirm-delete
             └─ <md-dialog class="flow-dialog" open data-auto-open>
                   ├─ slot="headline"  → "Publish tutorial"
                   ├─ slot="content"   → <form .dialog-form>
                   │     ├─ <div class="pill primary">Draft → Published</div>
                   │     ├─ <label><md-radio checked></md-radio> Now</label>
                   │     ├─ <label><md-radio></md-radio> Scheduled</label>
                   │     ├─ md-outlined-text-field "Scheduled date and time" (disabled, 2026-05-15 09:00)
                   │     └─ <div>
                   │           ├─ <div class="mono">Visibility</div>
                   │           └─ md-chip-set > md-filter-chip "Public" (selected) + "Members"
                   └─ slot="actions"   → md-text-button Cancel + md-filled-button Publish
```

Backdrop: same desaturated `admin-tutorial-list` (3 rows) as `admin-confirm-delete-dialog`.

---

## 1. Dialog chrome

Inherits Pattern B. See [`admin-tutorial-dialog.md §1`](./admin-tutorial-dialog.md#1-dialog-container-md-dialog-chrome).

- **Selector:** `md-dialog.flow-dialog` (560 px max, no `wide-dialog` modifier).
- **Container color:** `#161C2C`, **shape:** `20px`.
- **Auto-open:** `data-auto-open`.
- **Dismissable:** Esc + scrim-click + Cancel (default M3 — no overrides).

---

## 2. `slot="headline"`

- **Exact text (verbatim):** `Publish tutorial` (sentence case, no question mark, no trailing icon).
- Plain `<div slot="headline">` — no inner span/icon wrapper.

### Checks
- [ ] Headline reads exactly `Publish tutorial`.
- [ ] No leading icon.

---

## 3. `slot="content"`

`<form slot="content" method="dialog" class="dialog-form">` — grid, `gap: 16px`.

### 3.1 Status pill — `Draft → Published`
- Element: `<div class="pill primary">Draft &rarr; Published</div>`.
- **Exact text (rendered):** `Draft → Published` (the arrow is `→` U+2192, supplied via `&rarr;` in the skeleton).
- `.pill` base style (skeleton lines 188-193): `display: inline-flex; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 999px;` and **`.primary`** modifier overrides background → `var(--md-sys-color-primary-container)` (`#4A2F00`) with label `var(--md-sys-color-on-primary-container)` (`#FFDAA8`).
- Visually communicates the state transition the action will perform.

### 3.2 Schedule radio group
- Two `<label>` elements containing `<md-radio>` + label text — **not** a `<md-radio-group>` parent in the skeleton. The live component should bind both to one form control so they behave as a group.
- **Option 1 (default):** `<label><md-radio checked></md-radio> Now</label>` — radio is `checked`. Label text **exactly** `Now`.
- **Option 2:** `<label><md-radio></md-radio> Scheduled</label>` — unchecked. Label text **exactly** `Scheduled`.
- Layout: two `<label>` siblings on separate lines (the parent `.dialog-form` grid gives `gap: 16px` between rows).

### 3.3 Scheduled date/time field
- `<md-outlined-text-field label="Scheduled date and time" disabled value="2026-05-15 09:00">`.
- **Label (verbatim):** `Scheduled date and time`.
- **Default value:** `2026-05-15 09:00` (ISO date + 24-hour time, single-space separator, no `T` and no seconds).
- **Disabled by default** because the `Now` radio is checked; the live component must enable it the moment the user clicks the **Scheduled** radio (and re-disable + clear on switching back to **Now**).
- No leading icon, no supporting text.

### 3.4 Visibility block
- Container `<div>` with two children:
  1. **Mono caption:** `<div class="mono" style="margin-bottom: 8px;">Visibility</div>` — exact text `Visibility`. Pattern B `.mono` = Roboto Flex 12 px, 0.04 em tracking (skeleton line 99). Inline `margin-bottom: 8px`.
  2. **Filter-chip set (segmented):** `<md-chip-set>` containing two `<md-filter-chip>`:
     - `<md-filter-chip label="Public" selected></md-filter-chip>` — **default selected**.
     - `<md-filter-chip label="Members"></md-filter-chip>` — unselected.
- The two chips act as a **mutually-exclusive segmented control** (the live component must enforce single-select even though `md-filter-chip` defaults to multi).

### Checks
- [ ] Status pill renders with text `Draft → Published`, primary-container background (`#4A2F00`) and label color `#FFDAA8`.
- [ ] Arrow glyph is `→` (U+2192), not `->` or `=>`.
- [ ] Two radio rows in order: `Now` (checked) then `Scheduled` (unchecked). Single form control under the hood.
- [ ] Date/time field label is exactly `Scheduled date and time` (sentence case). Default value `2026-05-15 09:00`. Field is **disabled** until the Scheduled radio is selected.
- [ ] Switching to `Scheduled` enables the field; switching back to `Now` disables it again.
- [ ] Mono caption `Visibility` sits 8 px above the chip-set, Roboto Flex 12 px, 0.04 em tracking.
- [ ] Two filter chips, `Public` selected by default, mutually exclusive (clicking `Members` deselects `Public`).

---

## 4. `slot="actions"`

- **Cancel** — `<md-text-button>Cancel</md-text-button>`.
- **Publish** — `<md-filled-button>Publish</md-filled-button>` — default M3 primary color (orange `#FF9800` container, `#00000F` label). **Do not** apply `.danger-button` — Publish is a constructive action.

### Checks
- [ ] Two buttons right-aligned, Cancel (text) then Publish (filled).
- [ ] Publish label is exactly `Publish` — not `Publish now`, not `Save & publish`.
- [ ] Publish button stays disabled until the form is valid (e.g. if `Scheduled` is picked, the date/time must parse).
- [ ] During the in-flight PATCH the Publish button disables to prevent double-fire.

---

## 5. Backdrop behavior

Same as `admin-confirm-delete-dialog`:
- `.flow-underlay` wraps the tutorial list, applies `filter: saturate(.85)`.
- Topbar + nav rail not desaturated.
- M3 default scrim.

### Checks
- [ ] List page beneath the dialog stays mounted and desaturated.
- [ ] The row whose Publish action opened the dialog receives `.highlight` background+outline (Pattern B convention — show what's being published).

---

## 6. Responsive

Inherits Pattern B (see [`admin-tutorial-dialog.md §6`](./admin-tutorial-dialog.md#6-responsive)). ≤ 600 px goes full-screen.

### Checks
- [ ] ≤ 600 px: edge-to-edge, no rounded corners.
- [ ] ≤ 720 px: nav rail collapses behind the scrim.

---

## 7. Bug logging procedure

Log every failure in [`bugs/admin-publish-dialog.md`](../../bugs/admin-publish-dialog.md) using `PUB-DLG-NNN`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Pill renders without primary container color | `admin-publish-dialog.scss` — `.pill.primary` overrides |
| Arrow glyph wrong (`->` instead of `→`) | template — use HTML entity `&rarr;` or literal `→` |
| Date/time field always enabled / always disabled | bind `[disabled]` to `scheduleMode !== 'scheduled'` |
| Filter chips allow multi-select | component TS — enforce mutual exclusion in `(selected)` handlers |
| Publish button rendered red (danger) | remove `.danger-button` class — Publish is primary |
| Visibility caption uppercase / wrong font | `.mono` shared SCSS — Roboto Flex 12 px / 0.04 em |
