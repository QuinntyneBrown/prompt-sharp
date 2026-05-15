# Progress — UI Audit

- **Route:** `/progress`
- **Skeleton:** [`docs/skeletons/progress.html`](../../skeletons/progress.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono — same palette + chrome as the public site)
- **Bug log:** [`bugs/progress.md`](../../bugs/progress.md)
- **Live component:** `frontend/projects/domain/src/lib/protected/progress-page`

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
2. Open `http://localhost:4200/signin` and authenticate. After sign-in, navigate to `http://localhost:4200/progress`.
3. Open `docs/skeletons/progress.html` directly in a second tab (file:// is fine — the skeleton has no external deps beyond Google Fonts).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar).
5. Walk the checks below in DOM order. Log every gap in [`bugs/progress.md`](../../bugs/progress.md) using ID prefix `PROGRESS-`.

> **Auth gate:** this route is protected. If hitting `/progress` while signed out, the app must redirect to `/signin?returnUrl=/progress`. Verify before auditing.

---

## Composition (DOM order, from `progress.html:336-430`)

```
<ps-nav>                                  ← sticky, full-viewport, lives outside ps-shell
<ps-shell>
  ├─ <section class="page-hero">           ← eyebrow + display headline
  ├─ <ps-progress-list class="section-block">
  │   ├─ <header class="sect-head">         "In progress"
  │   ├─ <div class="latest-list">           4 rows with meters
  │   ├─ <header class="sect-head">         "Bookmarked"
  │   └─ <div class="latest-list">           4 rows with meters
  └─ <ps-footer>
</ps-shell>
```

Live counterpart should be `frontend/projects/domain/src/lib/protected/progress-page/progress-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

> **Atypical structure:** the skeleton uses a **single `<ps-progress-list>` element** that contains BOTH "In progress" and "Bookmarked" section headers and row lists, rather than two separate sibling components. The live app may legitimately split this into two `<ps-progress-section>` instances — flag whichever choice the team has made and align this audit accordingly.

---

## 1. `<ps-nav>` — Sticky navigation bar

Source: `progress.html:336-348`. Identical chrome to the home page; see [`public/home.md` §1](../public/home.md#1-ps-nav--sticky-navigation-bar) for the full audit.

### Differences from home

- **None of the three links is active in the skeleton** (each `<span class="">` has an empty class string at `progress.html:340-342`).
- **The `Sign in` ghost button must be replaced** with an authenticated user control on this route (see profile audit §1 for the same requirement).

### Checks

- [ ] Nav chrome (sticky, blurred background, brand wordmark, three links, right-aligned actions) matches `public/home.md §1`.
- [ ] On `/progress`, **none** of the three nav links has the active underline.
- [ ] The right `.actions` slot shows a user control (avatar dropdown or "Sign out" ghost button), **not** the literal "Sign in" placeholder from the skeleton.
- [ ] At 720 px: links hidden, brand + user control only.
- [ ] **Live component:** `frontend/projects/domain/src/lib/layout/public-nav` must conditionally swap its right-side action based on `AuthService.isSignedIn`.

---

## 2. `<section class="page-hero">` — Page hero

Source: `progress.html:351-354` (CSS at `169-173, 320-321`)

### Layout
- Block element with `page-hero` chrome: padding `72px 0 48px`, `border-bottom: 1px solid var(--rule)`.

### Eyebrow line
- Class `.eyebrow` — IBM Plex Mono, 11 px, weight 500, `letter-spacing: 0.18em`, uppercase, color `var(--muted)` (`#6B7AAF`).
- `.dot` prefix — 6×6 px square, background `var(--accent)`, `margin-right: 10px`, `vertical-align: middle`.
- Exact text content: `Progress / Bookmarks` (mixed-case in markup; CSS lifts to uppercase). Source: `<div class="eyebrow"><span class="dot"></span>Progress / Bookmarks</div>`.

### Display headline
- `<h1 class="display">` — Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`. Size `clamp(48px, 8vw, 112px)`. Color `var(--ink)`. Margin `0 0 24px`.
- Exact text: `Keep moving through ` then `<em>the stack</em>` then `.` (italic, `wdth 85 / wght 500`, color `var(--accent)`).

### Responsive
- **720px:** `.page-hero` padding `48px 0 28px`; `h1.display` size shrinks via the smaller clamp.

### Checks
- [ ] Eyebrow renders orange dot + uppercase tracked Plex Mono muted text `PROGRESS / BOOKMARKS`.
- [ ] `<h1>` reads exactly `Keep moving through the stack.` with **`the stack`** italic orange, period at the end.
- [ ] Headline scales fluidly between 48 px (small) and 112 px (≥1400 px).
- [ ] Bottom border of the hero is a single 1 px navy hairline (`var(--rule)`).
- [ ] At 720 px the hero padding shrinks to `48px 0 28px`.
- [ ] **Live component:** `protected/progress-page` template. Reuse the `display-em` SCSS partial.

---

## 3. `<ps-progress-list class="section-block">` — Progress + Bookmarked groups

Source: `progress.html:355-416`

### Wrapper layout
- `.section-block` chrome: padding `72px 0 48px`, `border-bottom: 1px solid var(--rule)`.
- The element holds **two `<header class="sect-head">` + `<div class="latest-list">` pairs** in this order: "In progress" then "Bookmarked".

### 3a. "In progress" `<header class="sect-head">`

Source: `progress.html:356`

#### Layout
- `.sect-head` — grid `auto 1fr auto`, gap 32 px, align items end, padding `56px 0 28px`.

#### Children
1. **`<h2>`** — Mona Sans `wdth 78 / wght 600`, `font-size: clamp(34px, 4.4vw, 56px)`, `letter-spacing: -0.035em`, `line-height: 1`. Color `var(--ink)`.
   - Exact text: `In ` then `<em>progress</em>` (italic orange, `wdth 88 / wght 500`).
2. **`.lead-col`** — `max-width: 36ch`, color `var(--ink-dim)`, font-size 14 px.
   - Exact text: `Loading the tutorials you have started.`
3. **`<span></span>`** — empty trailing slot (where the home page renders a `View all →` more link; the skeleton leaves it empty for this gallery).

### 3b. "In progress" row list (`<div class="latest-list">`)

Source: `progress.html:357-385` (CSS at `217-230, 278-280`)

#### Layout
- `.latest-list` — flex column.
- Each `.row` — grid `64px 1fr auto auto auto`, gap 24 px, align center, padding `22px 0`, `border-top: 1px solid var(--rule)`.

#### Cells per row (5 columns)
1. **`.ix` (column 1 — meter, NOT the row number)** — Plex Mono 11 px muted. **In progress rows replace the home page's "№ NNN" content with a left meter:**
   - Contains `<span class="meter" style="--p:NN%"><span></span></span>`.
   - `.meter` — height 10 px, `border: 1px solid var(--rule)`, background `var(--surface)`, position relative, overflow hidden.
   - Inner `<span>` — display block, height 100%, background `var(--accent)`, `width: var(--p, 50%)`.
   - The `--p` custom property is set inline per row to the % complete value (e.g. `--p:72%`).
2. **`.title`** — `font-variation-settings: "wdth" 90, "wght" 550`, 21 px, `letter-spacing: -0.02em`, `line-height: 1.2`. Color inherits `var(--ink)`.
   - Each title contains a `<small>` with `<sk-line w="72">` (72% shimmer line, 12 px tall) as a subtitle placeholder. The `<small>` rule: display block, color ink-dim, 12 px, `margin-top: 4px`, `letter-spacing: 0`.
3. **`.stack`** — Plex Mono 11 px ink-dim, `letter-spacing: 0.06em`.
4. **`.diff`** — Plex Mono 10 px, `letter-spacing: 0.16em`, uppercase, padding `4px 8px`, `1px solid` border. Variants:
   - `.diff.b` (BEGINNER) → color/border `var(--moss)` (`#8AA8FF`).
   - `.diff.i` (INTERMEDIATE) → color/border `var(--gold)` (`#FFC85C`).
   - `.diff.a` (ADVANCED) → color/border `var(--accent)` (`#FF9800`).
5. **`.time`** — Plex Mono 11 px ink-dim, `letter-spacing: 0.06em`.

#### Four rows (exact content, in order)

| # | Meter `--p` | Title | Stack | Diff | Time |
|---|-------------|-------|-------|------|------|
| 1 | `72%` | `Hosting a vertical-slice .NET API behind an Application Gateway` | `.NET · AZURE` | `INTERMEDIATE` (i, gold) | `38 MIN` |
| 2 | `31%` | `EF Core 9 migrations under load - what breaks first` | `EF CORE · SQL` | `ADVANCED` (a, accent) | `52 MIN` |
| 3 | `88%` | `Atomic responsive design for admin screens` | `BLAZOR · CSS` | `BEGINNER` (b, moss) | `21 MIN` |
| 4 | `54%` | `OAuth2 confidential clients, in one sitting` | `AUTH · IDENTITY` | `INTERMEDIATE` (i, gold) | `44 MIN` |

> The skeleton's `&middot;` entities render as the middle-dot `·` separator. **Note row 2's hyphen is a literal `-`, not an em-dash** (`progress.html:367` uses `migrations under load - what breaks first`). Mirror this exactly until the copy is finalised.

### 3c. "Bookmarked" `<header class="sect-head">`

Source: `progress.html:386`

#### Layout
- Same `.sect-head` chrome as 3a.

#### Children
1. **`<h2>`** — same typography as 3a, but the **entire heading is italic orange**: `<em>Bookmarked</em>` (the heading has no leading non-italic word).
2. **`.lead-col`** — text: `Saved references and next reads.`
3. **`<span></span>`** — empty trailing slot.

### 3d. "Bookmarked" row list

Source: `progress.html:387-415`

**The four bookmarked rows are identical to the "In progress" rows** in the skeleton (same title, meter %, stack, diff, time). This is intentional in the contract sheet so the meter style can be eyeball-compared. In the live app, the Bookmarked rows should:
- Drop the `--p` meter (or show it at 0% / hidden) since bookmarks aren't progress-tracked.
- Show a bookmark glyph (Material Symbols `bookmark` filled orange) in the `.ix` cell, OR fall back to the home-page `№ NNN` numbering.
- Sourced from a separate bookmarks API endpoint.

#### Four rows (exact content from the skeleton, in order)

Identical to 3b: same four titles, meters, stacks, diffs, times.

### Responsive
- **1100px:** `.sect-head { grid-template-columns: 1fr; gap: 16px; }`.
- **720px:** in addition to the 1100 rules, `.row` grid collapses to `42px 1fr` and `.stack`, `.diff`, `.time` reflow to column 2 (with `row-gap: 8px`).

### Checks for §3a–3b ("In progress" section)
- [ ] Section heading reads exactly `In progress` with **only `progress` italic orange** (`In ` is regular).
- [ ] Lead text reads exactly: `Loading the tutorials you have started.`
- [ ] Trailing slot is empty (no `View all →` link in this skeleton — verify the live app intentionally omits it or adds a Progress-specific link).
- [ ] Row list contains **exactly four rows** in the listed order.
- [ ] Each row's column 1 is a 10 px-tall orange meter with the **exact `--p` percentage** from the table (72%, 31%, 88%, 54%).
- [ ] Meter chrome: 1 px navy border, surface background, inner orange fill.
- [ ] Title text matches verbatim (note row 2's hyphen, not em-dash).
- [ ] Each title is followed by a `<sk-line w="72">` subtitle shimmer 4 px below.
- [ ] Difficulty pills use the three correct accent colors: moss `#8AA8FF`, gold `#FFC85C`, accent `#FF9800`.
- [ ] Stack column separator is the middle-dot `·` (not hyphen).
- [ ] Row top border is `1px solid var(--rule)` (every row, including the first — there is no special-case for the first row in the skeleton).

### Checks for §3c–3d ("Bookmarked" section)
- [ ] Section heading is **entirely italic orange `Bookmarked`** (no preceding regular word).
- [ ] Lead text reads exactly: `Saved references and next reads.`
- [ ] Trailing slot is empty.
- [ ] Row list contains **four rows** matching the skeleton (which duplicates the in-progress rows).
- [ ] **In the live app**, the meter column should either: render a bookmark glyph (`Material Symbols bookmark`), or revert to home's `№ NNN` numbering. The live behavior is a deviation from the skeleton — log as a `PROGRESS-` if it's missing.
- [ ] **Live components:** `progress-row` atom in `domain/src/lib/protected/progress-row` with inputs `percent: number`, `title`, `subtitle`, `stack`, `difficulty`, `time`. A separate `bookmark-row` (or a `mode` input on `progress-row`) swaps the meter for a bookmark icon.

---

## 4. `<ps-footer>` — Site footer

Source: `progress.html:418-429`. Identical to the public footer; see [`public/home.md` §7](../public/home.md#7-ps-footer--site-footer) for the full audit.

### Checks
- [ ] Footer chrome matches `public/home.md §7` verbatim — Foot-mark wordmark (Memory: foot-mark wordmark is canonical), three columns (Tutorials / Categories / Account), and `© 2026 · Prompt/Sharp` bottom row.
- [ ] **Live component:** same `frontend/projects/domain/src/lib/layout/public-footer` used by the home page.

---

## 5. Page-level visual checks (global)

- [ ] **Background radial gradients:** body `::before` overlay produces a soft orange glow at top-right + periwinkle glow at top-left + 1 px horizontal scan lines. Verify present.
- [ ] **Page horizontal padding** is `clamp(20px, 4vw, 64px)`.
- [ ] **No `font-family: serif`** anywhere — Mona Sans + IBM Plex Mono only.
- [ ] **Meter renders smoothly** — no jitter on the inner orange `<span>` width transition. If the live app animates the meter on first paint, verify `prefers-reduced-motion` is respected.
- [ ] **Skeleton primitives** — until real subtitle data is wired, `<sk-line>` shimmer should render gracefully under each title.
- [ ] **No leakage of admin tokens** — this is Pattern A, no `--md-sys-color-*` variables in scope.

---

## 6. Bug logging procedure

For every failed check above:

1. Open [`bugs/progress.md`](../../bugs/progress.md).
2. Append a new entry using the `PROGRESS-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 7. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| H1 missing italic-orange "the stack" | `protected/progress-page/progress-page.html` — wrap `the stack` in `<em>` inside `.display` |
| Sect-head missing italic on `progress` | Apply the italic-em pattern from `public/home.md` §3 — keep the leading non-italic word |
| `Bookmarked` heading not fully italic orange | The entire `<h2>` content is wrapped in `<em>` for this section; don't add a leading word |
| Meter not rendering | `progress-row.html` — bind `[style.--p.%]="percent()"` to `.meter span` and ensure the inner `<span>` exists |
| Meter wrong height / no border | `progress-row.scss` — `.meter { height: 10px; border: 1px solid var(--rule); background: var(--surface); }` |
| `percent` input unused | The `progress-row.ts` component must consume `percent: InputSignal<number>` and apply it to the meter CSS var — see `docs/frontend-audit.md` #6 |
| Title `<small>` shimmer missing | `progress-row.html` — append `<small><sk-line w="72"></sk-line></small>` to the title block |
| Difficulty pill colors wrong | `components/src/lib/difficulty-badge/difficulty-badge.scss` |
| Bookmarked rows still show meters | Branch the row template on `mode === 'bookmark'`; render `<md-icon>bookmark</md-icon>` or `№ NNN` in `.ix` instead |
| Row hyphen rendered as em-dash | Mirror the skeleton's literal hyphen until copy is finalised (this is a copy decision, not a CSS bug) |
| At 720 px row cells overlap | `.row` collapses to `42px 1fr` and `.stack/.diff/.time` move to `grid-column: 2; row-gap: 8px` |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before block |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
