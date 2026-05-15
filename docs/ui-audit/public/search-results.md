# Search Results — UI Audit

- **Route:** `/search?q=<term>`
- **Skeleton:** [`docs/skeletons/search-results.html`](../../skeletons/search-results.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono)
- **Bug log:** [`bugs/search-results.md`](../../bugs/search-results.md)
- **Live component:** `frontend/projects/domain/src/lib/catalog/search-page`

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
2. Open `http://localhost:4200/search?q=MediatR+pipeline` in one tab.
3. Open `docs/skeletons/search-results.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/search-results.md`](../../bugs/search-results.md) using ID prefix `SEARCH-`.

> Search results reuses the catalog shell, but **replaces the catalog header + toolbar with `<ps-search-bar>` + `<ps-search-meta>`**, and renders results as a row list (the `.latest-list` row component used on home) instead of a card grid. There is no filter rail.

---

## Composition (DOM order, from `search-results.html:336-408`)

```
<ps-nav>                ← shared sticky bar; active link = "Tutorials"
<ps-shell>
  ├─ <ps-search-bar>          ← page-specific
  ├─ <ps-search-meta>         ← result count + sort hint
  ├─ <ps-results-list>        ← .latest-list with row components
  └─ <ps-footer>              ← shared
</ps-shell>
```

Live counterpart: `frontend/projects/domain/src/lib/catalog/search-page/search-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-nav>` — shared sticky navigation bar

Verify against [`home.md` § 1. ps-nav](./home.md#1-ps-nav--sticky-navigation-bar). The active link on this route is **`Tutorials`** (the search route lives under the tutorials tab).

### Checks
- [ ] Active link is `Tutorials` (orange underline).
- [ ] Wordmark, links, Sign-in button match home.md spec.

---

## 2. `<ps-search-bar>` — Big query box (hero replacement)

Source: `search-results.html:353-360`

### Layout
- Class `page-hero`.
- `.page-hero` base: `padding: 72px 0 48px`, `border-bottom: 1px solid var(--rule)` (`#003E80`).
- No `.hero-grid` class — single-column stack.

### `.eyebrow`
- `<div class="eyebrow"><span class="dot"></span>Search</div>`
- IBM Plex Mono **11px**, weight 500, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)`.
- `.dot`: 6×6 orange square, `margin-right: 10px`.
- Text content: `Search` (rendered uppercase via the `eyebrow` class `text-transform`).

### `.search-box` (inline-style `margin-top: 20px`)
- Grid `auto 1fr auto`, gap **14px**, `align-items: center`.
- `border: 1px solid var(--rule)`, `background: var(--surface)` (`#002A54`), `padding: 18px`.

#### Cell 1 (`<span class="mono">`)
- Exact text: `query =`
- IBM Plex Mono **12px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)` (`#C5CDE4`).

#### Cell 2 (`<span class="query">`)
- Exact text: `"MediatR pipeline"` (with literal double-quotes; replace with whatever query is bound).
- `font-size: clamp(24px, 4vw, 44px)`, `color: var(--ink)` (`#FBFFFF`).
- Inherits Mona Sans from body (no explicit variation settings — should remain at default `wdth 100 / wght 400`).

#### Cell 3 (`<button class="btn solid">Search</button>`)
- Solid orange button:
  - `inline-flex`, gap 10px, padding `12px 22px`, `border: 1px solid var(--accent)`, `background: var(--accent)`, `color: var(--bg)`.
  - IBM Plex Mono **12px**, weight **600**, `letter-spacing: 0.1em`, uppercase, `line-height: 1`, `min-height: 42px`.
  - Cursor pointer.
- Label: `Search` (capitalized in source; rendered uppercase by the `.btn`'s `text-transform`).

### Responsive
- **720px:** `.page-hero` padding reduces to `48px 0 28px`. The `.search-box` grid columns are not redefined — it remains `auto 1fr auto`. Verify the query cell remains responsive (it uses `clamp(24px, 4vw, 44px)`).

### Checks
- [ ] Eyebrow text is literal `Search` with the 6×6 orange square dot.
- [ ] Search box is a single 1-px bordered surface block (`#003E80` border, `#002A54` background) with 18 px padding.
- [ ] Three cells inside: `query =` label (Plex Mono 12px ink-dim) / live query value (Mona Sans, ~24-44 px ink) / orange solid `Search` button.
- [ ] The query string is wrapped in literal double-quotes in the skeleton — verify whether the live app strips or keeps them.
- [ ] Solid Search button: orange background, dark text, uppercase Plex Mono, `min-height: 42px`, no shadow.
- [ ] Gap between cells is 14 px.
- [ ] At 720 px the search box stays on one line if possible; the query text scales fluidly.
- [ ] **Live component:** `frontend/projects/domain/src/lib/catalog/search-bar`. Verify it exposes a `query` input and emits a `submit` event on the orange button. The `query =` literal label is content — should not be removed.

---

## 3. `<ps-search-meta>` — Results count + sort hint

Source: `search-results.html:361-363`

### Layout
- Class `section-block` with inline override `padding-top: 24px; padding-bottom: 24px;`.
- `.section-block` base: `padding: 72px 0 48px; border-bottom: 1px solid var(--rule);` — but the inline padding override **reduces vertical space** to 24/24.
- Bottom border remains 1px `--rule`.

### Content
- Single `<div class="mono">412 results · sorted by relevance</div>`.
- IBM Plex Mono **12px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)`.
- HTML entity `&middot;` (`·`) between segments.

### Responsive
- No specific media query changes; padding remains 24/24 across breakpoints.

### Checks
- [ ] Single mono line reads `412 results · sorted by relevance` in Plex Mono 12px ink-dim.
- [ ] Section has tight 24 px vertical padding (NOT the default 72/48).
- [ ] Bottom 1-px rule between meta and results list.
- [ ] **Live component:** `frontend/projects/domain/src/lib/catalog/search-meta`. The component should accept `count` and `sortLabel` inputs. Avoid hard-coding `412`.

---

## 4. `<ps-results-list>` — Result rows (reuses `.latest-list` row pattern)

Source: `search-results.html:364-393`

### Container
- Class `section-block` with inline override `padding-top: 0;`. Default `padding: 0 0 48px` and bottom border `1px solid var(--rule)`.
- Inner `<div class="latest-list">`: flex column.

### Row structure (`.row`)
- Grid: `64px 1fr auto auto auto`, gap **24px**, `align-items: center`.
- Padding `22px 0`.
- `border-top: 1px solid var(--rule)` per row (first row also has the rule from the section-block's bottom-of-meta border — verify no doubled rule).

### Row cells (left → right)
1. **`.ix`** (number) — Plex Mono **11px**, `color: var(--muted)`, `letter-spacing: 0.06em`. Format `No. NNN`.
2. **`.title`** — Mona Sans `wdth 90 / wght 550`, **21px**, `letter-spacing: -0.02em`, `line-height: 1.2`. Contains a `<small>` line:
   - `<small>` styles: `display: block`, `color: var(--ink-dim)`, **12px**, `margin-top: 4px`, `letter-spacing: 0`.
   - In the skeleton the `<small>` slot is filled with `<sk-line w="72"></sk-line>` (a 12 px shimmer bar at 72% width) — the live app should render the tutorial's subtitle here.
3. **`.stack`** — Plex Mono **11px**, `color: var(--ink-dim)`, `letter-spacing: 0.06em`. Tech stack tags joined by `·` (e.g. `.NET · AZURE`).
4. **`.diff`** — Plex Mono **10px**, `letter-spacing: 0.16em`, uppercase, padding `4px 8px`, `border: 1px solid currentColor`. Variants:
   - `.diff.b` (BEGINNER) → `color/border: var(--moss)` (`#8AA8FF`)
   - `.diff.i` (INTERMEDIATE) → `color/border: var(--gold)` (`#FFC85C`)
   - `.diff.a` (ADVANCED) → `color/border: var(--accent)` (`#FF9800`)
5. **`.time`** — Plex Mono **11px**, `color: var(--ink-dim)`, `letter-spacing: 0.06em` (e.g. `38 MIN`, `1H 04M`).

### Four rows (exact content)

| # | `.ix` | `.title` | `.stack` | `.diff` | `.time` |
|---|-------|----------|----------|---------|---------|
| 1 | `No. 412` | `Hosting a vertical-slice .NET API behind an Application Gateway` + shimmer subtitle | `.NET · AZURE` | `i` INTERMEDIATE | `38 MIN` |
| 2 | `No. 411` | `EF Core 9 migrations under load - what breaks first` + shimmer subtitle | `EF CORE · SQL` | `a` ADVANCED | `52 MIN` |
| 3 | `No. 410` | `Atomic responsive design for admin screens` + shimmer subtitle | `BLAZOR · CSS` | `b` BEGINNER | `21 MIN` |
| 4 | `No. 409` | `OAuth2 confidential clients, in one sitting` + shimmer subtitle | `AUTH · IDENTITY` | `i` INTERMEDIATE | `44 MIN` |

Note: the skeleton uses `No.` (with period). The home audit references `№` (numero sign). If the live app standardizes on `№`, prefer that — flag the divergence in the bug log.

Note 2: Row 2 title uses an ASCII hyphen `-`, not an em-dash (`EF Core 9 migrations under load - what breaks first`). Verify whether the live tutorial titles store hyphens or em-dashes.

### Responsive
- **720px:** the row grid collapses to `42px 1fr`, with `.stack`, `.diff`, and `.time` reflowing to `grid-column: 2` with `row-gap: 8px`. So at narrow widths each row becomes a small block with the number on the left and the title + metadata stacking vertically on the right.

### Checks
- [ ] Exactly 4 rows in the skeleton DOM order with descending numbers `412 → 409`.
- [ ] Each row has the 5-cell grid: number / title-with-subtitle / stack / difficulty pill / time.
- [ ] Titles match the table above verbatim.
- [ ] Stack tags use HTML middot (`·`) separators, uppercase, Plex Mono 11px ink-dim.
- [ ] Difficulty pills use the three correct accent colors (moss / gold / accent) with `1px solid currentColor` borders, 10 px Plex Mono uppercase.
- [ ] Subtitle slot under each title renders a shimmer `<sk-line>` (72% width) until live data wires the actual subtitle.
- [ ] Title size is **21px** (not 22px as on home — single-pixel diff worth catching).
- [ ] Row padding is 22 px top/bottom.
- [ ] At 720 px the row collapses to 2 columns (42 px / 1fr) with stack/diff/time wrapping under the title.
- [ ] **Live components:** `frontend/projects/domain/src/lib/catalog/search-page` (composer) — must reuse the same row component used by `latest-tutorials`. The row should be a shared `tutorial-row` atom rather than inline `<div class="row">` markup. If no such atom exists yet, extract one from the home audit's recommendation.

---

## 5. `<ps-footer>` — shared site footer

Verify against [`home.md` § 7. ps-footer](./home.md#7-ps-footer--site-footer). Identical markup.

### Checks
- [ ] Foot-mark at 64 px with italic-orange slash.
- [ ] Three link columns: Tutorials / Categories / Account.
- [ ] `© 2026 · Prompt/Sharp` left-aligned.
- [ ] Reflows correctly at 1100/720 px.

---

## 6. Page-level visual checks (global)

- [ ] **Background radial gradients:** orange + periwinkle glows + horizontal scan lines (note the search skeleton also uses the **0.18** orange opacity).
- [ ] **Horizontal page padding** `clamp(20px, 4vw, 64px)`.
- [ ] **Custom-element registration** for `ps-search-bar`, `ps-search-meta`, `ps-results-list` resolves without console warnings.
- [ ] **Skeleton primitives** render shimmer gracefully — the title subtitles should always show a 72%-width line until data wires up.
- [ ] **Empty state:** no skeleton in this page for "0 results" — verify the live app handles that case (the bug log should flag it as missing-from-spec).
- [ ] **Query reflection:** the value in the search box should reflect the active `?q=…` URL parameter, not a hard-coded `"MediatR pipeline"`.

---

## 7. Bug logging procedure

For every failed check above:

1. Open [`bugs/search-results.md`](../../bugs/search-results.md).
2. Append a new entry using the `SEARCH-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Search box border missing / wrong color | `domain/src/lib/catalog/search-bar/search-bar.scss` |
| `query =` label missing | `search-bar.html` |
| Query value not bound to URL `?q=` | `search-page.ts` — bind route `queryParamMap` to the bar |
| Solid Search button wrong color | `components/src/lib/button/button.scss` (`.btn--solid`) |
| Result count hard-coded | `search-meta.ts` — accept `count` input |
| Section padding doesn't tighten to 24/24 on `<ps-search-meta>` | `search-meta.scss` — override `.section-block` padding |
| Result rows rendered as cards instead of `.latest-list` rows | `search-page.html` — use row component, not card grid |
| Subtitle slot empty under each title | `tutorial-row.html` — render `<small>` with subtitle or shimmer |
| Title size wrong (22 px instead of 21 px) | row component SCSS |
| Difficulty pill colors wrong | `components/src/lib/difficulty-badge/difficulty-badge.scss` |
| `No.` vs. `№` mismatch | row component template — match agreed convention |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
