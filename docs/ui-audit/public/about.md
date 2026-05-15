# About — UI Audit

- **Route:** `/about`
- **Skeleton:** [`docs/skeletons/about.html`](../../skeletons/about.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono)
- **Bug log:** [`bugs/about.md`](../../bugs/about.md)
- **Live component:** `frontend/projects/domain/src/lib/public/about-page`

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
2. Open `http://localhost:4200/about` in one tab.
3. Open `docs/skeletons/about.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/about.md`](../../bugs/about.md) using ID prefix `ABOUT-`.

---

## Composition (DOM order, from `about.html:336-395`)

```
<ps-nav>                ← shared sticky bar; active link = "About"
<ps-shell>
  ├─ <ps-about-hero>          ← display headline + lede
  ├─ <ps-about-body>          ← two-column prose / editorial panel
  ├─ <ps-contact-card>        ← contact address + form
  └─ <ps-footer>              ← shared
</ps-shell>
```

Live counterpart: `frontend/projects/domain/src/lib/public/about-page/about-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-nav>` — shared sticky navigation bar

Verify against [`home.md` § 1. ps-nav](./home.md#1-ps-nav--sticky-navigation-bar). The active link on this route is **`About`** (orange underline overlapping the bottom rule).

### Checks
- [ ] Active link is `About` (NOT `Tutorials` / `Categories`).
- [ ] Wordmark, links, Sign-in button match home.md spec.

---

## 2. `<ps-about-hero>` — Display headline + lede

Source: `about.html:351-357`

### Layout
- Class `page-hero hero-grid`.
- `.page-hero` base: `padding: 72px 0 48px`, `border-bottom: 1px solid var(--rule)` (`#003E80`).
- `.hero-grid`: `display: grid; grid-template-columns: 1.25fr 1fr; gap: 48px; align-items: start;`.

### Left column

#### Eyebrow
- `<div class="eyebrow"><span class="dot"></span>About / Contact</div>`
- IBM Plex Mono **11px**, weight 500, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)` (`#6B7AAF`).
- `.dot`: 6×6 orange square (`#FF9800`), `margin-right: 10px`, `vertical-align: middle`.
- Literal text: `About / Contact` (uppercased via CSS).

#### Display headline
- Exact markup: `<h1 class="display">Tutorials for builders who ship on <em>Microsoft</em>.</h1>`
- Base: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`, `color: var(--ink)` (`#FBFFFF`).
- `<em>` ("Microsoft"): italic, `wdth 85 / wght 500`, `color: var(--accent)` (`#FF9800`).
- Size: `clamp(48px, 8vw, 112px)`, `margin: 0 0 24px`.
- Note the trailing period (`.`) AFTER the closing `</em>` — it's part of the sentence, NOT inside the em.

### Right column — `.lede` paragraph
- `<p class="lede">Prompt/Sharp is a curated library of production-minded tutorials, written as loading skeletons here so the product shape can be reviewed before Angular implementation.</p>`
- `max-width: 48ch`, `color: var(--ink-dim)` (`#C5CDE4`), `font-size: 17px`, `line-height: 1.55`, `margin: 0`.
- Note: this lede is NOT inside the left column — it occupies the right grid cell. (Compare to home where the lede sits inside the left column.)

### Responsive
- **1100px:** `.hero-grid` collapses to `grid-template-columns: 1fr`; the lede drops below the headline.
- **720px:** `.page-hero` padding reduces to `48px 0 28px`; headline scales to `clamp(42px, 12vw, 72px)`.

### Checks
- [ ] Eyebrow reads `About / Contact` (uppercase) with the 6×6 orange square dot.
- [ ] Display headline reads `Tutorials for builders who ship on Microsoft.` with **only** `Microsoft` italic orange, and the trailing period rendered in ink (outside the em).
- [ ] Headline scales fluidly between 48 px and 112 px.
- [ ] Lede paragraph sits in the **right column** (not below the headline at desktop).
- [ ] Lede color is ink-dim (`#C5CDE4`), 17 px, line-height 1.55, max-width 48ch.
- [ ] Hero has a bottom hairline rule.
- [ ] At 1100 px the columns stack; the lede drops below the headline.
- [ ] **Live component:** `frontend/projects/domain/src/lib/public/about-hero`. Inputs: `eyebrow`, `headlineBefore`, `accentWord`, `headlineAfter` (the trailing period), `lede`. Avoid rendering the lede in the wrong column at desktop.

---

## 3. `<ps-about-body>` — Two-column prose + editorial panel

Source: `about.html:358-370`

### Layout
- Classes `section-block two-col`.
- `.section-block` base: `padding: 72px 0 48px; border-bottom: 1px solid var(--rule);`.
- `.two-col`: `display: grid; grid-template-columns: 1.25fr 1fr; gap: 48px; align-items: start;`.

### Left column — `.skeleton-stack` (long-form prose placeholder)
- Flex column, gap **8px**.
- Six children in order:
  1. `<sk-line size="lg" w="88"></sk-line>` — 18 px tall, 88% width (heading-like first line).
  2. `<sk-line w="98"></sk-line>` — 12 px tall, 98% width.
  3. `<sk-line w="74" delay="1"></sk-line>` — 12 px tall, 74% width, offset shimmer.
  4. `<div class="rule" style="margin: 22px 0;"></div>` — A 1-px tall horizontal rule, full width, `background: var(--rule)` (`#003E80`), with 22 px vertical margin on both sides.
  5. `<sk-line size="lg" w="76"></sk-line>` — 18 px tall, 76% width (heading-like for second paragraph block).
  6. `<sk-line w="92"></sk-line>` — 12 px, 92% width.
  7. `<sk-line w="64" delay="2"></sk-line>` — 12 px, 64% width, second-offset shimmer.

So the column represents two prose blocks separated by a horizontal hairline rule.

### Right column — `.panel` (editorial principles)
- `<div class="panel">`
- `.panel`: `border: 1px solid var(--rule)`, `background: linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06)), var(--surface)` (warm-orange overlay over `#002A54`), `padding: 24px`.

#### Eyebrow
- `<div class="eyebrow">Editorial principles</div>`
- Plex Mono **11px**, `letter-spacing: 0.18em`, uppercase, muted color.
- NO `.dot` prefix here (unlike the hero eyebrow).

#### Three `.label-value` rows
Each row uses the `.label-value` definition: `display: grid; grid-template-columns: 160px 1fr; gap: 18px; padding: 14px 0; border-top: 1px solid var(--rule-soft)` (`#001A36`).

- The `.label` cell: `color: var(--muted)`, Plex Mono **11px**, `letter-spacing: 0.14em`, uppercase.
- The value cell: a shimmer `<sk-line>`.

Rows in order:
1. `.label`: `Depth` · value: `<sk-line w="72"></sk-line>`
2. `.label`: `Stack` · value: `<sk-line w="82" delay="1"></sk-line>`
3. `.label`: `Cadence` · value: `<sk-line w="58" delay="2"></sk-line>`

### Responsive
- **1100px:** `.two-col` → `grid-template-columns: 1fr` (stacked).
- **720px:** `.label-value` collapses to `grid-template-columns: 1fr`, gap 6 px (label sits above value).

### Checks
- [ ] `.two-col` grid is 1.25fr / 1fr with 48 px gap at desktop.
- [ ] Left column shows two paragraph-shaped shimmer blocks with a 1-px horizontal `var(--rule)` divider between them at 22 px vertical margin.
- [ ] Right column is a bordered panel with the warm-orange gradient overlay.
- [ ] Panel eyebrow text reads exactly `Editorial principles` (muted, uppercase, no dot prefix).
- [ ] Three label-value rows in order: `Depth` / `Stack` / `Cadence`.
- [ ] Each row has a 1-px top hairline (`var(--rule-soft)`), 14 px vertical padding, 160 px label column at desktop.
- [ ] Labels are Plex Mono 11 px muted, **letter-spacing 0.14em** uppercase.
- [ ] Each value cell shows a shimmer `sk-line` at the specified width.
- [ ] At 1100 px the panel drops below the prose column.
- [ ] At 720 px the label rows collapse to single-column (label above value, gap 6 px).
- [ ] **Live components:** `frontend/projects/domain/src/lib/public/about-body`. The component should expose the two prose paragraphs (or long-form Markdown content) and a configurable list of principle rows. Use shimmer placeholders only during the loading state.

---

## 4. `<ps-contact-card>` — Address block + form

Source: `about.html:371-382`

### Layout
- Classes `section-block two-col`.
- `.section-block`: `padding: 72px 0 48px; border-bottom: 1px solid var(--rule);`.
- `.two-col`: `grid-template-columns: 1.25fr 1fr; gap: 48px; align-items: start;`.

### Left column — Address block

#### Display headline (smaller than the hero)
- `<h2 class="display" style="font-size: clamp(38px, 5vw, 72px); margin: 0 0 16px;">Contact <em>the desk</em></h2>`
- Inline overrides bring the size down to `clamp(38px, 5vw, 72px)` and margin to `0 0 16px`.
- Base styling inherited from `.display`: Mona Sans `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`, ink color.
- `<em>` ("the desk"): italic, `wdth 85 / wght 500`, `color: var(--accent)`.

#### `.mono` address block
- `<div class="mono">Prompt/Sharp<br/>Toronto, ON<br/>hello@promptsharp.dev</div>`
- IBM Plex Mono **12px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)`.
- Three lines (explicit `<br/>` between):
  1. `Prompt/Sharp` (literal — note no italic slash treatment here, plain Plex Mono)
  2. `Toronto, ON`
  3. `hello@promptsharp.dev`

### Right column — `<form class="panel form-lines">`
- `.panel`: bordered, warm-overlay surface (same as above).
- `.form-lines`: `display: grid; gap: 14px;`.
- The panel hosts three input "lines" + a submit button.

#### Three `.field-line` divs
- Each: `border: 1px solid var(--rule)`, `background: var(--bg)` (`#00000F`), `padding: 15px 16px`.
- Each contains a shimmer `<sk-line>` placeholder (the live app should swap these for `<input>` / `<textarea>` elements).
- In order:
  1. `<div class="field-line"><sk-line w="40"></sk-line></div>` — name-sized line (40% width shimmer).
  2. `<div class="field-line"><sk-line w="62"></sk-line></div>` — email-sized line (62%).
  3. `<div class="field-line" style="min-height: 120px;"><sk-line w="86"></sk-line></div>` — message textarea (inline `min-height: 120px`, 86% width shimmer).

#### Submit button
- `<button type="button" class="btn solid">Send</button>`.
- Solid orange variant: orange background, dark text, Plex Mono **12px** weight 600, `letter-spacing: 0.1em`, uppercase, padding `12px 22px`, `border: 1px solid var(--accent)`, `min-height: 42px`.
- Button text: `Send` (rendered uppercase via CSS).

### Responsive
- **1100px:** `.two-col` → `1fr` (stacks address block above form).
- **720px:** Same single column. Other label-value rules apply if present (none in this card).

### Checks
- [ ] Address block heading reads `Contact the desk` with `the desk` italic orange. Size is in the 38–72 px range (smaller than the page hero).
- [ ] Mono address block has three lines in exact order: `Prompt/Sharp` / `Toronto, ON` / `hello@promptsharp.dev`.
- [ ] Mono lines are Plex Mono **12px** ink-dim — NOT styled like the brand wordmark (no italic slash on `Prompt/Sharp` here).
- [ ] Right-column form is a bordered warm-overlay panel.
- [ ] Three field-line inputs in order: name (40% shimmer), email (62%), message (120 px tall, 86% shimmer).
- [ ] Each field-line has `1px solid #003E80` border + `#00000F` background (darker than the panel — input wells should sink visually).
- [ ] Field-line padding is **15 px / 16 px** (vertical / horizontal).
- [ ] Submit button is a solid orange `Send` button at the bottom of the form.
- [ ] Button is full-width-feeling but not stretched — it follows the natural `.btn` width (inline-flex centered). Verify whether the live design wants it stretched to 100% — if so flag.
- [ ] Section has a bottom hairline rule below the form.
- [ ] At 1100 px the form drops below the address block.
- [ ] **Live component:** `frontend/projects/domain/src/lib/public/contact-card`. The form should be a real reactive form (`name`, `email`, `message`) with submit emitting an event for the page to handle. Replace the shimmer placeholders with proper text inputs / textarea once data is wired — the loading skeleton should only show on first paint or while submitting.

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

- [ ] **Background radial gradients:** orange (0.18) + periwinkle glows + horizontal scan lines.
- [ ] **Horizontal page padding** `clamp(20px, 4vw, 64px)`.
- [ ] **No `<ps-marquee>`** on this page.
- [ ] **No `<ps-pagination>`** — single-page content.
- [ ] **Custom-element registration** for `ps-about-hero`, `ps-about-body`, `ps-contact-card` resolves without console warnings.
- [ ] **Skeleton primitives** render shimmer for prose and form placeholders. Once content wires, the shimmer should disappear (verify no double-render of shimmer behind real content).
- [ ] **No `font-family: serif`** anywhere — both fonts are sans-serif.
- [ ] **Reading width:** verify the long-form prose column doesn't exceed a comfortable reading width on 1440 px+ displays. If a `max-width: ~70ch` cap is needed on body paragraphs, flag.
- [ ] **Form submit behavior:** in the live app the `Send` button should call a contact endpoint and surface success/error feedback. Skeleton has no such state — flag if missing.
- [ ] **Email address rendering:** `hello@promptsharp.dev` should be a `mailto:` link in the live app. Verify it's a real anchor with the same ink-dim color (and an accent hover state).

---

## 7. Bug logging procedure

For every failed check above:

1. Open [`bugs/about.md`](../../bugs/about.md).
2. Append a new entry using the `ABOUT-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Hero eyebrow text wrong (missing `/ Contact` half) | `domain/src/lib/public/about-hero/about-hero.html` |
| Hero accent word wrong (not `Microsoft`) | `about-hero.html` — wrap the right word in `<em>` |
| Hero trailing period inside the em (orange instead of ink) | `about-hero.html` — period must be sibling of `<em>`, not inside it |
| Lede paragraph in wrong column at desktop | `about-hero.html` — ensure lede is the second grid child |
| About body two-col grid wrong ratio | `about-body.scss` (`.two-col { grid-template-columns: 1.25fr 1fr }`) |
| Horizontal divider missing between prose blocks | `about-body.html` — `<div class="rule">` with 22 px vertical margin |
| Editorial panel missing warm gradient overlay | `about-body.scss` (`.panel { background: linear-gradient(...) , var(--surface) }`) |
| Label-value rows missing top hairline | `about-body.scss` (`.label-value { border-top: 1px solid var(--rule-soft) }`) |
| Label letter-spacing wrong (uses 0.18em instead of 0.14em) | `about-body.scss` (`.label-value .label`) |
| Contact heading too large (uses default 112 px ceiling) | `contact-card.html` or `.scss` — apply `font-size: clamp(38px, 5vw, 72px)` |
| Contact heading missing italic-orange accent on `the desk` | `contact-card.html` |
| Address block rendered with brand wordmark style instead of plain Plex Mono | `contact-card.scss` — use `.mono` styles, not `.foot-mark`/`.brand` |
| Form field background not darker than panel | `contact-card.scss` (`.field-line { background: var(--bg) }`) |
| Message textarea not 120 px tall | `contact-card.html` or `.scss` — apply `min-height: 120px` |
| Send button not solid orange | `components/src/lib/button/button.scss` (`.btn--solid`) or button variant binding |
| Email not a mailto link | `contact-card.html` |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before block |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
