# Home — UI Audit

- **Route:** `/`
- **Skeleton:** [`docs/skeletons/home.html`](../../skeletons/home.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono)
- **Bug log:** [`bugs/home.md`](../../bugs/home.md)
- **Live component:** `frontend/projects/domain/src/lib/public/home-page`

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
2. Open `http://localhost:4200/` in one tab.
3. Open `docs/skeletons/home.html` directly in a second tab (file:// is fine — the skeleton has no external deps beyond Google Fonts).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar).
5. Walk the checks below in DOM order. Log every gap in [`bugs/home.md`](../../bugs/home.md) using ID prefix `HOME-`.

---

## Composition (DOM order, from `home.html:557-558` + `PsShell.render()` at line 658-668)

```
<ps-nav>              ← sticky, full-viewport, lives outside ps-shell
<ps-shell>
  ├─ <ps-hero>
  ├─ <ps-marquee>
  ├─ <ps-featured>
  ├─ <ps-tracks>
  ├─ <ps-latest>
  └─ <ps-footer>
</ps-shell>
```

Live counterpart should be `frontend/projects/domain/src/lib/public/home-page/home-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-nav>` — Sticky navigation bar

Source: `home.html:131-176, 671-687`

### Layout
- **Position:** sticky to `top: 0`, full viewport width (lives outside `<ps-shell>` so the bottom rule bleeds edge-to-edge).
- **Z-index:** 50 (nav must sit above all content but below dialogs).
- **Background:** `rgba(0, 0, 15, 0.82)` with `backdrop-filter: blur(14px) saturate(160%)`.
- **Border-bottom:** `1px solid var(--rule)` (`#003E80`).
- **Inner container:** `max-width: 1440px`, centered, padding `24px calc(gutter + 12px) 22px calc(gutter + 12px)`. Gutter is `clamp(20px, 4vw, 64px)`.
- **Grid columns:** `auto 1fr auto` — brand / links / actions. Column gap `32px`, align-items `center`.

### `.brand` ("Prompt/Sharp" wordmark)
- Text: literal `Prompt/Sharp` with the `/` wrapped in `<span class="slash">`.
- Font: `Mona Sans`, `font-variation-settings: "wdth" 82, "wght" 700`, **24px**, `letter-spacing: -0.035em`, `line-height: 1`.
- Slash glyph: `color: var(--accent)` (`#FF9800`), `font-style: italic`, `"wdth" 92, "wght" 500`. Inline-flex with `gap: 0`.

### `.links` (Tutorials / Categories / About)
- Three `<span>` items: `Tutorials` (active), `Categories`, `About`.
- Flex row, `gap: 32px`, `justify-content: center`.
- Inactive: `color: var(--ink-dim)` (`#C5CDE4`), size 13px.
- Active: `color: var(--ink)` (`#FBFFFF`) + a `::after` pseudo-element bar — `2px` tall, `background: var(--accent)`, positioned `bottom: -22px` (lands exactly on the nav's bottom rule), insets `left: -4px right: -4px`.
- Cursor pointer on all.

### `.actions` (right side)
- One `Sign in` button using `.btn.ghost`.
- `.btn` base: `inline-flex`, `gap: 10px`, `padding: 12px 22px`, `border: 1px solid var(--rule)`, `font-family: IBM Plex Mono`, size **12px**, weight 500, `letter-spacing: 0.1em`, `text-transform: uppercase`, `line-height: 1`, `cursor: pointer`.
- `.ghost`: `color: var(--ink-dim)`. Hover → `color: var(--ink)`, `border-color: var(--ink-dim)`.

### Responsive
- **720px:** `.links` is hidden (`display: none`). Inner grid collapses to `1fr auto` (brand + actions). Padding reduces to `20px calc(gutter + 8px) 18px calc(gutter + 8px)`.

### Checks
- [ ] Sticky-positioned; remains visible on scroll.
- [ ] Wordmark uses exact `wdth 82 / wght 700` and the slash is italic orange `wdth 92 / wght 500`. (Memory: foot-mark wordmark style is the canonical brand mark — see `MEMORY.md` → "Foot-mark wordmark".)
- [ ] Backdrop-filter blur visible when content scrolls under the bar.
- [ ] Active link `Tutorials` has the 2px orange underline overlapping the bottom rule.
- [ ] Three nav items present in this order: Tutorials, Categories, About.
- [ ] Sign-in button is ghost variant (transparent bg, ink-dim text, ink-dim border on hover).
- [ ] At 720 px: links hidden, brand + Sign-in only, padding shrinks.
- [ ] **Live component:** `frontend/projects/domain/src/lib/layout/public-nav` — composes the brand + links + Sign-in button. If the brand is rendered with default Mona Sans (not wdth 82 / wght 700), fix in `public-nav.html` and ensure the `components` lib has a brand atom or the styles applied via local SCSS.

---

## 2. `<ps-hero>` — Landing hero

Source: `home.html:197-265, 689-729`

### Layout
- **Grid:** `1.35fr 1fr` two-column, `gap: 48px`, `align-items: end`.
- **Padding:** `80px 0 64px`.
- **Border-bottom:** `1px solid var(--rule)`.

### Left column (`.hero-left`)
1. **Display headline `<h1 class="display">`** — two lines:
   - Line 1: `Build apps with Microsoft.`
   - Line 2: `<em>Step</em> by <em>step.</em>` (italic accent-orange on both "Step" and "step.")
   - Font: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`.
   - Size: `clamp(56px, 9vw, 132px)`. At 1440 px this evaluates to roughly **130 px**.
   - `em` styling: italic, `wdth 85 / wght 500`, `color: var(--accent)`.
   - Margin: `0 0 28px`.

2. **`.lede` paragraph:**
   - Exact text: `End-to-end tutorials that walk you through building production apps on **.NET**, **Azure**, **Blazor** and the rest of the Microsoft stack — like a senior architect paired with a coding agent.`
   - `.NET`, `Azure`, `Blazor` are wrapped in `<strong>` with `color: var(--ink)` and `font-weight: 500`.
   - `max-width: 38ch`, `color: var(--ink-dim)`, `font-size: 17px`, `line-height: 1.55`, `margin-bottom: 32px`.

3. **`.ctas` (two buttons, flex row, gap 14px, wrap, margin-bottom 24px):**
   - **`Browse tutorials →`** — `.btn.solid`: `background: var(--accent)`, `color: var(--bg)`, `border-color: var(--accent)`, `font-weight: 600`. Trailing arrow `→` inside `<span class="arr">` with `transform: translateY(-1px)`.
   - **`Editor's pick`** — base `.btn` (no `.solid`): transparent background, `var(--ink)` text, `var(--rule)` border. **Note:** distinctly *different* from the Browse button — outlined / ghost, not solid.

4. **`.hero-stats`:**
   - 3-column grid (`repeat(3, 1fr)`) — but only **two** stat cells are rendered in the skeleton: `412 Tutorials`, `18 Categories`. The third column is empty space. Verify whether the live app should render a third or keep the grid at 3-col with the slot empty.
   - `border-top: 1px solid var(--rule)`, `padding-top: 18px`, `max-width: 520px`.
   - `.stat .n`: Mona Sans, `wdth 80 / wght 600`, **28px**, `letter-spacing: -0.02em`.
   - `.stat .l`: IBM Plex Mono, **10px**, `letter-spacing: 0.16em`, uppercase, `color: var(--muted)`.

### Right column (`<aside class="hero-card">`)
- Border `1px solid var(--rule)`, background `linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.08)), var(--surface)`. Padding 24px. Flex column, gap 16px.
- **Pseudo-element badge `::before`** at `top: -1px; left: -1px`: literal text `FEATURED`, background `var(--accent)`, color `var(--bg)`, Plex Mono **10px**, `letter-spacing: 0.2em`, `padding: 4px 10px`, weight 600.
- **`.thumb`** — `aspect-ratio: 16/10`, contains `<sk-tile>` (shimmer placeholder) and a `.thumb-overlay` with two chips:
  - `<span class="chip accent">EDITOR'S PICK</span>` — Plex Mono 10px, `letter-spacing: 0.12em`, padding `4px 8px`, color/border `var(--accent)`, background `var(--bg)`.
  - `<span class="chip">14 STEPS</span>` — same but `color: var(--ink)`, `border-color: var(--rule)`.
  - Overlay is positioned via flex `align-items: flex-end; justify-content: space-between`, padding 12px.
- **`<div class="mono">/tutorial</div>`** — IBM Plex Mono, 12px, `letter-spacing: 0.04em`, `color: var(--ink-dim)`.
- **`<h3>`** — exact text: `From zero to a production Blazor app with EF Core & OAuth2`. Mona Sans, `wdth 85 / wght 550`, **26px**, `letter-spacing: -0.02em`, `line-height: 1.1`.
- **`.meta-row`** — flex space-between, `border-top: 1px solid var(--rule)`, `padding-top: 14px`, Plex Mono 11px, `color: var(--ink-dim)`. Left span: `Clean Architecture · MediatR`; right span: `· 42 min`.

### Responsive
- **1100px:** grid collapses to `1fr` (stacked). Hero card moves below left column.
- **720px:** same — single column.

### Checks
- [ ] Headline reads **`Build apps with Microsoft.`** (period, not "Microsoft step"), then **line break**, then `Step by step.` with both `Step` and `step.` italic and orange.
- [ ] Headline font size scales fluidly between 56 px (small screens) and 132 px (≥1440 px).
- [ ] Lede paragraph contains `.NET`, `Azure`, `Blazor` in bolder ink, not orange.
- [ ] Browse tutorials button: solid orange background, dark text, **trailing arrow `→` glyph present**, uppercase Plex Mono, `letter-spacing: 0.1em`. Text is centered (line-height 1, padding `12px 22px`).
- [ ] Editor's pick button: transparent / outlined variant. Border is `1px solid #003E80` (the `--rule` color), not orange. Border thickness **1 px**, no shadow. Text centered.
- [ ] Both CTAs have identical font, size, padding, only background/border differ.
- [ ] Hero card has the FEATURED badge at top-left (no rounded corners, flush with the card border).
- [ ] Hero card thumb shows a shimmer placeholder (until a real image is wired) with two chips in the bottom corners.
- [ ] Hero card title is `From zero to a production Blazor app with EF Core & OAuth2`.
- [ ] Hero stats: `412 Tutorials` and `18 Categories`, top-bordered.
- [ ] At 1100 px and below the layout stacks; verify spacing remains 80 px top / 64 px bottom.
- [ ] **Live component:** `frontend/projects/domain/src/lib/public/home-hero`. Verify it uses the `solid` and outlined button variants from `components/src/lib/button`. If the arrow glyph is missing, the button atom needs a `trailingIcon` slot (or accept content via `<ng-content>`).

---

## 3. `<ps-marquee>` — Tech stack ticker

Source: `home.html:270-289, 731-742`

### Content
12 stack items, each followed by an orange `✦` separator, repeated **twice** to allow seamless `translateX(-50%)` scroll:
```
.NET 9 ✦ Blazor ✦ EF Core ✦ MediatR ✦ SQL Server ✦ Azure Functions ✦
Clean Architecture ✦ RBAC ✦ OAuth 2.0 ✦ Aspire ✦ MAUI ✦ Service Bus ✦
```
(then the same block again — the duplication is intentional)

### Style
- Block element, `border-bottom: 1px solid var(--rule)`, `padding: 20px 0`, `overflow: hidden`.
- `.strip`: flex row, `gap: 56px`, `white-space: nowrap`.
- Animation: `scroll 40s linear infinite` translating from 0 to `-50%`.
- Items: Plex Mono **12px**, `letter-spacing: 0.18em`, uppercase, `color: var(--ink-dim)`.
- `.dot` (the `✦`): `color: var(--accent)`.

### Checks
- [ ] Marquee scrolls left to right at a steady ~40 s cycle. No jitter at the wraparound — verify the doubled-content trick is in place.
- [ ] Gap between items is 56 px.
- [ ] All 12 listed stack items are present in the correct spelling: `.NET 9`, `Blazor`, `EF Core`, `MediatR`, `SQL Server`, `Azure Functions`, `Clean Architecture`, `RBAC`, `OAuth 2.0`, `Aspire`, `MAUI`, `Service Bus`.
- [ ] `✦` separators between every pair, all orange.
- [ ] Items are uppercase via CSS (not in markup).
- [ ] **Live component:** `frontend/projects/domain/src/lib/public/marquee-strip`. If it currently only renders an empty container, fix the template to project the array and the ✦ separators. Animation may need `@keyframes scroll` in component SCSS.

---

## 4. `<ps-featured>` — Featured tutorials section

Source: `home.html:324-373, 744-817`

### Section header (`.sect-head`)
- Grid `auto 1fr auto`, `gap: 32px`, `padding: 64px 0 32px`, `align-items: end`.
- **`<h2>`:** `<em>Featured</em> tutorials` — `em` italic orange (`wdth 88 / wght 500`), rest of `h2` is `wdth 78 / wght 600`. Size `clamp(34px, 4.4vw, 56px)`, `letter-spacing: -0.035em`, `line-height: 1`.
- **`.lead-col`:** `Curated, end-to-end builds. Each rebuilds something real from scratch — no toy demos, no glue-code essays.` `max-width: 36ch`, ink-dim, 14px.
- **`.more` link:** `All featured →` — inline-flex, gap 8px, Plex Mono 11px, `letter-spacing: 0.16em`, uppercase, ink, `padding-bottom: 4px`, `border-bottom: 1px solid var(--accent)`.

### Cards grid (`.feat-grid`)
- 12-column grid, `gap: 24px`, `padding-bottom: 64px`, `border-bottom: 1px solid var(--rule)`.
- Three cards in this order:
  - **Card 1 (`span-5`):** Numbered `001 / 003`. Chips: `DEEP DIVE` (accent), `.NET 9`. Title: `Wiring MediatR into a Clean Architecture API that actually compiles on Monday morning`. Three `sk-line` (widths 100, 90, 60). Footer: `22 STEPS · 58 MIN` + `★ INTERMEDIATE`.
  - **Card 2 (`span-4`):** `002 / 003`. Chip: `AZURE`. Title: `RBAC, properly — claims, policies and the lies tutorials tell`. Two `sk-line` (100, 80). Footer: `14 STEPS · 36 MIN` + `★★ ADVANCED`.
  - **Card 3 (`span-3`):** `003 / 003`. Chip: `BLAZOR`. Title: `Atomic design for Blazor components`. Two `sk-line` (100, 70). Footer: `9 STEPS · 24 MIN` + `★ BEGINNER`.

### Card structure (`.feat-card`)
- `border: 1px solid var(--rule)`, background `var(--surface)`, flex column.
- `.num` absolute `top: 12px right: 12px`, Plex Mono 11px, muted color, `letter-spacing: 0.12em`.
- `.thumb-wrap` aspect ratio 16/10; contains `<sk-tile>` + `.badges` (absolute `top: 12px left: 12px`, flex gap 6px).
- `.body` padding `18px 20px 22px`, flex column gap 12px, `flex: 1`.
- `h3` Mona Sans `wdth 88 / wght 550`, **22px**, `letter-spacing: -0.025em`, `line-height: 1.15`, `min-height: 56px` (keeps card heights aligned).
- `.lines` flex column, gap 6px — vertical stack of `<sk-line w="...">`.
- `footer` margin-top auto, `padding-top: 14px`, top border, flex space-between, Plex Mono 11px, `letter-spacing: 0.06em`. Step count `<b>22</b>` is `var(--accent)` weight 600.

### Responsive
- **1100px:** every card becomes `span 6` (2-col).
- **720px:** every card becomes `span 1` (single column).

### Checks
- [ ] Section heading reads `Featured tutorials` with `Featured` italic orange.
- [ ] Three cards in order with the correct span ratios at desktop (5-4-3 of 12).
- [ ] Each card has a numbered `NNN / 003` in top-right, Plex Mono, muted color.
- [ ] Each card has chips top-left over the thumb.
- [ ] Card 1 chip set: orange `DEEP DIVE` + neutral `.NET 9`. Card 2: `AZURE`. Card 3: `BLAZOR`.
- [ ] Each card footer's step count has the digits in orange and bold.
- [ ] Cards have a top-border-less, bottom-bordered footer separator (the `padding-top: 14px` after `border-top`).
- [ ] All three card titles match exactly (see source above).
- [ ] At 1100 px, cards reflow to 2-col; at 720 px to 1-col.
- [ ] **Live components:** `featured-tutorials`, `tutorial-card` (currently `tutorial-card` is unused — see audit/`docs/frontend-audit.md` #1). The featured grid must consume `ps-tutorial-card` rather than inline `<article>` markup. If the chip atom is missing the `accent` variant, fix `components/src/lib/chip`.

---

## 5. `<ps-tracks>` — Browse-by-category grid

Source: `home.html:378-418, 819-848`

### Header
- Same `.sect-head` layout.
- `<h2>Browse by <em>category</em></h2>` (italic orange `category`).
- Lead: `Tutorials grouped by the Microsoft technology they teach. Pick one and dig in.`
- More: `All 18 categories →`.

### Grid (`.tracks-grid`)
- 4 columns × 2 rows, but rendered as `grid-template-columns: repeat(4, 1fr)` with 8 cells in DOM order.
- `border-top: 1px solid var(--rule)`, `border-left: 1px solid var(--rule)`. Each cell has `border-right` and `border-bottom` — so the grid renders as a hairline matrix.

### Eight cells (in order):
| Index | Glyph | Title (line-broken) | Count |
|-------|-------|---------------------|-------|
| `T—01` | `{ }` | `.NET API` / `Foundations` | `34 TUTORIALS` |
| `T—02` | `◐`  | `Blazor &` / `Atomic UI` | `22 TUTORIALS` |
| `T—03` | `▲`  | `Azure for` / `Builders` | `41 TUTORIALS` |
| `T—04` | `⌘`  | `EF Core,` / `Properly` | `18 TUTORIALS` |
| `T—05` | `◇`  | `Auth, OAuth2` / `& RBAC` | `16 TUTORIALS` |
| `T—06` | `⧖`  | `MediatR &` / `CQRS` | `12 TUTORIALS` |
| `T—07` | `▣`  | `Clean` / `Architecture` | `27 TUTORIALS` |
| `T—08` | `∞`  | `Production` / `& Ops` | `19 TUTORIALS` |

### Cell style (`.track-cell`)
- Padding `28px 24px 24px`, flex column gap 14px, `min-height: 220px`, background `var(--bg)`, `transition: background .3s`, cursor pointer.
- Hover: background `var(--surface)`.
- `.index`: Plex Mono 10px, accent color, `letter-spacing: 0.2em`.
- `.glyph`: 44×44 square, `border: 1px solid var(--rule)`, centered, Plex Mono, ink-dim, 18px.
- `h3`: Mona Sans `wdth 80 / wght 600`, **28px**, `letter-spacing: -0.03em`, `line-height: 1`. Contains an explicit `<br/>` mid-title.
- `.count`: flex space-between, margin-top auto, Plex Mono 11px, `letter-spacing: 0.08em`, ink-dim. `.arr` is orange.

### Responsive
- **1100px:** 2 columns. **720px:** still 2 columns (no further breakpoint).

### Checks
- [ ] 8 cells in the exact order and glyphs above.
- [ ] Each cell title is line-broken at the marked position (`<br/>` after `&`, `for`, `Core,`, `OAuth2`, etc.).
- [ ] Hairline border matrix: outer top + left from the grid, plus per-cell right + bottom borders. No double borders.
- [ ] Glyph box is `44×44` with the symbol centered.
- [ ] Hover changes cell background to `--surface`.
- [ ] **Live component:** `frontend/projects/domain/src/lib/public/category-grid` (or similar). The 8 entries should come from API data in production; in skeleton/empty state, render the placeholders. Confirm tracks SCSS uses the border-matrix technique, not box-shadow.

---

## 6. `<ps-latest>` — Latest tutorials list with filter sidebar

Source: `home.html:423-477, 850-905`

### Header
- `<h2><em>Latest</em> tutorials</h2>` (italic orange `Latest`).
- Lead: `The most recent step-by-step builds across the Microsoft stack.`
- More: `View all →`.

### Layout
- `.latest-grid`: two columns `220px 1fr`, gap 32px, `padding-bottom: 72px`, `border-bottom: 1px solid var(--rule)`.

### Left sidebar (`.latest-side`)
- Flex column, gap 16px, `padding-top: 4px`.
- Eyebrow `Filter by` at the top.
- 8 filter chips (`.filter-chip`):
  ```
  All           412   ← .on (active)
  .NET          142
  Blazor         68
  Azure          94
  EF Core        41
  Auth / RBAC    23
  DevOps         31
  Architecture   52
  ```
- Chip style: flex justify-between, Plex Mono 11px, `padding: 8px 0`, `border-bottom: 1px solid var(--rule-soft)`, ink-dim, `letter-spacing: 0.06em`.
- `.on` variant: `color: var(--ink)`, prefixed with an orange `■` square (`::before` content). `.n` count text is `var(--muted)`.

### Right list (`.latest-list`)
- Six `.row` items (grid `50px 1fr auto auto auto`, gap 24px, padding `22px 0`, top border per row).
- Each row contains:
  - `.ix` — Plex Mono 11px, muted, `letter-spacing: 0.1em`, e.g. `№ 412`
  - `.title` — Mona Sans `wdth 90 / wght 550` **22px**, `letter-spacing: -0.02em`, with a `<small>` subtitle line `wdth 100 / wght 400` **12px**, `var(--ink-dim)`, `margin-top: 4px`.
  - `.stack` — Plex Mono 11px, ink-dim, `letter-spacing: 0.06em` (e.g., `.NET · AZURE`).
  - `.diff` — Plex Mono 10px, `letter-spacing: 0.16em`, uppercase, `padding: 4px 8px`, with a colored border:
    - `.diff.b` (BEGINNER) → `color/border: var(--moss)` (`#8AA8FF`)
    - `.diff.i` (INTERMEDIATE) → `color/border: var(--gold)` (`#FFC85C`)
    - `.diff.a` (ADVANCED) → `color/border: var(--accent)` (`#FF9800`)
  - `.time` — Plex Mono 11px ink-dim (e.g., `38 MIN`, `1H 04M`).
- Row hover: linear gradient overlay `transparent → rgba(255,152,0,0.08) → transparent`.

### Six rows (exact content):
1. `№ 412` · `Hosting a vertical-slice .NET API behind an Application Gateway` / `A pragmatic guide to TLS, routing rules and the WAF policy you actually want.` · `.NET · AZURE` · `INTERMEDIATE` (i, gold) · `38 MIN`
2. `№ 411` · `EF Core 9 migrations under load — what breaks first` / `Real-world failure modes, with a SQL Server reproduction repo.` · `EF CORE · SQL` · `ADVANCED` (a, accent) · `52 MIN`
3. `№ 410` · `Atomic responsive design for admin screens` / `From xs to xl without giving up dense data tables.` · `BLAZOR · CSS` · `BEGINNER` (b, moss) · `21 MIN`
4. `№ 409` · `OAuth2 confidential clients, in one sitting` / `PKCE, refresh tokens, and exactly which lib to reach for.` · `AUTH · IDENTITY` · `INTERMEDIATE` (i) · `44 MIN`
5. `№ 408` · `A MediatR pipeline I'd ship to production` / `Validation, logging, transactions — without the ceremony.` · `.NET · MEDIATR` · `INTERMEDIATE` (i) · `33 MIN`
6. `№ 407` · `Building the admin shell — content management without the CMS` / `Roles, audit trails, and the editor your sysadmin will actually use.` · `BLAZOR · RBAC` · `ADVANCED` (a) · `1H 04M`

### Responsive
- **1100px:** still 2-col `220px 1fr`.
- **720px:** single column. Row grid collapses to `36px 1fr` with `.stack`, `.diff`, `.time` reflowing to column 2 on extra rows (`grid-column: 2; row-gap: 8px`).

### Checks
- [ ] Sidebar shows 8 filters with `All` active (orange `■` prefix) and counts on the right.
- [ ] Six list rows in the exact `№ NNN` numbering, descending from 412.
- [ ] Each row has 5 grid cells: number / title-with-subtitle / stack / difficulty pill / time.
- [ ] Difficulty pills use the three correct accent colors (moss / gold / accent).
- [ ] Hover gradient is subtle and centered.
- [ ] Subtitle is 12px and properly wraps under the title.
- [ ] At 720 px the stack/diff/time stack vertically under the title.
- [ ] **Live components:** `latest-tutorials` (list) + the `tutorial-row` atom (currently the audit doc `docs/frontend-audit.md` notes inline `<article>` markup is used instead). Refactor to consume a real row component; the difficulty pill should be the `difficulty-badge` atom in `components` (already exists at `components/src/lib/difficulty-badge`).

---

## 7. `<ps-footer>` — Site footer

Source: `home.html:482-519, 907-935`

### Layout
- Block element, `padding: 64px 0 28px`.
- `.foot-grid`: 4 columns `1.6fr 1fr 1fr 1fr`, gap 32px, `padding-bottom: 48px`.

### Column 1 (Brand block)
- **`.foot-mark`** — Mona Sans `wdth 80 / wght 700`, **64px**, `line-height: 1`, `letter-spacing: -0.05em`, `margin-bottom: 18px`. Renders `Prompt<em>/</em>Sharp` with `em` styled `color: var(--accent)`, italic, `wdth 90 / wght 500`.
- Mono tagline below: `Step-by-step tutorials for building apps with Microsoft technologies.` `max-width: 36ch`.

### Columns 2-4 (Link lists)
- Each has an `<h4>` (Plex Mono 11px, `letter-spacing: 0.18em`, uppercase, muted) and a `<ul>` (no bullets, padding 0, flex column gap 10px, 13px ink-dim).
- **Tutorials:** All tutorials · Featured · Editor's picks · Latest
- **Categories:** .NET · Blazor · Azure · EF Core
- **Account:** Sign in · About · Contact

### `.foot-bottom`
- Padding-top 22px, top border, flex space-between, Plex Mono 10px, `letter-spacing: 0.14em`, uppercase, muted.
- Left content: `© 2026 · Prompt/Sharp`.
- Right content: (none in skeleton — would be a colophon `.colophon`. Verify whether the live app should render the colophon or leave it empty.)

### Responsive
- **1100px:** grid becomes `1fr 1fr` (2-col).
- **720px:** single column. `.foot-bottom` becomes column flex, gap 12px, left-aligned.

### Checks
- [ ] Foot-mark renders at 64 px on desktop with the slash italic orange. (Memory: this is the canonical brand mark — see `MEMORY.md` → "Foot-mark wordmark".)
- [ ] Foot-mark margin-bottom is 18 px before the tagline.
- [ ] Three link columns appear in this order with these exact items.
- [ ] Footer-bottom row has `© 2026 · Prompt/Sharp` at the left in muted Plex Mono.
- [ ] At 1100 px and below the columns reflow correctly.
- [ ] **Live component:** `frontend/projects/domain/src/lib/layout/public-footer`. If the foot-mark renders with regular Mona Sans (not condensed/heavy), fix the SCSS to apply the `wdth 80 / wght 700` variation settings.

---

## 8. Page-level visual checks (global)

- [ ] **Background radial gradients:** the body `::before` overlay produces a soft orange glow at top-right and a periwinkle glow at top-left, plus 1px horizontal scan lines (`repeating-linear-gradient` at 3-4px). Verify these are present and not occluded.
- [ ] **Page horizontal padding** is `clamp(20px, 4vw, 64px)` — at 1440 px this is 57.6 px, at 720 px ~28.8 px.
- [ ] **No `font-family: serif`** anywhere — both fonts are sans-serif (Mona Sans + IBM Plex Mono).
- [ ] **All custom-element registrations resolve** — open DevTools console and ensure no warnings about unknown elements like `<ps-hero>` (would indicate the Angular app has not adapted these to its own components).
- [ ] **Skeleton primitives** — until real data is wired, sections should show shimmer (`sk-tile`, `sk-line`) gracefully, not blank blocks.

---

## 9. Bug logging procedure

For every failed check above:

1. Open [`bugs/home.md`](../../bugs/home.md).
2. Append a new entry using the `HOME-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 10. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Wordmark wrong weight/width | `domain/src/lib/layout/public-nav/public-nav.html` + SCSS |
| Button arrow missing on solid | `components/src/lib/button/button.html` (add slot for trailing icon) |
| Solid button wrong color | `components/src/lib/button/button.scss` (`.btn--solid`) |
| Editor's pick button looks identical to Browse | bind correct `variant` input from `home-hero` to the Button atom |
| Marquee not scrolling | `domain/src/lib/public/marquee-strip` SCSS (`@keyframes scroll`) |
| Tutorial cards inline (not using `ps-tutorial-card`) | Replace `<article data-testid="tutorial-card">` in `home-page.html:18, 46` with `<ps-tutorial-card>`. See `docs/frontend-audit.md` #1. |
| Difficulty pill colors wrong | `components/src/lib/difficulty-badge/difficulty-badge.scss` |
| Foot-mark not condensed/heavy | `domain/src/lib/layout/public-footer/public-footer.scss` |
| Hairline border matrix on tracks broken | `domain/src/lib/public/category-grid` SCSS — verify `border-top + border-left` on grid, `border-right + border-bottom` on cells |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before block |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/HOME-001-home-page-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/home/home-desktop.png`; `docs/ui-audit/screenshots/home/home-tablet.png`; `docs/ui-audit/screenshots/home/home-mobile.png`
