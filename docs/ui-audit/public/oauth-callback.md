# OAuth Callback — UI Audit

- **Route:** `/auth/callback`
- **Skeleton:** [`docs/skeletons/oauth-callback.html`](../../skeletons/oauth-callback.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono — same shell as home)
- **Bug log:** [`bugs/oauth-callback.md`](../../bugs/oauth-callback.md)
- **Live component:** `frontend/projects/domain/src/lib/auth/oauth-callback-page`

> This is the **in-between / loading** state shown after the user returns from the identity provider but before the app has resolved the token exchange. Everything here is a **placeholder while authentication completes** — the spinning dot, the shimmer tile, the shimmer lines, the mono metadata. Emphasize this transient feel: nothing should look "final."

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
2. Open `http://localhost:4200/auth/callback?provider=microsoft&returnUrl=/admin` in one tab.
   - For dev, you may need to force the page to stay in its "pending" state — disable the token exchange or insert a `setTimeout(5000)` so you can audit the visuals.
3. Open `docs/skeletons/oauth-callback.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/oauth-callback.md`](../../bugs/oauth-callback.md) using ID prefix `OAUTH-CB-`.

---

## Composition (DOM order, from `oauth-callback.html:338-363`)

```
<ps-nav>              ← shared sticky nav (same as home)
<ps-shell>
  └─ <ps-auth-stage class="center-stage">
       └─ <ps-auth-card class="panel center-card">
            ├─ .meta-row    (spinning dot + eyebrow "AUTHENTICATING…")
            ├─ <h1 class="display"> "Returning to Prompt/Sharp" (em on Prompt/Sharp)
            ├─ <sk-tile>     (16:10 shimmer)
            ├─ .skeleton-stack  (2 × sk-line — 94%, 68% delay=1)
            ├─ .meta-row    (Provider + Returning to)
            └─ .cta-row     (single ghost "Cancel" button)
</ps-shell>
```

There is **no footer, no marquee, no other sections** — the page is intentionally barren so the loading state reads as a hold, not as content. The shell still applies its `max-width: 1440px` + gutter padding, and the `center-stage` inside it grabs `min-height: calc(100vh - 95px)` to vertically center the card.

Live counterpart: `frontend/projects/domain/src/lib/auth/oauth-callback-page/oauth-callback-page.html`. Verify the page mounts the public nav (it should — the user is still in "the product") but does **not** mount the public footer.

---

## 1. `<ps-nav>` — Shared sticky navigation

Source: `oauth-callback.html:338-350` (plus styles `106-160`).

Identical to the home page nav. **Verify against [`home.md` § 1 — `<ps-nav>`](./home.md#1-ps-nav--sticky-navigation-bar)** rather than re-documenting:
- Sticky `top: 0`, z-index 50, backdrop-blur navy.
- 3-column grid: `Prompt/Sharp` brand · `Tutorials Categories About` links · `Sign in` ghost button.

### Notes specific to this page
- The skeleton renders **no `active` class** on any of the three links (Tutorials / Categories / About are all inactive). This is correct for an interstitial route — verify the live app does not mark Tutorials active on `/auth/callback`.
- The right-side button is `Sign in` (ghost). For an *already-signing-in* user this is technically misleading; consider whether the live app should hide the button on this route. Note as a separate UX concern (`OAUTH-CB-` bug).

### Checks
- [ ] Nav matches `home.md` § 1 (wordmark spec, links, Sign-in ghost button).
- [ ] No link is marked active on `/auth/callback`.
- [ ] Decide whether the `Sign in` button should be hidden on this route (UX question — log as a bug if you think it should).

---

## 2. `<ps-shell>` — Page shell wrapper

Source: `oauth-callback.html:99-105, 351`.

### Layout
- `display: block; position: relative; z-index: 1`.
- `max-width: 1440px`, centered, padding `0 var(--gutter)` (no top/bottom padding — the inner `center-stage` handles vertical spacing).

### Checks
- [ ] Shell respects the same 1440 px ceiling and gutter as home.
- [ ] `z-index: 1` so it sits above the body's radial-gradient underlay.

---

## 3. `<ps-auth-stage>` (`.center-stage`) — Vertical-center container

Source: `oauth-callback.html:263-267, 353`.

### Layout
- `min-height: calc(100vh - 95px)` — viewport minus an approximation of the nav's height (24 + 22 + 24 + 24 = 94 ≈ 95). This anchors the card so it sits visually centered between the nav bottom and the bottom of the viewport.
- `display: grid; place-items: center`.
- Padding `72px var(--gutter)`.

### Checks
- [ ] At 1080 px tall the card is roughly equidistant from the nav and the bottom of the viewport.
- [ ] On short viewports (e.g., 700 px tall) the card does **not** clip — the stage's min-height allows scrolling.
- [ ] Padding 72 px / gutter is present on all four sides (the gutter clamps per width).
- [ ] **Live component:** `auth/oauth-callback-page/oauth-callback-page.scss` should set `:host { display: grid; place-items: center; min-height: calc(100vh - 95px); }` and not rely on a wrapper for centering.

---

## 4. `<ps-auth-card>` (`.panel.center-card`) — Loading card

Source: `oauth-callback.html:180-186, 268, 354-361`.

### Layout
- `width: min(100%, 540px)` — caps at 540 px on desktop, fills width on mobile (with the stage's gutter providing breathing room).
- `.panel` base: `border: 1px solid var(--rule)` (`#003E80`), background `linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06)), var(--surface)` (`#002A54`), padding **24px**.
- No special badge, no border-radius. Flex/grid is **not** set on the card — children stack with their own margins.
- The card is wider than the sign-in card (540 px vs 460 px) — different visual weight for a transient state vs an interactive form.

### Children in DOM order

#### 4a. `.meta-row` — spinner + eyebrow
- `<div class="meta-row"><span class="spin-dot"></span><span class="eyebrow">AUTHENTICATING…</span></div>`
- `.meta-row` is `display: flex; flex-wrap: wrap; gap: 8px; align-items: center`, `color: var(--ink-dim)`, Plex Mono **12px**, `letter-spacing: 0.06em`.
- `.spin-dot`: 14×14 px, `border: 2px solid var(--rule)`, `border-top-color: var(--accent)`, `border-radius: 50%`, `animation: spin 1s linear infinite`. (The only round element on the page — every other corner is sharp.)
- `.eyebrow`: Plex Mono **11 px**, `font-weight: 500`, `letter-spacing: 0.18em`, **uppercase** (already uppercased in markup via the `&hellip;` ellipsis), `color: var(--muted)` (`#6B7AAF`).
- Exact text: `AUTHENTICATING…` — the `…` is HTML entity `&hellip;` (U+2026 horizontal ellipsis), NOT three periods.

#### 4b. `<h1 class="display">` — Headline
- Exact markup: `Returning to <em>Prompt/Sharp</em>`.
- Inline style override on the h1: `font-size: clamp(40px, 6vw, 76px); margin: 20px 0;`.
- Base `.display`: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`, `color: var(--ink)`.
- `.display em` (the literal `Prompt/Sharp` string): italic, `wdth 85 / wght 500`, `color: var(--accent)`.
- Note: the `/` is **not** wrapped separately here — the entire phrase `Prompt/Sharp` is italic orange. This differs from the brand wordmark (where only the `/` is the slash glyph).
- Margin top/bottom 20 px (overrides the default 0).

#### 4c. `<sk-tile>` — Shimmer hero placeholder
- The `sk-tile` custom element: aspect-ratio 16/10, full card width, animated shimmer.
- Background gradient: `linear-gradient(100deg, #002A54 0%, #002A54 28%, #003E80 50%, #002A54 72%, #002A54 100%)`, background-size `220% 100%`, animation `shimmer 3.2s cubic-bezier(.4,0,.2,1) infinite`.
- Border: `1px solid #001A36` (rule-soft).
- This is the **placeholder for the user's avatar / app banner** until token exchange completes.

#### 4d. `.skeleton-stack` — Two shimmer lines
- `<div class="skeleton-stack" style="margin-top: 18px;">`
- `.skeleton-stack`: `display: flex; flex-direction: column; gap: 8px`.
- Two children:
  - `<sk-line w="94"></sk-line>` — first line, 94% width, no animation delay.
  - `<sk-line w="68" delay="1"></sk-line>` — second line, 68% width, `animation-delay: -1.1s` (so the two shimmer rows are out of phase).
- `sk-line` shimmer is `height: 12px` default (no `size` attr).

#### 4e. `.meta-row` — Provider + return URL
- Inline style: `margin-top: 22px`.
- Two spans:
  - `<span>Provider: Microsoft</span>`
  - `<span>Returning to: /admin</span>`
- Same `.meta-row` styling as 4a (mono 12 px, ink-dim, letter-spacing 0.06em). 8 px gap between spans, wraps on narrow.
- Both pieces of metadata are **mono** — they read like a console log, reinforcing the transient/diagnostic feel.
- The colon-space pattern (`Provider: Microsoft`, `Returning to: /admin`) is intentional. Do not paraphrase to `Provider — Microsoft` or `Returning to /admin`.

#### 4f. `.cta-row` — Single Cancel button
- `<div class="cta-row"><button class="btn ghost">Cancel</button></div>`
- `.cta-row`: `display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px`.
- Single button — the **ghost** variant: `background: transparent; color: var(--ink-dim); border: 1px solid var(--rule)`. Plex Mono **12 px**, weight 500, `letter-spacing: 0.1em`, uppercase, padding `12px 22px`, `line-height: 1`, `min-height: 42px`.
- Exact text: `Cancel`. No icon, no arrow.
- This is the only escape hatch — clicking it should abort the OAuth round-trip and return the user to `/sign-in`.

### Responsive
- **1100px:** card max-width still 540 px (no breakpoint affects `.center-card`).
- **720px:** card width fills the gutter-padded width; padding stays 24 px.

### Checks
- [ ] Card is **540 px** wide on desktop (visually wider than the sign-in card at 460 px).
- [ ] `AUTHENTICATING` reads with the ellipsis `…` (U+2026), **not** three dots.
- [ ] Spinning dot is **14×14 px**, 2 px navy ring with orange top, rotating once per second.
- [ ] Spinner is the only rounded element on the page.
- [ ] Headline reads `Returning to Prompt/Sharp` with `Prompt/Sharp` **fully italic orange** (not just the slash).
- [ ] Headline size scales between 40 px and 76 px.
- [ ] Below the headline, an `sk-tile` shimmer fills 16:10 — animated, not static.
- [ ] Two shimmer lines below the tile: 94% then 68% width, out of phase by ~1.1 s.
- [ ] Mono meta row at the bottom reads `Provider: Microsoft` and `Returning to: /admin` with the colon-space format preserved.
- [ ] Single `Cancel` ghost button at the bottom; no `Continue` / `Retry` (those are different states — log as bugs if present).
- [ ] No footer is rendered on this route.
- [ ] **Live component:** `auth/oauth-callback-page/oauth-callback-page.html` — verify it composes a stage + panel, has the `.spin-dot` element, the inline-styled h1, the `<sk-tile>` placeholder (or an Angular equivalent), the two `<sk-line>`s with the 94/68 widths, and the mono meta row with **dynamic** `Provider:` and `Returning to:` values bound to query params (`provider` and `returnUrl`).

---

## 5. `<sk-tile>` / `<sk-line>` — Shimmer primitives

Source: `oauth-callback.html:366-394`.

These two custom elements use shadow DOM with `adoptedStyleSheets` to share a `SHIMMER_SHEET`.

### Shimmer animation
- Background: `linear-gradient(100deg, #002A54 0%, #002A54 28%, #003E80 50%, #002A54 72%, #002A54 100%)`.
- `background-size: 220% 100%`.
- Animation: `shimmer 3.2s cubic-bezier(.4, 0, .2, 1) infinite`. Translates `background-position` from `200% 0` to `-200% 0` (left-to-right sweep).
- `border: 1px solid #001A36` on the host.

### `<sk-tile>`
- `aspect-ratio: 16/10`, `width: 100%`, `min-height: 80px`.

### `<sk-line>`
- Default `height: 12px`. `size="sm"` → 8 px, `size="lg"` → 18 px, `size="xl"` → 28 px.
- Width set by the `w="N"` attribute (percent).
- `[delay="1"]` → `animation-delay: -1.1s`. `[delay="2"]` → `animation-delay: -2s`.

### Checks
- [ ] Shimmer sweeps left-to-right roughly every 3.2 s.
- [ ] The two `sk-line`s are visibly out of phase (one is mid-sweep when the other is starting).
- [ ] `sk-tile` maintains exact 16:10 aspect ratio at all widths.
- [ ] **Live component:** Verify the Angular app has a shimmer atom — either `components/src/lib/skeleton-line` and `skeleton-tile` (preferred), or CSS-only `.sk-line` / `.sk-tile` utility classes. The shimmer keyframes must be defined globally (in `styles.scss`) or in each component's encapsulated SCSS.

---

## 6. Page-level visual checks (global)

- [ ] **Body background:** `body::before` overlay — orange `radial-gradient(1200px 600px at 85% -10%, rgba(255, 152, 0, 0.18), transparent 60%)` top-right, periwinkle `radial-gradient(900px 500px at -10% 30%, rgba(138, 168, 255, 0.10), transparent 70%)` top-left, plus 3-4 px scan lines. Same as home.
- [ ] **No content other than the card** — verify the page is not accidentally rendering hero / tracks / latest sections inherited from a shared layout.
- [ ] **Scrollbar:** the page should not scroll on a 1440×900 viewport. The card fits within `100vh - 95px`.
- [ ] **No `font-family: serif`** anywhere.
- [ ] **Custom element registrations:** DevTools console — no warnings about unknown `<ps-auth-card>`, `<ps-auth-stage>`, `<sk-tile>`, `<sk-line>`.
- [ ] **Live animation:** Both the `.spin-dot` rotation and the shimmer sweep should be active simultaneously. If either is static, the page reads as broken rather than loading.

---

## 7. Bug logging procedure

For every failed check above:

1. Open [`bugs/oauth-callback.md`](../../bugs/oauth-callback.md).
2. Append a new entry using the `OAUTH-CB-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Public footer renders on this route | `oauth-callback-page.html` — remove `<app-public-footer>` |
| Headline only renders the `/` italic (instead of the whole `Prompt/Sharp`) | Markup must be `<em>Prompt/Sharp</em>`, not `Prompt<em>/</em>Sharp` here |
| Spinner missing or static | `oauth-callback-page.scss` — add `.spin-dot` with the spin keyframes |
| Spinner is square / has wrong border colors | Must be `border: 2px solid var(--rule); border-top-color: var(--accent); border-radius: 50%` |
| `AUTHENTICATING` uses `...` (three periods) | Replace with `…` (U+2026 ellipsis) |
| `Provider:` / `Returning to:` are hardcoded | Bind to `route.queryParams` — fall back to `Microsoft` / `/admin` if missing |
| Shimmer tile / lines are static | Ensure `@keyframes shimmer` is defined globally; `sk-tile` / `sk-line` atoms must use `background-size: 220% 100%` and `animation: shimmer 3.2s ...` |
| Two `sk-line`s appear in phase (same animation start) | Second line needs `animation-delay: -1.1s` (or attribute `delay="1"`) |
| Card is 460 px (sign-in size) instead of 540 px | `.center-card` width must be `min(100%, 540px)` |
| Cancel button styled as solid | `.btn` (ghost is the default — `.solid` should NOT be applied) |
| Card has rounded corners | Remove any `border-radius` on `.panel` / `.center-card` |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before block |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Bug log:** `docs/bugs/OAUTH-CB-001-oauth-callback-composition.md`
- **Screenshots:**
  - `docs/ui-audit/screenshots/oauth-callback/oauth-callback-desktop.png`
  - `docs/ui-audit/screenshots/oauth-callback/oauth-callback-tablet.png`
  - `docs/ui-audit/screenshots/oauth-callback/oauth-callback-mobile.png`
