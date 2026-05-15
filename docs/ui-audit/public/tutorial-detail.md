# Tutorial Detail — UI Audit

- **Route:** `/tutorials/:slug`
- **Skeleton:** [`docs/skeletons/tutorial-detail.html`](../../skeletons/tutorial-detail.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono)
- **Bug log:** [`bugs/tutorial-detail.md`](../../bugs/tutorial-detail.md)
- **Live component:** `frontend/projects/domain/src/lib/tutorial/tutorial-detail-page`

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
2. Open `http://localhost:4200/tutorials/wiring-mediatr-clean-architecture-api` (or any seeded slug) in one tab.
3. Open `docs/skeletons/tutorial-detail.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/tutorial-detail.md`](../../bugs/tutorial-detail.md) using ID prefix `TUTORIAL-`.

---

## Composition (DOM order, from `tutorial-detail.html:336-460`)

```
<ps-nav>                ← shared sticky bar; active link = "Tutorials"
<ps-shell>
  ├─ <ps-crumbs>             ← breadcrumb path
  ├─ <ps-tutorial-hero>      ← title + meta + tile
  ├─ <section class="detail-layout">
  │   ├─ <ps-tutorial-toc>   ← sticky table of contents
  │   └─ <ps-tutorial-body>  ← reading content
  │       └─ <ps-tutorial-nav> ← prev/next inside the body
  ├─ <ps-related>            ← related tutorials section header + card grid
  └─ <ps-footer>             ← shared
</ps-shell>
```

Live counterpart: `frontend/projects/domain/src/lib/tutorial/tutorial-detail-page/tutorial-detail-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-nav>` — shared sticky navigation bar

Verify against [`home.md` § 1. ps-nav](./home.md#1-ps-nav--sticky-navigation-bar). The active link on this route is **`Tutorials`**.

### Checks
- [ ] Active link is `Tutorials` (orange underline).
- [ ] Wordmark, links, Sign-in button match home.md spec.

---

## 2. `<ps-crumbs>` — Breadcrumb path

Source: `tutorial-detail.html:351-353`

### Layout
- Class `section-block` with inline override `padding: 24px 0;` (tight, no border-bottom override).
- `.section-block` base inherits `border-bottom: 1px solid var(--rule)`.

### Content
- `<div class="mono">Tutorials / .NET / Clean Architecture</div>`
- IBM Plex Mono **12px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)` (`#C5CDE4`).
- Segments separated by ` / ` (literal slashes with single spaces). No special styling on the slash — they remain ink-dim like the rest of the line.

### Responsive
- No specific change; same tight padding across breakpoints.

### Checks
- [ ] Breadcrumb reads `Tutorials / .NET / Clean Architecture` in Plex Mono 12px ink-dim.
- [ ] Padding tight at 24 px top/bottom (NOT default 72/48).
- [ ] Bottom 1-px rule between crumbs and hero.
- [ ] **Live component:** `frontend/projects/domain/src/lib/tutorial/tutorial-breadcrumbs`. Accept a `crumbs: string[]` input and render slashes between segments. Slashes should NOT be orange — only ink-dim.

---

## 3. `<ps-tutorial-hero>` — Title + meta + tile

Source: `tutorial-detail.html:354-362`

### Layout
- Class `page-hero hero-grid`.
- `.page-hero` base: `padding: 72px 0 48px`, `border-bottom: 1px solid var(--rule)`.
- `.hero-grid`: `grid-template-columns: 1.25fr 1fr; gap: 48px; align-items: start;`.

### Left column

#### `.eyebrow`
- `<div class="eyebrow"><span class="dot"></span>TUTORIAL № 412</div>`
- IBM Plex Mono **11px**, weight 500, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)`.
- `.dot`: 6×6 orange square, `margin-right: 10px`.
- Literal text after dot: `TUTORIAL № 412` — note the `&numero;` entity (`№`) rendered between space-separated.

#### `<h1 class="display">`
- Exact text: `Wiring MediatR into a Clean Architecture <em>API</em>`
- `<em>` ("API"): italic, `wdth 85 / wght 500`, `color: var(--accent)`.
- Base: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`.
- Size: `clamp(48px, 8vw, 112px)`, `margin: 0 0 24px`.

#### `.chip-row` (below the headline)
- Flex row, flex-wrap, gap 8px, `align-items: center`.
- Four `.chip`s in order:
  1. `.chip.accent` — `.NET 9` (orange border, orange text)
  2. `.chip` — `MediatR` (neutral)
  3. `.chip` — `22 steps`
  4. `.chip` — `58 min`
- Each chip: inline-flex, gap 6px, Plex Mono **10px**, `letter-spacing: 0.12em`, padding `4px 8px`, `background: var(--bg)`, `color: var(--ink)` (or accent for `.accent`), `border: 1px solid var(--rule)` (or accent), `text-transform: uppercase`.

#### `.mono` byline (inline `margin-top: 18px`)
- Exact text: `By Alex Chen · Updated May 2026`
- IBM Plex Mono **12px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)`.

### Right column — `<sk-tile>`
- A standalone shimmer tile (no wrapper).
- `aspect-ratio: 16/10`, full width of the column, `min-height: 80px`.
- Shimmer background `linear-gradient(100deg, #002A54 0%, #002A54 28%, #003E80 50%, #002A54 72%, #002A54 100%)`, animated 3.2 s.
- `border: 1px solid #001A36`.

### Responsive
- **1100px:** `.hero-grid` collapses to single column; tile drops below the meta block.
- **720px:** `.page-hero` padding reduces to `48px 0 28px`; headline scales to `clamp(42px, 12vw, 72px)`.

### Checks
- [ ] Eyebrow text is literal `TUTORIAL № 412` with the 6×6 orange dot prefix and the numero sign `№` (not `No.`).
- [ ] Display headline reads `Wiring MediatR into a Clean Architecture API` with **only** `API` italic orange (`<em>`).
- [ ] Four chips in the exact order: orange-bordered `.NET 9`, neutral `MediatR`, neutral `22 steps`, neutral `58 min`. Note the lowercase `steps` / `min` units inside chips.
- [ ] Byline reads `By Alex Chen · Updated May 2026` in Plex Mono 12px ink-dim with the middot separator.
- [ ] Right column shows a single shimmer `sk-tile` at 16:10 aspect (no overlay chips, no overlay badge — unlike the home hero card).
- [ ] Hero has a bottom hairline rule.
- [ ] At 1100 px the tile drops below; at 720 px the headline shrinks.
- [ ] **Live component:** `frontend/projects/domain/src/lib/tutorial/tutorial-hero`. Inputs: `numero`, `title`, `accentWord`, `chips`, `author`, `updatedAt`, `coverImage`. The italic-orange word is the LAST word of the title (here: `API`); the live component must split title into base + accent rather than rendering plain text.

---

## 4. `<section class="detail-layout">` — Two-column reading area

Source: `tutorial-detail.html:363-377`

### Container layout
- `.detail-layout`: `display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 48px; align-items: start; padding: 40px 0 72px; border-bottom: 1px solid var(--rule);`.

### Responsive
- **1100px:** collapses to `grid-template-columns: 1fr`; `.toc` becomes `position: static`.
- **720px:** same single column.

### Checks (container only)
- [ ] Two-column 260 / 1fr grid at desktop with 48 px gap.
- [ ] Bottom hairline rule (separates reading area from `<ps-related>`).
- [ ] At 1100 px the TOC unsticks and reflows above the body.

---

## 5. `<ps-tutorial-toc>` — Sticky table of contents

Source: `tutorial-detail.html:364-369`

### Layout
- Class `toc`.
- `position: sticky; top: 104px;`.
- `border-left: 1px solid var(--rule)`, `padding-left: 18px`.

### Content

#### Eyebrow
- `<div class="eyebrow">Steps</div>`
- Plex Mono **11px**, weight 500, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)`.
- Text: `Steps` (rendered uppercase via CSS).
- **No** `.dot` prefix here (unlike most eyebrows).

#### `<ol>`
- `list-style: none`, padding 0, `margin: 16px 0 0`, `display: grid`, `gap: 12px`.

#### Five `<li>` items
- Each: Plex Mono **12px**, `color: var(--ink-dim)`, `display: flex`, `gap: 10px`.
- The leading number is wrapped in `<b>`: `color: var(--accent)`, `font-weight: 600`.
- Items in order:
  1. `<b>01</b> Project shape`
  2. `<b>02</b> Requests and handlers`
  3. `<b>03</b> Validation pipeline`
  4. `<b>04</b> Transaction boundary`
  5. `<b>05</b> Logging behavior`

### Checks
- [ ] TOC is sticky at `top: 104px` while scrolling the body.
- [ ] Left border `1px solid #003E80` runs the full TOC height with `padding-left: 18px` content offset.
- [ ] Eyebrow text reads `Steps` (uppercase, muted) with NO dot prefix.
- [ ] Five items in the exact order and text above.
- [ ] Step numbers `01`-`05` are orange weight 600 (zero-padded to two digits).
- [ ] Step text is Plex Mono 12 px ink-dim.
- [ ] Gap between items is 12 px.
- [ ] At 1100 px the TOC unsticks and stacks above the body content.
- [ ] **Live component:** `frontend/projects/domain/src/lib/tutorial/tutorial-toc`. Accept `steps: { number, title }[]`. The sticky position must use `top: 104px` (matches the nav height + breathing room).

---

## 6. `<ps-tutorial-body>` — Reading content with code-blocks

Source: `tutorial-detail.html:370-376`

### Layout
- No explicit layout class — it's a block element flowed in the right grid cell.
- Children stack naturally; vertical rhythm is controlled by each child's own margin/padding.

### Children (in DOM order)

#### Child 1 — `.skeleton-stack` (intro paragraph placeholder)
- Flex column, gap 8px.
- Three `<sk-line>`s:
  1. `<sk-line size="lg" w="92"></sk-line>` — **18 px** tall (the `size="lg"` modifier), 92% width.
  2. `<sk-line w="100"></sk-line>` — 12 px tall, 100% width.
  3. `<sk-line w="82" delay="1"></sk-line>` — 12 px tall, 82% width, offset shimmer.

#### Child 2 — `.code-block`
- `border: 1px solid var(--rule)`, `background: var(--surface-2)` (`#003E80AA`).
- `padding: 18px`, `margin: 22px 0`.
- `position: relative` (anchor for the Copy chip).

##### `.code-block .copy` (top-right chip)
- `<span class="chip copy">Copy</span>`.
- Absolute `top: 12px; right: 12px`.
- Standard chip styles (Plex Mono 10px, `letter-spacing: 0.12em`, padding `4px 8px`, `background: var(--bg)`, `color: var(--ink)`, `border: 1px solid var(--rule)`, uppercase). Skeleton shows literal `Copy` (the `text-transform: uppercase` will render `COPY`).

##### `.code-block .caption`
- `<div class="mono caption">Program.cs</div>`
- `.mono` base + `.caption` override: `margin-bottom: 16px`, `color: var(--accent-2)` (`#8AA8FF`, periwinkle).
- So this line is filename + periwinkle accent.

##### `.code-block .skeleton-stack`
- Three `<sk-line>`s representing code rows (12 px tall by default):
  1. `<sk-line w="88"></sk-line>`
  2. `<sk-line w="64" delay="1"></sk-line>`
  3. `<sk-line w="78" delay="2"></sk-line>`

#### Child 3 — `.skeleton-stack` (second paragraph placeholder)
- Same shape as Child 1 with different widths:
  1. `<sk-line size="lg" w="78"></sk-line>` (18 px tall)
  2. `<sk-line w="96"></sk-line>`
  3. `<sk-line w="70" delay="1"></sk-line>`

#### Child 4 — `.code-block` (second code block)
- Same structure as Child 2.
- Caption: `<div class="mono caption">ValidationBehavior.cs</div>` (periwinkle).
- Three code rows: `<sk-line w="92">`, `<sk-line w="74" delay="1">`, `<sk-line w="84" delay="2">`.

#### Child 5 — `<ps-tutorial-nav>` (prev/next inside body)
- Class `panel` with inline override `display: flex; justify-content: space-between; gap: 16px;`.
- `.panel`: `border: 1px solid var(--rule)`, `background: linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06)), var(--surface)`, `padding: 24px`.
- Two buttons:
  - Left: `<button class="btn ghost">Previous step</button>` — ghost variant (transparent bg, ink-dim text, `--rule` border).
  - Right: `<button class="btn solid">Next step</button>` — solid variant (orange bg, dark text).
- Both `.btn`s share base styles: inline-flex, gap 10px, padding `12px 22px`, `border: 1px solid …`, Plex Mono **12px**, weight 500 (solid is 600), `letter-spacing: 0.1em`, uppercase, `min-height: 42px`.

### Checks
- [ ] Body starts with a 3-line shimmer stack (first line 18 px tall via `size="lg"`).
- [ ] Two code-block panels, one with caption `Program.cs` and one with `ValidationBehavior.cs`.
- [ ] Each code-block has a `Copy` chip absolute top-right (12 px / 12 px insets).
- [ ] Code-block background is `var(--surface-2)` (`#003E80AA` — translucent navy), distinct from the body background.
- [ ] Code-block caption is **periwinkle** (`var(--accent-2)` = `#8AA8FF`), NOT ink-dim — this is the only place periwinkle is used for body text.
- [ ] Each code-block has 3 shimmer "code rows" representing line content.
- [ ] Between code-blocks the body shows another 3-line shimmer paragraph stack.
- [ ] Last element in the body is `<ps-tutorial-nav>` — a bordered panel with the warm gradient overlay, containing a ghost `Previous step` button on the left and a solid orange `Next step` button on the right.
- [ ] The two nav buttons share the same height (42 px min) and padding; only background/border/text colors differ.
- [ ] **Live components:**
  - `frontend/projects/domain/src/lib/tutorial/tutorial-body` — the body container.
  - `frontend/projects/domain/src/lib/tutorial/tutorial-code-block` — must include the Copy chip and the periwinkle caption.
  - `frontend/projects/domain/src/lib/tutorial/tutorial-step-nav` — wires the ghost+solid button pair with prev/next links.

---

## 7. `<ps-related>` — Related tutorials section

Source: `tutorial-detail.html:378-447`

### Section header (`.sect-head`)
- Grid `auto 1fr auto`, gap 32px, padding `56px 0 28px`, `align-items: end`.
- `<h2>Related <em>tutorials</em></h2>`:
  - Base: Mona Sans `wdth 78 / wght 600`, `letter-spacing: -0.035em`, `line-height: 1`, size `clamp(34px, 4.4vw, 56px)`, margin 0.
  - `<em>`: italic, `wdth 88 / wght 500`, `color: var(--accent)`.
- `.lead-col`: `<div class="lead-col">Next builds that share this stack.</div>` — `max-width: 36ch`, `color: var(--ink-dim)`, **14px**.
- Third cell: empty `<span></span>` (placeholder for a `More →` link; verify whether the live app should render one).

### Card grid (`.card-grid`)
- `grid-template-columns: repeat(3, 1fr)`, gap 24px.

### Six cards (in DOM order)

| # | Badges (first is accent) | Title | Steps | Time | Diff |
|---|--------------------------|-------|-------|------|------|
| 1 | `DEEP DIVE` + `.NET 9` | `Wiring MediatR into a Clean Architecture API` | 22 | 58 MIN | INTERMEDIATE |
| 2 | `AZURE` + `RBAC` | `RBAC, properly - claims and policy design` | 14 | 36 MIN | ADVANCED |
| 3 | `BLAZOR` + `UI` | `Atomic design for Blazor components` | 9 | 24 MIN | BEGINNER |
| 4 | `EF CORE` + `SQL` | `EF Core 9 migrations under load` | 18 | 52 MIN | ADVANCED |
| 5 | `AUTH` + `OAUTH2` | `OAuth2 confidential clients, in one sitting` | 12 | 44 MIN | INTERMEDIATE |
| 6 | `ASPIRE` + `OPS` | `Aspire dashboards for local development` | 16 | 41 MIN | INTERMEDIATE |

### Card structure (identical to catalog `.tutorial-card`)
- See `catalog.md` § 5 for full spec.
- Each card: `<article class="tutorial-card">` with `.thumb-wrap` (16:10 sk-tile + chips top-left) + `.body` (h3 + skeleton-stack of 2 sk-lines + footer with steps/diff).
- Footer markup: `<span><b>N</b> steps · TIME</span><span>DIFFICULTY</span>` — note the **lowercase** `steps` here, vs. the uppercase `STEPS` in catalog. Flag if the live app diverges.

### Responsive
- **1100px:** `.card-grid` → `repeat(2, 1fr)`.
- **720px:** `.card-grid` → `1fr`.
- **720px:** `.sect-head` collapses to `grid-template-columns: 1fr`, gap 16 px (stacks heading + lead vertically).

### Checks
- [ ] Section heading reads `Related tutorials` with `tutorials` italic orange.
- [ ] Lead column reads exactly `Next builds that share this stack.`
- [ ] Six related cards rendered in the order above.
- [ ] Each card has 2 chips — the first chip is `.chip.accent` (orange border + orange text), the second is neutral.
- [ ] Card 2 title uses ASCII hyphen (`RBAC, properly - claims …`), not em-dash — same convention as `category.md` page.
- [ ] Footer reads `<N> steps · <TIME>` (lowercase `steps`) on the left and `<DIFFICULTY>` (uppercase) on the right.
- [ ] At 1100 px the grid collapses to 2 columns; at 720 px to 1.
- [ ] **Live component:** `frontend/projects/domain/src/lib/tutorial/related-tutorials`. The container should consume `<ps-tutorial-card>` rather than inline `<article>` markup (per `frontend-audit.md` #1). Inputs: `currentTutorialId` (to exclude self) and `tutorials: TutorialSummary[]`.

---

## 8. `<ps-footer>` — shared site footer

Verify against [`home.md` § 7. ps-footer](./home.md#7-ps-footer--site-footer). Identical markup.

### Checks
- [ ] Foot-mark at 64 px with italic-orange slash.
- [ ] Three link columns: Tutorials / Categories / Account.
- [ ] `© 2026 · Prompt/Sharp` left-aligned.
- [ ] Reflows correctly at 1100/720 px.

---

## 9. Page-level visual checks (global)

- [ ] **Background radial gradients:** orange (0.18) + periwinkle glows + horizontal scan lines.
- [ ] **Horizontal page padding** `clamp(20px, 4vw, 64px)`.
- [ ] **No `<ps-marquee>`** on this page.
- [ ] **Custom-element registration** for `ps-crumbs`, `ps-tutorial-hero`, `ps-tutorial-toc`, `ps-tutorial-body`, `ps-tutorial-nav`, `ps-related` resolves without console warnings.
- [ ] **Skeleton primitives** — code-blocks should still show shimmer once real syntax-highlighted code is wired (use loading state vs. rendered Prism/Shiki output).
- [ ] **Reading width:** the body column reaches `1fr` (no max-width on content); verify long-form text doesn't get uncomfortably wide on a 1440 px display. If a `max-width: 70ch` should be enforced on `<p>` elements in the body, flag as missing-spec.
- [ ] **Copy chip behavior:** in the live app the chip should be clickable, copy the code block contents to clipboard, and flash a "Copied" state (not in skeleton — verify implementation matches the chip atom).

---

## 10. Bug logging procedure

For every failed check above:

1. Open [`bugs/tutorial-detail.md`](../../bugs/tutorial-detail.md).
2. Append a new entry using the `TUTORIAL-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 11. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Breadcrumb slashes rendered as orange / link blue | `tutorial/tutorial-breadcrumbs/tutorial-breadcrumbs.scss` |
| Hero eyebrow uses `No.` instead of `№` | `tutorial-hero.html` (use HTML entity `&numero;` or `№`) |
| Hero italic accent on wrong word | `tutorial-hero.ts` — split last word and wrap in `<em>` |
| Chip row order/colors wrong | `tutorial-hero.html` and chip atom |
| TOC not sticky | `tutorial-toc.scss` (`position: sticky; top: 104px`) |
| TOC step numbers not orange / not zero-padded | `tutorial-toc.html` + `.scss` |
| Code-block caption wrong color (ink-dim instead of periwinkle) | `tutorial-code-block.scss` (`.caption { color: var(--accent-2) }`) |
| Code-block background not translucent navy | `tutorial-code-block.scss` (`background: var(--surface-2)`) |
| Copy chip missing from code-block | `tutorial-code-block.html` |
| Step nav panel missing gradient overlay | `tutorial-step-nav.scss` |
| Step nav `Previous step` not ghost / `Next step` not solid | `tutorial-step-nav.html` — bind correct variant inputs |
| Related cards using `<article>` instead of `ps-tutorial-card` | `related-tutorials.html` — see `docs/frontend-audit.md` #1 |
| Related section heading missing italic-orange accent | `related-tutorials.html` |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
