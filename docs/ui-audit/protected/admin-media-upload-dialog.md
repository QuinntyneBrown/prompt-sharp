# Admin Media Upload Dialog — UI Audit

- **Trigger:** Sign in as editor/sysadmin → navigate to `/admin/media` → click **Upload** in the page header. Also opens from the Tutorial Editor when the user drags media into a step block.
- **Skeleton:** [`docs/skeletons/admin-media-upload-dialog.html`](../../skeletons/admin-media-upload-dialog.html)
- **Pattern:** B (chrome rules per [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md))
- **Bug log:** [`bugs/admin-media-upload-dialog.md`](../../bugs/admin-media-upload-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/media/admin-media-upload-dialog` (create — sibling to `admin-media-page`)

---

## How to run this audit

1. Start API + frontend, sign in as editor/sysadmin.
2. Navigate to `/admin/media`, click **Upload** in the page header.
3. Drag a couple of PNG/JPG files onto the drop zone to populate the in-progress list (or wire a fake list for visual audit).
4. Open `docs/skeletons/admin-media-upload-dialog.html` in a second tab.
5. Audit at 1440 / 1100 / 720 / 600 px.
6. Log gaps in [`bugs/admin-media-upload-dialog.md`](../../bugs/admin-media-upload-dialog.md) using prefix `UPLOAD-DLG-`.

---

## Composition (skeleton lines 314-332)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             (backdrop)
  ├─ <ps-admin-nav-rail>           (backdrop — Media active)
  └─ <main class="admin-main">
       └─ <ps-media-upload-dialog>
             ├─ <header class="page-header">   (breadcrumb Admin / Media, h1 Media library, summary 286 assets, action Upload)
             └─ <md-dialog class="flow-dialog wide-dialog" open data-auto-open>
                   ├─ slot="headline"  → "Upload media"
                   ├─ slot="content"   → <form .dialog-form>
                   │     ├─ .drop-zone (dashed primary border, cloud_upload icon, caption)
                   │     └─ .block-stack
                   │           ├─ Upload row 1: architecture-map.png · image/png · 1920×1080 · progress 0.72 · refresh + close
                   │           └─ Upload row 2: step-cover.png       · image/png · 1600×900  · progress 0.38 · refresh + close
                   └─ slot="actions"   → md-text-button Close + md-filled-button Upload more
```

Backdrop: the Media library list page (no `.flow-underlay` wrapper — crisp behind the scrim, same convention as `admin-category-dialog`).

---

## 1. Dialog chrome

Inherits Pattern B. **Uses `wide-dialog` modifier** for the 720 px max-width — necessary to fit the file rows comfortably with filename + mono metadata + progress bar + 2 icon buttons.

- **Selector:** `md-dialog.flow-dialog.wide-dialog`.
- **Max-width:** `720px`. **Shape:** `20px`. **Container color:** `#161C2C`.
- **Auto-open:** `data-auto-open`. **Dismissable:** Esc + scrim + Close.

### Checks
- [ ] Dialog renders at 720 px max-width.
- [ ] Standard Pattern B chrome (color, shape, scrim).

---

## 2. `slot="headline"`

- **Exact text:** `Upload media` (sentence case, two words).
- Plain `<div slot="headline">`, no icon, no inner wrapper.

### Checks
- [ ] Headline reads exactly `Upload media`.

---

## 3. `slot="content"`

`<form slot="content" method="dialog" class="dialog-form">` — grid, `gap: 16px`.

### 3.1 Drop zone (`.drop-zone`)
- Source: skeleton lines 225-228 (style) and 328 (markup).
- Style: `border: 1px dashed var(--md-sys-color-primary)` (orange `#FF9800` dashed border, 1 px), `border-radius: 16px`, `padding: 34px`, `text-align: center`, `background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent)` (8% orange tint).
- Two children:
  1. `<md-icon style="font-size: 42px;">cloud_upload</md-icon>` — Material Symbols Outlined `cloud_upload` at **42 px**.
  2. `<div>Drag files here or browse</div>` — **verbatim text** `Drag files here or browse`. No specific class — inherits body font (Roboto Flex), default 14 px.
- Behavior: dropping files onto the zone appends rows to the in-progress list (§3.2). Clicking the zone opens the OS file picker.

### 3.2 In-progress upload list (`.block-stack`)
- Container: `<div class="block-stack">` — `display: grid; gap: 14px` (skeleton line 202).
- One row per uploading file. Each row is a plain `<div>` containing:
  1. `<strong>{filename}</strong>` — filename in bold (default Roboto Flex bold via variable axis).
  2. `<div class="mono">{mime} · {width}×{height}</div>` — Pattern B `.mono` (Roboto Flex 12 px / 0.04 em), middle-dot `·` (U+00B7), multiplication sign `×` (U+00D7, supplied via `&times;`).
  3. `<md-linear-progress value="{0-1}">` — determinate progress bar.
  4. `<md-icon-button><md-icon>refresh</md-icon></md-icon-button>` — retry control.
  5. `<md-icon-button><md-icon>close</md-icon></md-icon-button>` — cancel control.
- Skeleton renders the children **inline** (no explicit grid). The live component should arrange them as: row 1 = filename + mono on the left, refresh + close icon-buttons floated right; row 2 = progress bar spanning full width. Verify the live component uses an actual grid (e.g. `grid-template-columns: 1fr auto auto`) rather than relying on flow layout.

### Sample rows (verbatim from skeleton line 328)

Row 1:
- Filename: `architecture-map.png`
- Mono: `image/png · 1920×1080`
- Progress value: `0.72`
- Actions: `refresh`, `close`

Row 2:
- Filename: `step-cover.png`
- Mono: `image/png · 1600×900`
- Progress value: `0.38`
- Actions: `refresh`, `close`

### Per-row states
- **Uploading** (default): progress bar animates; both icon buttons visible (refresh disabled until error).
- **Error**: progress bar background turns error red; `refresh` button highlighted; row caption appends ` · failed` (mono).
- **Done**: progress bar full + green moss tint; both icon buttons hide; row gets a leading `check_circle` icon (Pattern B convention — not in the skeleton but expected in the live component).

### Checks
- [ ] Drop zone has **dashed** orange border (not solid). 1 px width, primary color `#FF9800`.
- [ ] Drop zone background is the 8% primary tint via `color-mix`.
- [ ] Drop zone caption reads **`Drag files here or browse`** verbatim. Cloud_upload icon at 42 px sits above the caption.
- [ ] Each upload row shows filename in **bold**, mime + dimensions in **mono with middle-dot and `×` glyph**.
- [ ] Progress bar (`md-linear-progress`) renders determinate with values 0.72 and 0.38 in the sample data.
- [ ] Each row has both `refresh` and `close` md-icon-buttons (Material Symbols Outlined).
- [ ] Error rows surface the retry button and an error caption.
- [ ] Clicking `close` removes the row; clicking `refresh` re-POSTs the upload.

---

## 4. `slot="actions"`

- **Close** — `<md-text-button>Close</md-text-button>`. **Note:** label is `Close` (not `Cancel`) — uploads in progress continue in the background after dismiss; this is intentional and is why the text reads `Close` rather than the more aggressive `Cancel`.
- **Upload more** — `<md-filled-button>Upload more</md-filled-button>`. Re-triggers the OS file picker without dismissing the dialog.

### Checks
- [ ] Two buttons right-aligned: Close (text) then Upload more (filled).
- [ ] Close label is exactly `Close` — not `Cancel`, not `Done`.
- [ ] Upload more label is exactly `Upload more` — not `Add more`, not `Choose files`.
- [ ] Closing the dialog does **not** cancel in-flight uploads (verify by closing while a row is mid-progress and re-opening — the upload should still complete and appear in the media library).

---

## 5. Backdrop behavior

- No `.flow-underlay` wrapper — Media library is crisp behind the scrim.
- Page header visible: breadcrumb `Admin / Media`, h1 `Media library`, summary `286 assets`, action `Upload` filled-button.
- Default M3 scrim.

### Checks
- [ ] Media library page beneath remains mounted and not desaturated.
- [ ] Nav rail's `Media` item is active (filled icon).

---

## 6. Responsive

- ≤ 1100 px: dialog still hits 720 px or the calc width, whichever is smaller.
- ≤ 600 px: full-screen edge-to-edge per Pattern B.
- Drop zone padding scales down implicitly via the dialog width. The upload rows reflow: at narrow widths the icon buttons drop to a second line below the progress bar.

### Checks
- [ ] ≤ 600 px: edge-to-edge, no rounded corners, drop zone still readable.
- [ ] Upload row icon buttons remain reachable at narrow widths (do not overflow horizontally).

---

## 7. Bug logging procedure

Log every failure in [`bugs/admin-media-upload-dialog.md`](../../bugs/admin-media-upload-dialog.md) using `UPLOAD-DLG-NNN`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Drop zone solid (not dashed) | `admin-media-upload-dialog.scss` — `.drop-zone` `border: 1px dashed` |
| Drop zone tint missing / too strong | `.drop-zone` background uses `color-mix(... primary 8%, transparent)` |
| Caption wording wrong | template — `Drag files here or browse` verbatim |
| Mime/dimensions string formatting wrong | component TS — interpolate `${mime} · ${width}×${height}` (U+00B7 + U+00D7) |
| Progress bar always indeterminate | `md-linear-progress` needs `value` binding |
| Close button labeled `Cancel` | template — must read `Close` |
| Uploads cancel when dialog closes | service must outlive the dialog (host upload state in an app-level service, not the dialog component) |
| Upload rows lay out wrong | use grid `1fr auto auto` so filename column flex-grows |
