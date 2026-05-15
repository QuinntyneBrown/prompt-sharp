# Category — UI Audit

- **Route:** `/categories/:slug` (e.g. `/categories/dotnet-api-foundations`)
- **Skeleton:** [`docs/skeletons/category.html`](../../skeletons/category.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono)
- **Bug log:** [`bugs/category.md`](../../bugs/category.md)
- **Live component:** `frontend/projects/domain/src/lib/catalog/category-page`

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
2. Open `http://localhost:4200/categories/dotnet-api-foundations` (or any seeded category slug) in one tab.
3. Open `docs/skeletons/category.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/category.md`](../../bugs/category.md) using ID prefix `CATEGORY-`.

> The category page is **almost identical to `catalog.md`** — same `<ps-catalog-body>` layout (filter rail + card grid), same shared nav + footer. The diff is the `<ps-category-hero>` block on top of the page (replacing `<ps-catalog-header>` + `<ps-catalog-toolbar>`). Focus checks on the hero; for the body/filter/grid, reuse `catalog.md` § 4 and § 5 with the smaller chip-set noted below.

---

## Composition (DOM order, from `category.html:336-459`)

```
<ps-nav>                ← shared sticky bar; active link = "Categories"
<ps-shell>
  ├─ <ps-category-hero>      ← the page-specific block
  ├─ <ps-catalog-body>       ← reused from catalog.html
  │   ├─ <aside class="filter-rail">
  │   └─ <ps-catalog-grid>   (6 tutorial-cards in skeleton)
  └─ <ps-footer>             ← shared
</ps-shell>
```

Live counterpart: `frontend/projects/domain/src/lib/catalog/category-page/category-page.html`. Verify it composes `category-hero` + `catalog-body` rather than redefining either inline.

---

## 1. `<ps-nav>` — shared sticky navigation bar

Verify against [`home.md` § 1. ps-nav](./home.md#1-ps-nav--sticky-navigation-bar). The active link on this route is **`Categories`** (orange underline overlapping the bottom rule).

### Checks
- [ ] Active link is `Categories` (NOT `Tutorials`).
- [ ] Wordmark, links, Sign-in button match home.md spec.

---

## 2. `<ps-category-hero>` — Category page hero (the page-specific block)

Source: `category.html:351-360`

### Layout
- Class `page-hero hero-grid`.
- `.page-hero` base: `padding: 72px 0 48px`, `border-bottom: 1px solid var(--rule)`.
- `.hero-grid`: `display: grid; grid-template-columns: 1.25fr 1fr; gap: 48px; align-items: start;`.

### Left column

#### Eyebrow
- `<div class="eyebrow"><span class="dot"></span>CATEGORY</div>`
- IBM Plex Mono **11px**, weight 500, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)` (`#6B7AAF`).
- `.dot` is a **6×6** square (not circular), `background: var(--accent)` (`#FF9800`), `margin-right: 10px`, `vertical-align: middle`.
- Literal text: `CATEGORY` (uppercase as content, not via CSS).

#### Display headline
- Exact markup: `<h1 class="display">.NET API <em>Foundations</em></h1>`
- The first half (`.NET API`) is base display: Mona Sans, `wdth 75 / wght 600`, ink color.
- `<em>` ("Foundations"): italic, `wdth 85 / wght 500`, `color: var(--accent)`.
- Common: `letter-spacing: -0.035em`, `line-height: 0.92`.
- Size: from `.page-hero h1.display`: `clamp(48px, 8vw, 112px)`, `margin: 0 0 24px`.
- Reads as the category name with the descriptor word italicized in orange. **For other categories** the live app should follow the same `<title> <em>accent</em>` pattern (e.g. `Blazor & <em>Atomic UI</em>`).

### Right column — `.panel` (count + difficulty mix)

- `<div class="panel">`
- Panel styles: `border: 1px solid var(--rule)`, `background: linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06)), var(--surface)`, `padding: 24px`.

#### `.mono` line — count + difficulty mix row
- Exact text: `142 tutorials · 54 beginner · 68 intermediate · 20 advanced`
- IBM Plex Mono **12px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)` (`#C5CDE4`).
- Uses HTML entities `&middot;` (rendered as `·`) between segments.

#### `.skeleton-stack` (below the mono row, `margin-top: 18px`)
- Flex column, gap 8px.
- Two `<sk-line>` shimmer placeholders:
  - `<sk-line w="96"></sk-line>` (96% width, 12px tall)
  - `<sk-line w="72" delay="1"></sk-line>` (72% width, offset shimmer)
- Each line is the standard shimmer (background `linear-gradient` `#002A54 → #003E80 → #002A54`, animated 3.2 s).

### Responsive
- **1100px and below:** `.hero-grid` collapses to `grid-template-columns: 1fr` (stacked).
- **720px:** `.page-hero` padding reduces to `48px 0 28px`; headline scales to `clamp(42px, 12vw, 72px)`.

### Checks
- [ ] Eyebrow text is literal `CATEGORY` (uppercase), preceded by the 6×6 orange square dot.
- [ ] Display headline shows the category name as plain Mona Sans (`wdth 75 / wght 600`) followed by an italic orange descriptor word (`Foundations` in the skeleton).
- [ ] Headline scales between 48 px and 112 px.
- [ ] Right panel is a bordered surface with the warm-orange gradient overlay (`linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06))`), not a flat surface.
- [ ] Mono row inside the panel reads: `142 tutorials · 54 beginner · 68 intermediate · 20 advanced` (or category-specific numbers driven by data) in Plex Mono 12px ink-dim, with `·` separators (HTML middot).
- [ ] Below the mono row two shimmer `sk-line`s (96% then 72%), gap 8 px, offset animations.
- [ ] Hero has a bottom hairline rule.
- [ ] At 1100 px the panel drops below the headline (single column).
- [ ] **Live component:** `frontend/projects/domain/src/lib/catalog/category-hero`. Inputs likely: `name`, `accentWord`, `counts: { total, beginner, intermediate, advanced }`. Verify the panel uses the gradient overlay and the eyebrow uses the shared atom — don't reinvent.

---

## 3. `<ps-catalog-body>` → filter rail + card grid

The hero is followed by `<ps-catalog-body class="catalog-layout">`. Layout, filter rail behavior, and card structure are **identical to `catalog.md` § 4 and § 5**, with the differences below.

### Container
- `.catalog-layout`: `grid-template-columns: 240px 1fr; padding: 40px 0 80px; border-bottom: 1px solid var(--rule);`. Skeleton omits the explicit gap declared on the catalog page; component should match catalog's 48 px gap.

### Filter rail — diffs vs. catalog
- The category skeleton ships **2 groups** (not 4): `Category` and `Difficulty`.
- Active row: `.NET` is the `.on` chip (not `All`).
- Category chip rows (in order):
  - `All` · 412
  - `.NET` · 142 ← **active** (`.on`)
  - `Blazor` · 68
  - `Azure` · 94
  - `EF Core` · 41
  - `Auth / RBAC` · 23
- Difficulty group renders inline pills via `.chip-row`, not `.filter-chip` rows:
  - `All` (`<span class="chip accent">`) — orange-bordered, orange-text chip
  - `Beginner` (`<span class="chip">`) — neutral
  - `Intermediate` (`<span class="chip">`)
  - `Advanced` (`<span class="chip">`)
- **Note:** This is a thinner rail than catalog. The live `filter-rail` component should accept a config for which groups to show; do NOT render the Duration / Tags groups on category routes.

### Card grid — diffs vs. catalog
- 6 cards in DOM order (not 9). Each is a plain `<article class="tutorial-card">` (not the `<ps-tutorial-card>` element in catalog.html — note this difference if the live app standardizes on one).
- Cards:
  1. Badges: `DEEP DIVE` (accent) + `.NET 9`. Title: `Wiring MediatR into a Clean Architecture API`. Footer: `22 steps · 58 MIN` + `INTERMEDIATE`.
  2. Badges: `AZURE` (accent) + `RBAC`. Title: `RBAC, properly - claims and policy design` (note ASCII hyphen, not em-dash). Footer: `14 steps · 36 MIN` + `ADVANCED`.
  3. Badges: `BLAZOR` (accent) + `UI`. Title: `Atomic design for Blazor components`. Footer: `9 steps · 24 MIN` + `BEGINNER`.
  4. Badges: `EF CORE` (accent) + `SQL`. Title: `EF Core 9 migrations under load`. Footer: `18 steps · 52 MIN` + `ADVANCED`.
  5. Badges: `AUTH` (accent) + `OAUTH2`. Title: `OAuth2 confidential clients, in one sitting`. Footer: `12 steps · 44 MIN` + `INTERMEDIATE`.
  6. Badges: `ASPIRE` (accent) + `OPS`. Title: `Aspire dashboards for local development`. Footer: `16 steps · 41 MIN` + `INTERMEDIATE`.
- Each card body has only an `<h3>` + a `.skeleton-stack` with two `<sk-line>`s (no `.desc` paragraph here — diff vs. catalog).
- Footer markup is `<span><b>{steps}</b> steps · {time}</span><span>{DIFFICULTY}</span>`. The right span is **unstyled bordered text** in the skeleton (no `.diff.b/i/a` color class), but the live app should treat it as a difficulty pill matching catalog.

### Skeleton stack inside card body
- Two `<sk-line>`s replacing the `.desc` paragraph: `w="100"` then `w="76" delay="1"`.

### Responsive (inherits the catalog skeleton media queries)
- **1100px:** `.catalog-layout` → `grid-template-columns: 1fr`, `.filter-rail` becomes static.
- **1100px:** `.card-grid` → `repeat(2, 1fr)`.
- **720px:** `.card-grid` → `1fr`.

### Checks (on top of catalog § 4/§ 5)
- [ ] Filter rail shows only **Category** and **Difficulty** groups — no Duration, no Tags.
- [ ] Active category chip is `.NET` (orange `■`), not `All`.
- [ ] Difficulty is rendered as a `chip-row` with `All` as the orange-bordered active chip (`.chip.accent`), not as filter-chip rows.
- [ ] Six cards in the exact order/badges/titles/steps above.
- [ ] Each card has two chips (first one is `.chip.accent` — orange border + orange text — second is neutral) at the top-left over the thumb.
- [ ] Card 2's title contains an ASCII hyphen `-` (`RBAC, properly - claims …`), NOT an em-dash. Verify whichever is intended in the live data; if live shows em-dash this is a content drift to flag.
- [ ] At 1100 px the rail unsticks and stacks above; cards reflow to 2 columns.
- [ ] At 720 px cards reflow to 1 column.
- [ ] **Live component (rail):** `frontend/projects/domain/src/lib/catalog/filter-rail`. The component must support a "category mode" with fewer groups and a different difficulty rendering.
- [ ] **Live component (grid):** `frontend/projects/domain/src/lib/catalog/catalog-grid`. Cards should be `ps-tutorial-card` (see `frontend-audit.md` #1).

---

## 4. `<ps-footer>` — shared site footer

Verify against [`home.md` § 7. ps-footer](./home.md#7-ps-footer--site-footer). Identical markup.

### Checks
- [ ] Foot-mark at 64 px with italic-orange slash.
- [ ] Three link columns: Tutorials / Categories / Account.
- [ ] `© 2026 · Prompt/Sharp` left-aligned.
- [ ] Reflows correctly at 1100/720 px.

---

## 5. Page-level visual checks (global)

- [ ] **Background radial gradients:** body `::before` shows orange + periwinkle glows + horizontal scan lines.
  - **Note:** the category skeleton uses orange glow at **rgba(255, 152, 0, 0.18)** opacity vs. home's 0.16. Verify the live app's `styles.scss` uses the higher 0.18 value on category routes (or unify).
- [ ] **Horizontal page padding** `clamp(20px, 4vw, 64px)`.
- [ ] **No `<ps-marquee>`** on this page (unlike home).
- [ ] **No `<ps-pagination>`** in the skeleton — but the live app likely needs it once data exceeds one page. Verify whether pagination is wired in `category-page`.
- [ ] **Custom-element registration** for `ps-category-hero`, `ps-catalog-body`, `ps-catalog-grid` resolves without warnings.
- [ ] **Skeleton primitives** render shimmer gracefully.

---

## 6. Bug logging procedure

For every failed check above:

1. Open [`bugs/category.md`](../../bugs/category.md).
2. Append a new entry using the `CATEGORY-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 7. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Category hero missing italic-orange accent word | `domain/src/lib/catalog/category-hero/category-hero.html` |
| Hero panel missing warm gradient overlay | `category-hero.scss` (`.panel { background: linear-gradient(...) , var(--surface) }`) |
| Mono difficulty-mix row in wrong font | `category-hero.scss` (`.mono` definition) |
| Shimmer skeleton-stack missing under panel | `category-hero.html` (two `<sk-line>` placeholders) |
| Filter rail showing Duration / Tags on category route | `domain/src/lib/catalog/filter-rail` — gate groups by mode input |
| Active category chip not `.NET` | `category-page.ts` — wire selected slug into rail |
| Difficulty rendered as filter-chip rows instead of inline pills | `filter-rail` template variant |
| Cards using `<article>` instead of `ps-tutorial-card` | `catalog-grid.html` — see `docs/frontend-audit.md` #1 |
| Background orange glow opacity wrong (0.16 vs 0.18) | `frontend/projects/promp-sharp/src/styles.scss` body::before |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/CATEGORY-001-category-page-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/category/category-desktop.png`; `docs/ui-audit/screenshots/category/category-tablet.png`; `docs/ui-audit/screenshots/category/category-mobile.png`
