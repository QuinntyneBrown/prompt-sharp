# Catalog — UI Audit

- **Route:** `/tutorials`
- **Skeleton:** [`docs/skeletons/catalog.html`](../../skeletons/catalog.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono)
- **Bug log:** [`bugs/catalog.md`](../../bugs/catalog.md)
- **Live component:** `frontend/projects/domain/src/lib/catalog/catalog-page`

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
2. Open `http://localhost:4200/tutorials` in one tab.
3. Open `docs/skeletons/catalog.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar).
5. Walk the checks below in DOM order. Log every gap in [`bugs/catalog.md`](../../bugs/catalog.md) using ID prefix `CATALOG-`.

---

## Composition (DOM order, from `catalog.html:488-491, 562-572`)

```
<ps-nav>                ← shared sticky bar (see home.md § Nav)
<ps-shell>
  ├─ <ps-catalog-header>
  ├─ <ps-catalog-toolbar>
  ├─ <ps-catalog-body>
  │   ├─ <ps-filter-rail>
  │   └─ <ps-catalog-grid>
  │       └─ <ps-tutorial-card> × 9
  ├─ <ps-pagination>
  └─ <ps-footer>          ← shared (see home.md § Footer)
</ps-shell>
```

Live counterpart: `frontend/projects/domain/src/lib/catalog/catalog-page/catalog-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-nav>` — shared sticky navigation bar

Verify against [`home.md` § 1. ps-nav](./home.md#1-ps-nav--sticky-navigation-bar). The active link on this route is **`Tutorials`** (orange underline overlapping the bottom rule).

### Checks
- [ ] Active link is `Tutorials` (not `Categories` / `About`).
- [ ] Wordmark, links, Sign-in button match home.md spec.
- [ ] Sticky-positioned; backdrop blur still visible.

---

## 2. `<ps-catalog-header>` — Page header

Source: `catalog.html:170-194, 592-609`

### Layout
- **Grid:** `1.4fr 1fr` two-column, `gap: 48px`, `align-items: end`.
- **Padding:** `72px 0 32px`.
- **Border-bottom:** `1px solid var(--rule)` (`#003E80`).

### `.meta-rail` (top eyebrow row, spans both columns)
- `grid-column: 1 / -1`, flex space-between, `align-items: center`, `margin-bottom: 24px`.
- **Left:** `<div class="eyebrow"><span class="dot"></span>Tutorial Catalog</div>`
  - Eyebrow: IBM Plex Mono, **11px**, weight 500, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)` (`#6B7AAF`).
  - `.dot`: `6×6 px` square (not circular), `background: var(--accent)` (`#FF9800`), `margin-right: 10px`, `vertical-align: middle`.
- **Right:** `<div class="mono">412 tutorials · updated daily</div>`
  - IBM Plex Mono **12px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)` (`#C5CDE4`).

### Left column — `<h1 class="display">`
- Two lines (explicit `<br/>`):
  - Line 1: `Every <em>step</em> we've`
  - Line 2: `written down.`
- `em` ("step"): italic, `wdth 85 / wght 500`, `color: var(--accent)`.
- Font: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`.
- Size: `clamp(48px, 8vw, 112px)`. At 1440 px → ~112 px.
- `margin: 0`.

### Right column — `.lede`
- Exact text: `**412 step-by-step tutorials** across .NET, Azure, Blazor and the rest of the Microsoft stack — filter by category, difficulty, or duration to find your next build.`
- `412 step-by-step tutorials` is wrapped in `<strong>` with `color: var(--ink)` (`#FBFFFF`) and `font-weight: 500`.
- `max-width: 42ch`, `color: var(--ink-dim)`, `font-size: 17px`, `line-height: 1.55`, `margin: 0`.

### Responsive
- **1100px and below:** grid collapses to `1fr` (single column, `gap: 24px`).
- **720px:** padding reduces to `48px 0 24px`; `h1.display` resizes to `clamp(40px, 11vw, 72px)`.

### Checks
- [ ] Eyebrow text is `Tutorial Catalog` with the 6×6 orange square dot prefix.
- [ ] Right meta-rail text reads `412 tutorials · updated daily` in Plex Mono 12px ink-dim.
- [ ] Headline displays as two lines: `Every step we've` (with `step` italic orange) / `written down.`
- [ ] Headline scales fluidly between 48 px and 112 px.
- [ ] Lede paragraph: leading `412 step-by-step tutorials` is bolder ink, the rest ink-dim.
- [ ] Header has a bottom hairline rule at `1px solid #003E80`.
- [ ] At 1100 px the columns stack to single column with 24 px gap.
- [ ] At 720 px the headline shrinks and top padding tightens to 48 px.
- [ ] **Live component:** `frontend/projects/domain/src/lib/catalog/catalog-header`. Verify the eyebrow uses the shared `eyebrow` atom or replicates the muted Plex Mono + 6×6 dot. The `<strong>` accent in the lede must render at weight 500 ink, **not** orange.

---

## 3. `<ps-catalog-toolbar>` — Count / sort / view toggle

Source: `catalog.html:198-239, 611-627`

### Layout
- Flex row, `align-items: center`, `justify-content: space-between`, `gap: 24px`, `flex-wrap: wrap`.
- Padding `24px 0`.
- Border-bottom `1px solid var(--rule)`.

### `.result-count` (left)
- Exact text: `Showing 412 of 412 tutorials`. Both `412`s wrapped in `<b>`.
- IBM Plex Mono **12px**, `letter-spacing: 0.1em`, uppercase, `color: var(--ink-dim)`.
- `<b>` styled: `color: var(--accent)`, `font-weight: 600`.

### `.toolbar-right` (right side, flex row, gap 24px)

#### `.sort-control`
- Inline-flex, gap 12px, Plex Mono **11px**, `letter-spacing: 0.1em`, uppercase, `color: var(--ink-dim)`.
- First span: `Sort by` (literal text).
- Second span `.sort-val`: `Latest ▾` — `color: var(--ink)`, `border-bottom: 1px solid var(--accent)`, `padding-bottom: 2px`, cursor pointer. The `▾` is inside `<span class="arr">`, `color: var(--accent)`, `margin-left: 8px`.

#### `.view-toggle`
- Inline-flex row, `border: 1px solid var(--rule)` wrapping two cells.
- Each `.vt` is **32×32 px**, inline-flex centered, cursor pointer, `color: var(--muted)`, `border-right: 1px solid var(--rule)` (last cell has no right border).
- Cell 1 (`.active`): glyph `▦` (Grid), `color: var(--bg)`, `background: var(--accent)`.
- Cell 2: glyph `≡` (List), `color: var(--muted)`, hover → `color: var(--ink)`.

### Responsive
- **720px:** `flex-direction: column`, `align-items: flex-start`, `gap: 16px`. `.toolbar-right` becomes full-width with `justify-content: space-between`.

### Checks
- [ ] Result count reads exactly `Showing 412 of 412 tutorials` with both numbers in orange bold.
- [ ] Sort control: `Sort by` label then `Latest ▾` with the down-arrow caret in orange and a 1px orange bottom border under the value.
- [ ] View toggle is a 1px-bordered pill of two 32×32 cells; Grid (`▦`) is the active cell (orange bg, dark glyph) and List (`≡`) is the inactive cell with muted glyph.
- [ ] No rounded corners on the view toggle.
- [ ] Toolbar has a bottom hairline rule.
- [ ] At 720 px the toolbar stacks vertically with the right group reflowing to a full-width row.
- [ ] **Live component:** `frontend/projects/domain/src/lib/catalog/catalog-toolbar`. The view-toggle should expose `view: 'grid' | 'list'` and the sort value should be data-driven; the literal `Latest ▾` is placeholder. Verify the bordered 32×32 cells are squares, not rounded.

---

## 4. `<ps-catalog-body>` → `<ps-filter-rail>` (left rail)

Source: `catalog.html:244-310, 629-697`

### Body container layout (`ps-catalog-body`)
- Grid `240px 1fr`, gap **48px**, padding `40px 0 80px`, border-bottom `1px solid var(--rule)`, `align-items: start`.

### Filter rail container
- Flex column, gap **28px**.
- `position: sticky; top: 100px;` (stays visible while scrolling cards).

### Filter group structure (repeats 4 times)
- Flex column, gap 10px.
- `<h4>`: Plex Mono **11px**, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)`, `margin: 0 0 6px`. Flex row, gap 10px, with a **14×1 px** orange `::before` rule on the left.

### Group 1 — Category
- `<h4>Category</h4>`
- Filter chips (rows) in order with counts:
  1. `All` · 412 ← `.on` (active)
  2. `.NET` · 142
  3. `Blazor` · 68
  4. `Azure` · 94
  5. `EF Core` · 41
  6. `Auth / RBAC` · 23
  7. `DevOps` · 31
  8. `Architecture` · 52
  9. `MediatR` · 12
  10. `SQL Server` · 38
- `.filter-chip`: flex justify-between, Plex Mono **11px**, `padding: 8px 0`, `border-bottom: 1px solid var(--rule-soft)` (`#001A36`), `color: var(--ink-dim)`, `letter-spacing: 0.06em`, cursor pointer.
- Hover: `color: var(--ink)`.
- `.on`: `color: var(--ink)`, prefixed with `::before { content: "■"; color: var(--accent); margin-right: 10px; }`.
- `.n` (count): `color: var(--muted)`; on active rows `color: var(--ink-dim)`.

### Group 2 — Difficulty
- `<h4>Difficulty</h4>` followed by three filter chips:
  1. `Beginner` · 138
  2. `Intermediate` · 184
  3. `Advanced` · 90
- Same `.filter-chip` styling as above; none active in skeleton.

### Group 3 — Duration
- `<h4>Duration</h4>` followed by `.chip-row` (flex-wrap row, gap 6px) of `.pill` elements:
  1. `< 30 min` ← `.on`
  2. `30–60 min`
  3. `1h+`
- `.pill`: Plex Mono **10px**, `letter-spacing: 0.12em`, uppercase, `padding: 6px 10px`, `border: 1px solid var(--rule)`, `color: var(--ink-dim)`, cursor pointer.
- Hover: `color: var(--ink)`, `border-color: var(--ink-dim)`.
- `.on`: `color: var(--bg)`, `background: var(--accent)`, `border-color: var(--accent)`, `font-weight: 600`.

### Group 4 — Tags
- `<h4>Tags</h4>` followed by `.chip-row` of inactive `.pill`s:
  1. `Clean Arch`
  2. `OAuth2`
  3. `CQRS`
  4. `Aspire`
  5. `MAUI`
  6. `Service Bus`

### `.reset-link` (bottom)
- Button text: `Reset filters`.
- Plex Mono **11px**, `letter-spacing: 0.1em`, uppercase, `color: var(--accent)`, `border-bottom: 1px solid var(--accent)`, `padding-bottom: 2px`, transparent background, no other borders, `align-self: flex-start`, `margin-top: 4px`.
- Hover: `filter: brightness(1.1)`.

### Responsive
- **1000px and below:** `ps-catalog-body` grid collapses to `1fr`, gap 32px; `.filter-rail` becomes `position: static`.
- **720px:** same single-column.

### Checks
- [ ] Rail width is exactly 240 px at desktop.
- [ ] Rail is sticky at `top: 100px` while scrolling.
- [ ] Four filter groups in this order: Category / Difficulty / Duration / Tags.
- [ ] Group headings have the 14×1 orange leading rule.
- [ ] Category chip 1 (`All`) is the active row with orange `■` square prefix.
- [ ] All ten category chips are present in the correct order with the exact counts above.
- [ ] Difficulty has three rows (no active).
- [ ] Duration uses pill buttons (not rows); `< 30 min` is the active pill with orange fill + dark text.
- [ ] Tags are six inactive pills.
- [ ] Reset filters link at the bottom has orange text + orange underline only (no other borders).
- [ ] At 1000 px the rail unsticks and stacks above the card grid.
- [ ] **Live component:** `frontend/projects/domain/src/lib/catalog/filter-rail`. If the chip atom is missing the `pill` variant (orange-filled active state), add it to `components/src/lib/chip` or extend `filter-rail.scss`.

---

## 5. `<ps-catalog-body>` → `<ps-catalog-grid>` (right grid)

Source: `catalog.html:313-384, 699-788`

### Grid container
- `grid-template-columns: repeat(3, 1fr)`, gap **24px**.

### Card structure (`ps-tutorial-card`)
- Flex column, `border: 1px solid var(--rule)`, `background: var(--surface)` (`#002A54`), `position: relative`, cursor pointer.
- Hover: `border-color: var(--accent)`, `transform: translateY(-2px)`.
- `.num` absolute top-right (`top: 12px; right: 12px`), Plex Mono **11px**, `color: var(--muted)`, `letter-spacing: 0.12em`, `z-index: 1`. Format `NNN / 412` (e.g. `001 / 412`).
- `.thumb-wrap`: `aspect-ratio: 16/10`, contains `<sk-tile>` shimmer + `.badges` (absolute top-left, flex gap 6px).
- `.body`: padding `18px 20px 22px`, flex column, gap 12px, `flex: 1`.
- `<h3>`: Mona Sans `wdth 88 / wght 550`, **20px**, `letter-spacing: -0.02em`, `line-height: 1.2`, `min-height: 48px`.
- `.desc`: Mona Sans `wdth 100 / wght 400`, **13px**, `color: var(--ink-dim)`, `line-height: 1.5`.
- `.lines`: flex column gap 6px, margin-top 2px, contains two `<sk-line>` placeholders (`w="100"` then `w="70" delay="1"`).
- `<footer>`: `margin-top: auto`, `padding-top: 14px`, top border `1px solid var(--rule)`, flex space-between, Plex Mono **11px**, `color: var(--ink-dim)`, `letter-spacing: 0.06em`.
  - `.steps b` (the step count digits): `color: var(--accent)`, `font-weight: 600`.
  - `.diff`: padding `3px 8px`, `border: 1px solid currentColor`, **9px** Plex Mono, `letter-spacing: 0.16em`, uppercase.
  - `.diff.b` → `color: var(--moss)` (`#8AA8FF`)
  - `.diff.i` → `color: var(--gold)` (`#FFC85C`)
  - `.diff.a` → `color: var(--accent)` (`#FF9800`)

### Chip atom (`.chip`)
- Inline-flex, gap 6px, Plex Mono **10px**, `letter-spacing: 0.12em`, padding `4px 8px`, `background: var(--bg)`, `color: var(--ink)`, `border: 1px solid var(--rule)`.
- `.chip.accent`: `color: var(--accent)`, `border-color: var(--accent)`.

### Nine cards (exact content, in DOM order)

| # | Num | Badges | Title | Description | Steps | Time | Diff |
|---|-----|--------|-------|-------------|-------|------|------|
| 1 | `001 / 412` | `DEEP DIVE` (accent) + `.NET 9` | `Wiring MediatR into a Clean Architecture API` | `Vertical-slice handlers, validators and the pipeline behaviors I'd ship to production.` | 22 | 58 MIN | `i` INTERMEDIATE |
| 2 | `002 / 412` | `AZURE` | `RBAC, properly — claims and policy design` | `Claims, policies, and the lies tutorials tell about role-based authorization.` | 14 | 36 MIN | `a` ADVANCED |
| 3 | `003 / 412` | `BLAZOR` | `Atomic design for Blazor components` | `Building a token-driven component library that scales beyond the demo.` | 9 | 24 MIN | `b` BEGINNER |
| 4 | `004 / 412` | `NEW` (accent) + `EF CORE` | `EF Core 9 migrations under load` | `What breaks first — and a SQL Server reproduction repo to play with.` | 18 | 52 MIN | `a` ADVANCED |
| 5 | `005 / 412` | `AUTH` | `OAuth2 confidential clients, in one sitting` | `PKCE, refresh tokens, and exactly which lib to reach for in .NET 9.` | 12 | 44 MIN | `i` INTERMEDIATE |
| 6 | `006 / 412` | `.NET` | `A MediatR pipeline I'd ship to production` | `Validation, logging, transactions — without the ceremony or surprises.` | 10 | 33 MIN | `i` INTERMEDIATE |
| 7 | `007 / 412` | `ASPIRE` | `Aspire 9 dashboards for local development` | `OpenTelemetry, the resource graph, and what stays useful in production.` | 16 | 41 MIN | `i` INTERMEDIATE |
| 8 | `008 / 412` | `BLAZOR` + `RBAC` | `Building the admin shell — CMS without a CMS` | `Roles, audit trails, and the editor your sysadmin will actually use.` | 28 | 1H 04M | `a` ADVANCED |
| 9 | `009 / 412` | `CSS` | `Responsive admin tables from xs to xl` | `From xs to xl without giving up dense data tables or sortable columns.` | 7 | 21 MIN | `b` BEGINNER |

### Footer string format
- Left: `<b>{steps}</b> STEPS · {time}` (e.g. `22 STEPS · 58 MIN`). The number is orange weight 600; the rest is ink-dim.
- Right: `INTERMEDIATE` / `ADVANCED` / `BEGINNER` in a bordered pill colored per difficulty.

### Responsive
- **1200px and below:** grid becomes `repeat(2, 1fr)`.
- **1000px and below:** body collapses to single column (the rail unsticks above).
- **720px:** grid becomes `1fr` (single card per row).

### Checks
- [ ] Exactly 9 cards rendered at desktop in 3 columns.
- [ ] Card 1 has BOTH the orange `DEEP DIVE` chip AND a neutral `.NET 9` chip.
- [ ] Card 4 has BOTH the orange `NEW` chip AND a neutral `EF CORE` chip.
- [ ] Card 8 has BOTH `BLAZOR` and `RBAC` chips (neither orange).
- [ ] All titles match the table above verbatim (note em-dashes in `RBAC, properly — claims …` and `Building the admin shell — CMS …`, and `EF Core 9 …`).
- [ ] Each card has a numbered `NNN / 412` in the top-right (Plex Mono 11px muted, letter-spacing 0.12em).
- [ ] Each card footer has the step digits in orange + difficulty pill in the correct accent color (moss/gold/accent).
- [ ] Card hover: orange border + 2 px translate-up.
- [ ] Description (`.desc`) is **13px** Mona Sans (not Plex Mono).
- [ ] At 1200 px the grid reflows to 2 columns; at 720 px to 1 column.
- [ ] **Live components:** `frontend/projects/domain/src/lib/catalog/catalog-grid` (container) + `frontend/projects/domain/src/lib/tutorial/tutorial-card` (atom). The card atom must accept multiple chips, a numbered slot, and a difficulty variant (`b` / `i` / `a`). If `tutorial-card` is currently unused (see `docs/frontend-audit.md` #1) wire it in here.

---

## 6. `<ps-pagination>` — Page controls

Source: `catalog.html:389-419, 792-809`

### Layout
- Flex row, `justify-content: space-between`, `align-items: center`, `flex-wrap: wrap`, gap 16px.
- Padding `40px 0 64px`.

### `.page-info` (left)
- Exact text: `Page 1 of 14 · 30 per page`. The `1` and `14` are wrapped in `<b>`.
- Plex Mono **11px**, `letter-spacing: 0.1em`, uppercase, `color: var(--ink-dim)`.
- `<b>`: `color: var(--accent)`.

### `.page-controls` (right)
- Inline-flex, no gap (`gap: 0`), buttons share borders.
- Each `.page-btn`: `min-width: 40px`, `height: 40px`, inline-flex centered, `border: 1px solid var(--rule)`, `border-right: none` (the last child overrides to add a right border), Plex Mono **12px**, `color: var(--ink-dim)`, transparent background, padding `0 14px`, `letter-spacing: 0.06em`, cursor pointer.
- Hover: `color: var(--ink)`.
- `.current` (active button): `color: var(--bg)`, `background: var(--accent)`, `border-color: var(--accent)`, `font-weight: 600`.
- `.ghost`: `color: var(--muted)`.
- `.arr` glyphs: `color: var(--accent)`.

### Buttons in order
1. `.page-btn.ghost` — `←` (previous, muted color, orange arrow)
2. `.page-btn.current` — `1` (active, orange fill)
3. `.page-btn` — `2`
4. `.page-btn` — `3`
5. `.page-btn.ghost` — `…` (ellipsis, muted)
6. `.page-btn` — `14`
7. `.page-btn` — `→` (next, orange arrow)

### Responsive
- **720px:** `flex-direction: column`, `align-items: stretch`.

### Checks
- [ ] Page info reads `Page 1 of 14 · 30 per page` with `1` and `14` in orange bold.
- [ ] Seven page buttons in the exact order: `←`, `1` (active), `2`, `3`, `…`, `14`, `→`.
- [ ] Active button has orange fill with dark digit color, no border seam against neighbors.
- [ ] `←` and `→` arrows are orange glyphs inside `<span class="arr">`.
- [ ] Ghost buttons (`←` and `…`) use muted color.
- [ ] Border behavior: each button has `border-right: none` except the last; verify the row reads as a single 1-px bordered control with internal vertical seams.
- [ ] At 720 px the row stacks vertically.
- [ ] **Live component:** `frontend/projects/domain/src/lib/catalog/pagination`. Verify the page count + per-page metrics are bound, not hard-coded. The button atom should support `current`, `ghost`, and the trailing-arrow slot.

---

## 7. `<ps-footer>` — shared site footer

Verify against [`home.md` § 7. ps-footer](./home.md#7-ps-footer--site-footer). Identical markup and styling.

### Checks
- [ ] Foot-mark renders at 64 px with italic-orange slash.
- [ ] Three link columns: Tutorials / Categories / Account.
- [ ] `© 2026 · Prompt/Sharp` left, empty right side.
- [ ] At 1000 px columns reflow to 2; at 720 px to 1.

---

## 8. Page-level visual checks (global)

- [ ] **Background radial gradients:** the body `::before` overlay produces a soft orange glow at top-right and a periwinkle glow at top-left, plus 1px horizontal scan lines (`repeating-linear-gradient` at 3-4px).
- [ ] **Page horizontal padding** is `clamp(20px, 4vw, 64px)`.
- [ ] **All custom-element registrations resolve** — no `<ps-catalog-header>`, `<ps-filter-rail>`, etc. unknown-element warnings in DevTools.
- [ ] **Skeleton primitives** render shimmer (`sk-tile`, `sk-line`) gracefully until real data wires up.
- [ ] **No font-family: serif** anywhere. Both fonts sans-serif.
- [ ] **Card thumb aspect-ratio** is 16/10 with no layout shift on shimmer.

---

## 9. Bug logging procedure

For every failed check above:

1. Open [`bugs/catalog.md`](../../bugs/catalog.md).
2. Append a new entry using the `CATALOG-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 10. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Header eyebrow missing 6×6 orange dot | `domain/src/lib/catalog/catalog-header/catalog-header.html` |
| Display headline rendered as one line (no `<br/>` between `we've` and `written down.`) | `catalog-header.html` |
| Lede `<strong>` rendered orange instead of bolder ink | `catalog-header.scss` (`.lede strong { color: var(--ink) }`) |
| Toolbar view toggle rounded corners | `catalog-toolbar.scss` |
| Sort caret `▾` not orange | `catalog-toolbar.scss` (`.sort-control .arr`) |
| Filter rail not sticky at top 100 | `filter-rail.scss` |
| Filter group heading missing 14×1 orange leading rule | `filter-rail.scss` (`.filter-group h4::before`) |
| Active filter chip missing orange `■` prefix | `filter-rail.scss` (`.filter-chip.on::before`) |
| Pill (`< 30 min`) active state wrong color | `filter-rail.scss` or `components/src/lib/chip` |
| Tutorial card hover doesn't lift | `tutorial/tutorial-card/tutorial-card.scss` |
| Card desc rendered as Plex Mono instead of Mona Sans 13px | `tutorial-card.scss` |
| Difficulty pill wrong color | `components/src/lib/difficulty-badge/difficulty-badge.scss` |
| Pagination button seam doubled | `pagination.scss` (`.page-btn { border-right: none }` + last-child override) |
| Pagination active button not orange | `pagination.scss` (`.page-btn.current`) |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before block |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
