# Sign-in — UI Audit

- **Route:** `/sign-in`
- **Skeleton:** [`docs/skeletons/signin.html`](../../skeletons/signin.html)
- **Pattern:** A (custom-element shell, Mona Sans + IBM Plex Mono, sharp-edged card on dark navy)
- **Bug log:** [`bugs/signin.md`](../../bugs/signin.md)
- **Live component:** `frontend/projects/domain/src/lib/auth/sign-in-page`

> Composes: `auth/sign-in-card`, `auth/sign-in-field-row`, `auth/sign-in-footer`.

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
2. Open `http://localhost:4200/sign-in` in one tab.
3. Open `docs/skeletons/signin.html` directly in a second tab (file:// is fine — Google Fonts is the only external dep).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar).
5. Walk the checks below in DOM order. Log every gap in [`bugs/signin.md`](../../bugs/signin.md) using ID prefix `SIGNIN-`.

---

## Composition (DOM order, from `signin.html:380-383`)

```
<ps-nav-min>          ← minimal nav (brand left, back link right)
<ps-signin-stage>     ← centered flex container (flex: 1)
  └─ <ps-signin-card>
       ├─ .card-head     (eyebrow + h2 + sub)
       ├─ <form.signin-form>
       │    ├─ <ps-field name="username" index="01">
       │    ├─ <ps-field name="password" index="02" with-eye>
       │    ├─ .options-row (.check "Remember me" + .forgot-link)
       │    └─ <button.submit-btn>
       └─ <p.legal>
<ps-signin-foot>      ← outside the stage; copyright + 3 links
```

Note: this is **NOT** the full home shell — the page intentionally uses a stripped `<ps-nav-min>` rather than `<ps-nav>` and a minimal `<ps-signin-foot>` rather than `<ps-footer>`. There is no marquee, no hero, no body-padding-driven `<ps-shell>` wrapper. The body itself is `flex-direction: column` with the stage taking `flex: 1` so the card vertically centers between nav and foot.

Live counterpart should be `frontend/projects/domain/src/lib/auth/sign-in-page/sign-in-page.html`. Verify the page renders the three pieces (minimal nav, stage with card, minimal foot) and that there is **no** full `<app-public-nav>` / `<app-public-footer>` mounted on this route.

---

## 1. `<ps-nav-min>` — Minimal sticky nav

Source: `signin.html:97-125, 381, 460-469`

### Layout
- **Position:** `sticky; top: 0`, full viewport width.
- **Z-index:** 50.
- **Background:** `rgba(0, 0, 15, 0.82)` with `backdrop-filter: blur(14px) saturate(160%)`.
- **Border-bottom:** `1px solid var(--rule)` (`#003E80`).
- **Inner container:** `max-width: 1440px`, centered, padding `24px calc(gutter + 12px) 22px calc(gutter + 12px)`. Gutter is `clamp(20px, 4vw, 64px)`.
- **Grid columns:** `auto auto` with `justify-content: space-between` (brand left, back link right). No center column — unlike `<ps-nav>` on home.

### `.brand` ("Prompt/Sharp" wordmark)
- Text: literal `Prompt/Sharp` with `/` wrapped in `<span class="slash">`.
- Font: `Mona Sans`, `font-variation-settings: "wdth" 82, "wght" 700`, **24px**, `letter-spacing: -0.035em`, `line-height: 1`.
- Slash glyph: `color: var(--accent)` (`#FF9800`), `font-style: italic`, `"wdth" 92, "wght" 500`.
- Same wordmark spec as home — see `home.md` § 1.

### `.back-link` (right side)
- Exact text: `← Back to tutorials`. The arrow is wrapped in `<span class="arr">` and is **orange** (`var(--accent)`); the label text is `var(--ink-dim)` (`#C5CDE4`).
- Font: IBM Plex Mono, **12px**, `letter-spacing: 0.1em`, uppercase, padding `4px 0`.
- Display: `inline-flex; align-items: center; gap: 10px`.
- Border-bottom: `1px solid transparent` (hover-only).
- Hover: `color: var(--ink)`, `border-bottom-color: var(--accent)`. Transition `color .2s ease, border-color .2s ease`.
- **No square ghost button** here — the back link is a bare anchor with hover underline, distinct from the `Sign in` ghost button on the home nav.

### Responsive
- **720px:** inner padding shrinks to `20px calc(gutter + 8px) 18px calc(gutter + 8px)`. Grid columns stay `auto auto`.

### Checks
- [ ] Sticky bar at `top: 0` with blur backdrop; remains visible on scroll.
- [ ] Brand wordmark uses `wdth 82 / wght 700` with italic orange slash (`wdth 92 / wght 500`). See Memory → "Foot-mark wordmark".
- [ ] Right side renders `← Back to tutorials`, **not** a `Sign in` button (this is the inverse of home's nav).
- [ ] The `←` arrow is orange; the label is ink-dim.
- [ ] Hover state: label flips to `var(--ink)` and a 1 px accent underline appears under the link.
- [ ] No center `.links` column rendered.
- [ ] At 720 px: padding shrinks; layout stays brand + back-link.
- [ ] **Live component:** `frontend/projects/domain/src/lib/layout/public-nav` should expose a `minimal` variant, OR the sign-in page should mount a dedicated `auth-nav-min` component instead of the full public nav. Verify the back link points at `/`.

---

## 2. `<ps-signin-stage>` — Centered card stage

Source: `signin.html:130-139, 382, 471-475`

### Layout
- Display `flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`, `flex: 1` (so it fills the space between nav and foot).
- Padding `48px var(--gutter) 72px` — extra bottom space pushes the foot down.
- `position: relative; z-index: 1` to sit above the radial-gradient body underlay.
- Renders exactly one child: `<ps-signin-card>`.

### Checks
- [ ] Card is vertically centered between the sticky nav and the foot at all widths.
- [ ] Stage has bottom padding of 72 px (`56px` at 720 px) so the card never touches the foot.
- [ ] At 720 px the stage padding is `32px var(--gutter) 56px`.
- [ ] **Live component:** `auth/sign-in-page/sign-in-page.html` — its host element must apply the `display: flex; flex: 1` so the card can center. If the page renders inside `<router-outlet>` that has its own flex parent, propagate the flex chain.

---

## 3. `<ps-signin-card>` — Centered sign-in card

Source: `signin.html:143-184, 477-525`

### Layout
- `width: 100%`, `max-width: 460px`.
- Border `1px solid var(--rule)` (`#003E80`).
- Background: `linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06)), var(--surface)` — same orange-tinted surface as the hero card on home (but at 0.06 alpha, not 0.08).
- Padding `56px 48px 40px`. At 720 px: `44px 28px 32px`.
- Flex column, `gap: 28px`.
- `position: relative` so the `::before` badge anchors to the top-left corner.

### `::before` badge — `SIGN IN`
- Pseudo-element with literal text `SIGN IN`.
- Position `absolute; top: -1px; left: -1px` (flush with the card's outer border).
- Background `var(--accent)` (`#FF9800`), color `var(--bg)` (`#00000F`).
- Font: IBM Plex Mono, **10px**, `letter-spacing: 0.22em`, `font-weight: 600`.
- Padding `5px 12px`. No `border-radius` — sharp corners.
- Mirrors the `FEATURED` badge from the home hero card (`home.md` § 2), but with a tighter `0.22em` tracking vs `0.20em`.

### `.card-head` (top block)
- Flex column, `gap: 12px`.

#### Eyebrow
- `<span class="eyebrow"><span class="dot"></span>Welcome back</span>`.
- Exact text: `Welcome back` (mixed case in markup — CSS uppercases it to `WELCOME BACK`).
- Font: IBM Plex Mono, **11px**, `font-weight: 500`, `letter-spacing: 0.18em`, `text-transform: uppercase`, `color: var(--muted)` (`#6B7AAF`).
- `.dot`: 6×6 px solid orange square, `margin-right: 10px`, `vertical-align: middle` (CSS uses `display: inline-block` — not actually a circle).

#### Headline `<h2>`
- Exact markup: `Sign in to<br/>Prompt<em>/</em>Sharp.`
- Two visual lines: `Sign in to` then `Prompt/Sharp.` (with the slash inside an italic `<em>`).
- Font: Mona Sans, `font-variation-settings: "wdth" 80, "wght" 600`, size `clamp(32px, 4vw, 44px)`, `letter-spacing: -0.035em`, `line-height: 1`. Margin 0.
- `em` (the `/` only): italic, `wdth 92 / wght 500`, `color: var(--accent)`.
- Note: this is **not** the foot-mark spec (`wdth 80 / wght 700` at 64 px). It is a sub-display size at `wdth 80 / wght 600`.

#### `.sub` paragraph
- Exact text: `Pick up where you left off — your progress and bookmarks stay with you.`
- Color `var(--ink-dim)` (`#C5CDE4`), **14px**, `max-width: 36ch`, `line-height: 1.5`, margin 0.

### Responsive
- **720px:** card padding shrinks to `44px 28px 32px`. Headline scales fluidly via clamp.

### Checks
- [ ] Card has sharp edges (no border-radius anywhere — verify card, badge, inputs, buttons).
- [ ] `SIGN IN` badge appears flush at top-left corner, `-1px / -1px` offset overlaying the border. Letter-spacing 0.22em (tighter than `FEATURED`'s 0.2em on home).
- [ ] Eyebrow reads `WELCOME BACK` (uppercased by CSS) with a 6×6 orange dot preceding the text.
- [ ] H2 reads on two lines: `Sign in to` / `Prompt/Sharp.` with **only the `/` slash italic and orange**. The trailing `.` after `Sharp` is included.
- [ ] H2 uses `wdth 80 / wght 600` — visibly heavier and more condensed than body text but lighter than the foot-mark.
- [ ] Sub paragraph copy is exactly `Pick up where you left off — your progress and bookmarks stay with you.` (em-dash, not hyphen).
- [ ] Card max-width 460 px; horizontally centered on all widths.
- [ ] **Live component:** `auth/sign-in-card/sign-in-card.html` + `.scss`. Verify the `SIGN IN` `::before` badge is present in the SCSS (often dropped during Angular port). The card slot should accept the form as projected content via `<ng-content>` so `sign-in-page` can compose the field rows.

---

## 4. `<ps-field>` — Form field (username + password)

Source: `signin.html:193-263, 402-457, 487-504`

The skeleton defines `<ps-field>` as an **autonomous custom element** with attributes `name`, `label`, `type`, `placeholder`, `autocomplete`, `index`, and an optional `with-eye` flag.

### Form wrapper
- `<form class="signin-form" onsubmit="event.preventDefault()">`
- Flex column, `gap: 20px`, margin 0.
- Direct children in DOM order: `ps-field#username`, `ps-field#password`, `.options-row`, `.submit-btn`.

### Field layout
- `<ps-field>` is `display: flex; flex-direction: column; gap: 10px`.
- Each field renders `<label>` + `<div class="input-wrap">` containing `<input>` and (optionally) a `<button class="toggle-eye">`.

### Label
- Font: IBM Plex Mono, **11px**, `font-weight: 500`, `letter-spacing: 0.16em`, uppercase, `color: var(--muted)`.
- `display: flex; align-items: center; gap: 10px`.
- A `::before` pseudo-element renders the index chip: `content: attr(data-index)`. The chip is Plex Mono **9px**, `letter-spacing: 0.12em`, `color: var(--accent)`, `padding: 2px 6px`, `border: 1px solid var(--rule)`.
- Field 1 label: index `01`, text `Username`.
- Field 2 label: index `02`, text `Password`.

### Input
- `width: 100%`, font Mona Sans `wdth 100 / wght 400`, size **15px**, `color: var(--ink)`, background `var(--bg)`, `border: 1px solid var(--rule)`, padding `15px 16px`, `letter-spacing: -0.005em`, **`border-radius: 0`** (sharp), `-webkit-appearance: none`, `appearance: none`.
- Transition `border-color .18s, background .18s, box-shadow .18s`.
- Placeholder color `var(--hush)` (`#3A4880`).
- States:
  - Hover → `border-color: var(--accent-2)` (`#8AA8FF` periwinkle).
  - Focus → `border-color: var(--accent)`, `background: rgba(255, 152, 0, 0.04)`, `box-shadow: inset 3px 0 0 var(--accent)` (a 3 px inset left accent strip). Placeholder color flips to `var(--muted)`.
  - Autofill (`:-webkit-autofill`) is forced: `-webkit-text-fill-color: var(--ink)`, `-webkit-box-shadow: 0 0 0 1000px var(--bg) inset, inset 3px 0 0 var(--accent)`. **No yellow Chrome autofill chrome.**
- `input.has-eye` adds `padding-right: 52px` to reserve space for the toggle button.

### Field 1 — Username
- `name="username"`, `type="text"`, placeholder `you@example.com`, `autocomplete="username"`, `index="01"`.

### Field 2 — Password (with eye toggle)
- `name="password"`, `type="password"`, placeholder `••••••••••` (ten U+2022 bullets), `autocomplete="current-password"`, `index="02"`, `with-eye` flag.
- `.toggle-eye` button: position `absolute; right: 10px; top: 50%; transform: translateY(-50%)`. Size 32×32 px. Transparent background, no border. Color `var(--ink-dim)`. Hover → `color: var(--accent)`.
- Contains two inline SVGs (20×20 each):
  - `.eye-open` (eye outline + pupil) — shown by default.
  - `.eye-slash` (eye crossed by a diagonal line) — hidden by default. When the button has class `revealed`, eye-open hides and eye-slash shows in orange.
- Click toggles input `type` between `password` and `text`, toggles `revealed` class, and updates `aria-label` between `Show password` / `Hide password` (initial state: `Show password`).

### Checks
- [ ] Both fields render `display: flex; flex-direction: column; gap: 10px` — label sits directly above its input.
- [ ] Each label has the small bordered index chip `01` / `02` in **orange Plex Mono 9 px** (not 10/11), with a 1 px navy border.
- [ ] Username field: placeholder `you@example.com`; no eye toggle; `type="text"`; `autocomplete="username"`.
- [ ] Password field: placeholder is **exactly ten** `•` bullets (U+2022), `type="password"`; eye toggle visible at right; `autocomplete="current-password"`.
- [ ] Inputs have **no border-radius** (sharp edges).
- [ ] On focus an orange 3 px inset strip appears on the **left** edge of the input (not a 4 px or full outline). Background tints `rgba(255,152,0,0.04)`.
- [ ] On hover the input border turns periwinkle `#8AA8FF`.
- [ ] Chrome autofill does NOT show the yellow box — verify by autofilling a saved credential.
- [ ] Eye toggle: clicking flips icon from outlined eye to slashed eye (orange); `aria-label` flips between `Show password` and `Hide password`; input type flips between `password` and `text`.
- [ ] **Live component:** `auth/sign-in-field-row/sign-in-field-row` — must support an `index` input (the editorial chip) and a `withEye` flag. If the field component currently uses a Material `mat-form-field`, replace it with a plain `<input>` styled per this spec — Material outlines will not match.

---

## 5. `.options-row` — Remember me + Forgot password

Source: `signin.html:265-309, 506-513`

### Layout
- `display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap`.
- At 720 px the gap grows to 16 px.

### `.check` — Remember me checkbox
- `<label class="check">` containing a visually hidden `<input type="checkbox" name="remember">`, a `<span class="box">`, and `<span class="lbl">Remember me</span>`.
- Box: 16×16 px, `border: 1px solid var(--rule)`, `background: var(--bg)`, `inline-flex` centered.
- A `::after` pseudo on the box renders the check glyph: 4×8 px right-bottom border with rotate 45° to form a tick. Color `var(--bg)`. Hidden (`opacity: 0`) until checked.
- Checked state: `background: var(--accent)`, `border-color: var(--accent)`. Check glyph reveals.
- Focus-visible: `outline: 1px solid var(--accent); outline-offset: 2px`.
- `.lbl`: IBM Plex Mono, **11px**, `letter-spacing: 0.1em`, uppercase, `color: var(--ink-dim)`.
- The actual input is `position: absolute; opacity: 0; pointer-events: none` — fully hidden but keyboard-reachable via the label.

### `.forgot-link` — Forgot password? button
- `<button type="button" class="forgot-link">Forgot password?</button>` (a button, not an anchor — accessibility intent).
- Font: IBM Plex Mono, **11px**, `letter-spacing: 0.1em`, uppercase, `color: var(--accent)`.
- `border-bottom: 1px solid var(--accent)`, `padding-bottom: 2px`. Other borders (top/left/right) explicitly `none`. Background transparent.
- Hover → `filter: brightness(1.1)`.

### Checks
- [ ] Row sits between the password field and the submit button with 20 px gap (from form's `gap: 20px`).
- [ ] Checkbox is a flat 16×16 px square with sharp corners; checked state fills orange with a dark tick.
- [ ] Label `Remember me` is uppercased to `REMEMBER ME` via CSS, **11 px** Plex Mono ink-dim.
- [ ] Forgot link reads `FORGOT PASSWORD?` (uppercased), orange, with an orange 1 px underline (`border-bottom`). Question mark is included.
- [ ] At 720 px the two items stay on one row until they collide, then wrap (gap 16 px).
- [ ] Tabbing the form: username → password → eye toggle → remember-me checkbox → forgot-password button → submit. Verify focus rings are visible.
- [ ] **Live component:** the `sign-in-card` template should wire `(change)` on the checkbox to a `rememberMe` form control and `(click)` on the forgot link to a `goForgotPassword()` handler.

---

## 6. `.submit-btn` — Sign in submit

Source: `signin.html:311-327, 515-517`

### Layout
- `<button type="submit" class="submit-btn">Sign in <span class="arr">→</span></button>`
- `display: inline-flex; align-items: center; justify-content: center; gap: 12px; width: 100%`.
- Padding `16px 22px`. Background `var(--accent)`. Color `var(--bg)`. Border `1px solid var(--accent)`.
- Font: IBM Plex Mono, **13px**, `font-weight: 600`, `letter-spacing: 0.12em`, uppercase.
- `line-height: 1`, `margin-top: 4px`.
- `cursor: pointer`. Transition `filter .2s, transform .1s`.
- Hover → `filter: brightness(1.08)`. Active → `transform: translateY(1px)`.
- `.arr` is the `→` glyph at **16 px** (larger than the surrounding 13 px text).
- This is the only **full-width** button on the page and uses a slightly heavier weight/size than the home `.btn.solid` (which is 12 px / 500 weight, but `.solid` overrides to 600).

### Checks
- [ ] Button spans the full 460 px card width (minus 48 px side padding → 364 px content width at desktop).
- [ ] Padding 16 px / 22 px — taller than the standard `.btn` (12 px / 22 px on home).
- [ ] Background pure `#FF9800`, text `#00000F`.
- [ ] Label `SIGN IN →` with the arrow visibly larger (16 px vs 13 px label).
- [ ] Hover brightens; active depresses by 1 px.
- [ ] No border-radius.
- [ ] **Live component:** `components/src/lib/button` — needs a `submit` / `block` variant that maps to this 13 px / 600 weight / 16 px-22 px padding spec. Verify the Angular template does not fall back to the standard `.btn.solid` styling (which is shorter and 12 px text).

---

## 7. `.legal` — Terms / Privacy footnote

Source: `signin.html:329-343, 520-522`

### Layout
- `<p class="legal">By continuing you agree to our <a>Terms</a> and <a>Privacy Policy</a>.</p>`
- Font: IBM Plex Mono, **10px**, `letter-spacing: 0.08em`, `line-height: 1.7`, `color: var(--muted)`.
- `padding-top: 16px`, `border-top: 1px solid var(--rule-soft)` (`#001A36` — softer than the main rule).
- Margin 0.
- Links: `color: var(--ink-dim)`, `text-decoration: none`, `border-bottom: 1px solid var(--rule)`, `padding-bottom: 1px`. Hover → `color: var(--ink)`, `border-bottom-color: var(--accent)`.

### Checks
- [ ] Exact copy: `By continuing you agree to our Terms and Privacy Policy.` (note "Privacy Policy", not "Privacy" alone).
- [ ] Both link words have ink-dim color and a 1 px navy underline (border-bottom, not text-decoration).
- [ ] Hover flips underline to accent orange.
- [ ] Top divider is the **soft** rule (`#001A36`), distinct from the surrounding card border (`#003E80`).
- [ ] Sits at the bottom of the card with 28 px gap above (from the card's `gap: 28px`).
- [ ] **Live component:** `sign-in-card` template must not paraphrase this copy. The two anchors should be `[routerLink]` to `/legal/terms` and `/legal/privacy`.

---

## 8. `<ps-signin-foot>` — Minimal page foot

Source: `signin.html:348-363, 383, 527-538`

### Layout
- Block element outside the stage so it pins to the bottom of the body's flex column.
- Display `flex; justify-content: space-between; align-items: center`.
- `max-width: 1440px`, centered, padding `24px var(--gutter) 32px`.
- Font: IBM Plex Mono, **10px**, `letter-spacing: 0.14em`, uppercase, `color: var(--muted)`.
- `position: relative; z-index: 1`.

### Left
- `<span>© 2026 · Prompt/Sharp</span>` — exact text, middle dot `·` (U+00B7).

### Right `.links`
- `display: flex; gap: 24px`.
- Three anchors in order: `<a>Privacy</a>`, `<a>Terms</a>`, `<a>Status</a>`.
- Links: `color: var(--ink-dim)`, no underline, cursor pointer. Hover → `color: var(--ink)`.

### Responsive
- **720px:** flex direction column, `gap: 10px`, `align-items: flex-start`.

### Checks
- [ ] Foot is **not** the full `<ps-footer>` from home — no 4-column grid, no foot-mark, no link lists.
- [ ] Left text reads exactly `© 2026 · Prompt/Sharp` with the U+00B7 middle dot.
- [ ] Three right-side links in order: PRIVACY, TERMS, STATUS (uppercased by CSS), 24 px gap.
- [ ] All Plex Mono 10 px muted.
- [ ] At 720 px: stacks vertically left-aligned.
- [ ] **Live component:** `auth/sign-in-footer/sign-in-footer.html` — verify it does not import or render `<app-public-footer>`. The three links should be `[routerLink]` to legal pages.

---

## 9. Page-level visual checks (global)

- [ ] **Body background:** the `body::before` overlay renders two radial gradients — orange `radial-gradient(1000px 700px at 80% 100%, rgba(255, 152, 0, 0.20), transparent 60%)` in the **bottom-right** (different from home, which is top-right at `85% -10%`), and periwinkle `radial-gradient(800px 600px at -10% 0%, rgba(138, 168, 255, 0.10), transparent 70%)` top-left. Plus 3-4 px scan lines via `repeating-linear-gradient`.
- [ ] **No `font-family: serif`** — both fonts are Mona Sans + IBM Plex Mono.
- [ ] **`min-height: 100vh`** on body with `display: flex; flex-direction: column` — without this the foot will float in the middle on short screens.
- [ ] **No skeleton shimmer placeholders** on this page (the sign-in form is real-data-ready from the start).
- [ ] **Custom element registration:** open DevTools console — no warnings about unknown `<ps-field>`, `<ps-signin-card>`, `<ps-signin-stage>`, `<ps-signin-foot>`, `<ps-nav-min>`.

---

## 10. Bug logging procedure

For every failed check above:

1. Open [`bugs/signin.md`](../../bugs/signin.md).
2. Append a new entry using the `SIGNIN-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 11. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Page renders the full public nav instead of `<ps-nav-min>` | `auth/sign-in-page/sign-in-page.html` — remove `<app-public-nav>` and mount a minimal nav |
| Brand wordmark wrong weight/width | `layout/public-nav` SCSS or dedicated `auth-nav-min` component |
| `SIGN IN` corner badge missing | `auth/sign-in-card/sign-in-card.scss` — add the `::before` pseudo |
| H2 slash `/` not italic / not orange | `auth/sign-in-card/sign-in-card.html` — ensure `<em>/</em>` markup, plus `em` styling in SCSS |
| Index chip (01/02) missing or wrong color | `auth/sign-in-field-row/sign-in-field-row.scss` — `label::before { content: attr(data-index); ... }` |
| Inputs have rounded corners | `sign-in-field-row.scss` — `border-radius: 0; -webkit-appearance: none; appearance: none` |
| Focus ring is a full outline (not left strip) | `sign-in-field-row.scss` — `:focus { box-shadow: inset 3px 0 0 var(--accent); }` |
| Autofill shows yellow background | `sign-in-field-row.scss` — add `:-webkit-autofill` overrides |
| Eye toggle missing / wrong icon swap | `sign-in-field-row/sign-in-field-row.ts` — toggle `revealed` class and input `type` |
| Submit button too short / wrong weight | `components/src/lib/button` — add `submit` variant or override in `sign-in-card.scss` |
| Legal divider uses main rule color | Use `var(--rule-soft)` (`#001A36`) not `var(--rule)` |
| Foot is the full home footer | `auth/sign-in-footer/sign-in-footer.html` — render the minimal 3-link foot only |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Bug log:** `docs/bugs/SIGNIN-001-sign-in-composition.md`
- **Screenshots:**
  - `docs/ui-audit/screenshots/signin/signin-desktop.png`
  - `docs/ui-audit/screenshots/signin/signin-tablet.png`
  - `docs/ui-audit/screenshots/signin/signin-mobile.png`
