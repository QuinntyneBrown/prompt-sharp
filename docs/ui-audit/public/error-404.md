# 404 / Not Found — UI Audit

- **Route:** any unmatched route (wildcard `**`)
- **Skeleton:** [`docs/skeletons/error-404.html`](../../skeletons/error-404.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono — same shell as home)
- **Bug log:** [`bugs/error-404.md`](../../bugs/error-404.md)
- **Live component:** `frontend/projects/domain/src/lib/public/error-page` (route should map `**` to this component with a `kind="404"` input)

> Intentionally minimal: just the nav, a centered block with a giant display, a mono path readout, two CTAs, and the home marquee strip at the bottom for visual texture. No hero, no cards, no footer.

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
2. Open `http://localhost:4200/this-route-does-not-exist` in one tab (any unmatched URL works).
3. Open `docs/skeletons/error-404.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/error-404.md`](../../bugs/error-404.md) using ID prefix `E404-`.

---

## Composition (DOM order, from `error-404.html:336-360`)

```
<ps-nav>              ← shared sticky nav (same as home)
<ps-shell>
  ├─ <ps-error-stage class="center-stage">
  │    └─ .center-card
  │         ├─ .eyebrow      (orange dot + "Error state")
  │         ├─ <h1 class="display giant">  "404 / not <em>found</em>"
  │         ├─ .mono          "Path: /tutorials/missing-step"
  │         └─ .cta-row       Browse tutorials (solid) + Home (ghost)
  └─ <ps-marquee>     ← home marquee strip for visual texture
</ps-shell>
```

Note: the marquee strip at the bottom is **lifted directly from `home.html`** (same content, same animation) and serves only as texture / a visual signal that "you are still inside Prompt/Sharp." There is **no `<ps-footer>`** on this route.

Live counterpart: `frontend/projects/domain/src/lib/public/error-page/error-page.html`. Verify the page renders the centered error block + marquee, and that it can render in both `404` and `500` modes (the latter swaps copy but keeps the same structure).

---

## 1. `<ps-nav>` — Shared sticky navigation

Source: `error-404.html:336-348`.

Identical to home — **verify against [`home.md` § 1 — `<ps-nav>`](./home.md#1-ps-nav--sticky-navigation-bar)** rather than re-documenting:
- Sticky `top: 0`, z-index 50, backdrop-blur navy.
- 3-column grid: brand · `Tutorials Categories About` · `Sign in` ghost.

### Notes specific to this page
- No link is marked active (the user is on an undefined route, so highlighting Tutorials would be misleading).
- Keep the `Sign in` button — the user may want to authenticate even after hitting a 404.

### Checks
- [ ] Nav matches `home.md` § 1.
- [ ] No link marked active.
- [ ] Sign-in button visible.

---

## 2. `<ps-shell>` + `<ps-error-stage>` — Centered error stage

Source: `error-404.html:99-105, 263-267, 351`.

### Layout
- Shell: max-width 1440 px, padding `0 var(--gutter)`, `z-index: 1`.
- Stage (`.center-stage`): `min-height: calc(100vh - 95px)`, `display: grid; place-items: center`, padding `72px var(--gutter)`.
- Single child: `.center-card` (not a `.panel` — there is **no border, no surface fill** for the error block; just a centered text column).

### `.center-card` width
- `width: min(100%, 540px)`.
- The card here is a **bare container** — no border, no background, no padding-around. Distinct from the consent / callback cards which use `.panel`.

### Checks
- [ ] Error block is vertically centered between the nav bottom and the marquee top.
- [ ] No border or surface fill around the error text — it sits directly on the body background.
- [ ] Block max-width 540 px; horizontally centered.
- [ ] **Live component:** `error-page/error-page.scss` — the host must apply `display: grid; place-items: center; min-height: calc(100vh - 95px)`.

---

## 3. `.center-card` content — Error block

Source: `error-404.html:352-357`.

### 3a. `.eyebrow` — "Error state"

- Markup: `<div class="eyebrow"><span class="dot"></span>Error state</div>`.
- Font: IBM Plex Mono, **11 px**, `font-weight: 500`, `letter-spacing: 0.18em`, `text-transform: uppercase`, `color: var(--muted)` (`#6B7AAF`).
- `.dot`: 6×6 px solid orange square, `display: inline-block`, `margin-right: 10px`, `vertical-align: middle`.
- Exact text: `Error state` (mixed case in markup, CSS uppercases to `ERROR STATE`).

### 3b. `<h1 class="display giant">` — Giant 404 headline

- Exact markup: `<h1 class="display giant">404 / not <em>found</em></h1>`.
- The literal text is `404 / not found`, with **only `found` inside `<em>`**.
- `.display` base: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`, `color: var(--ink)`.
- `.giant` modifier: `font-size: clamp(72px, 15vw, 180px); margin: 0 0 24px`. **Largest type on the page.**
- `em` (the `found` word): italic, `wdth 85 / wght 500`, `color: var(--accent)`.
- The `/` is **literal text, not a span** — it inherits the base display style (no italic, no orange). This is the *opposite* of the brand wordmark, where the `/` is the only italic orange glyph.
- At 1440 px wide, `15vw` evaluates to **216 px**, clamped to the 180 px max — so the headline renders at 180 px.

### 3c. `.mono` — Path readout

- Markup: `<div class="mono">Path: /tutorials/missing-step</div>`.
- `.mono`: IBM Plex Mono, **12 px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)`.
- Exact text format: `Path: <pathname>`. The path is **not** wrapped in a `<code>` or `<kbd>` — it inherits mono styling.
- In the live app this **must be bound** to `window.location.pathname` (or Angular's `Location.path()`). Hardcoding `/tutorials/missing-step` is a bug.

### 3d. `.cta-row` — Two CTAs

- Markup: `<div class="cta-row"><button class="btn solid">Browse tutorials</button><button class="btn ghost">Home</button></div>`.
- `.cta-row`: `display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px`.
- **Browse tutorials** — `.btn.solid`: background `var(--accent)`, color `var(--bg)`, border-color `var(--accent)`, font-weight 600. Padding `12px 22px`, Plex Mono 12 px, letter-spacing 0.1em, uppercase, line-height 1, min-height 42 px.
  - Note: no trailing arrow on this button in the skeleton, unlike the home hero CTA which has `→`. If the live app adds one, log a bug.
- **Home** — `.btn.ghost`: transparent, color `var(--ink-dim)`, border `1px solid var(--rule)`. Same dimensions.
- Browse tutorials first (primary action — recover by browsing), Home second (secondary escape).

### Checks
- [ ] Eyebrow reads `ERROR STATE` (uppercased by CSS) with the 6×6 orange dot prefix.
- [ ] H1 reads `404 / not found` with **only `found` italic orange** — neither `404`, `/`, nor `not` are styled.
- [ ] H1 scales between 72 px and 180 px (clamped to 180 px at desktop).
- [ ] Mono path line reads `Path: <actual pathname>`. In live app must reflect the current URL, not hardcoded.
- [ ] Two CTAs: Browse tutorials (solid orange, left), Home (ghost, right). 14 px gap.
- [ ] Browse tutorials has **no trailing arrow** (`→`) — verify the live `.btn.solid` template does not always append one.
- [ ] No border, no background, no padding around the error block.
- [ ] **Live component:** `error-page/error-page.html` — must (a) bind the mono path line to the current pathname, (b) route Browse tutorials to `/tutorials`, (c) route Home to `/`. The component should accept a `kind` input (`404` / `500` / etc.) so the headline can be swapped.

---

## 4. `<ps-marquee>` — Bottom marquee strip

Source: `error-404.html:204-215, 359`.

### Content
The marquee here is a **shorter variant** than home — it contains 10 stack items (not 12) repeated twice:

```
.NET 9 ✦ Blazor ✦ EF Core ✦ MediatR ✦ SQL Server ✦
Azure Functions ✦ Clean Architecture ✦ RBAC ✦ OAuth 2.0 ✦ Aspire ✦
```

(then the same block again — doubled for seamless `translateX(-50%)` scroll).

Compared to home's marquee, this version **drops `MAUI` and `Service Bus`** from the end. Verify the live app does NOT mirror the full home list here — the difference is intentional (or alternatively, log as a bug if you think they should match).

### Style
- `display: block`, `border-bottom: 1px solid var(--rule)`, `padding: 20px 0`, `overflow: hidden`, `position: relative`.
- `.strip`: flex row, `gap: 56px`, `white-space: nowrap`, `align-items: center`.
- Animation: `scroll 40s linear infinite` translating from 0 to `-50%`.
- Items: Plex Mono **12 px**, `letter-spacing: 0.18em`, uppercase, `color: var(--ink-dim)`.
- `.dot` (the `✦` U+2726 four-pointed star): `color: var(--accent)`.

### Checks
- [ ] Marquee scrolls left-to-right at a 40 s cycle. No jitter at the wraparound (verify doubled content).
- [ ] Exactly 10 stack items per pass: `.NET 9`, `Blazor`, `EF Core`, `MediatR`, `SQL Server`, `Azure Functions`, `Clean Architecture`, `RBAC`, `OAuth 2.0`, `Aspire`.
- [ ] `✦` separators between every pair, all orange.
- [ ] Items uppercase via CSS (not in markup).
- [ ] Bottom 1 px navy border seals the page.
- [ ] **Live component:** `frontend/projects/domain/src/lib/public/marquee-strip` — should accept a `items` array input. Default value for the error route should be the 10-item list above (not the 12-item home list).

---

## 5. Page-level visual checks (global)

- [ ] **Body background:** same as home — orange `radial-gradient(1200px 600px at 85% -10%, rgba(255, 152, 0, 0.18), transparent 60%)` top-right, periwinkle top-left, 3-4 px scan lines.
- [ ] **No `<ps-footer>` on this route** — page ends at the marquee.
- [ ] **No `font-family: serif`.**
- [ ] **Custom element registrations:** DevTools console — no warnings about unknown `<ps-error-stage>`, `<ps-marquee>`.
- [ ] **Status code:** the response status from the SPA route should be **404** (not 200). Angular's default wildcard route hits 200; in production a server-side 404 should be issued. Log as bug if the network tab shows 200 for an unmatched URL.
- [ ] **No spinner, no shimmer, no skeleton placeholders** — this is a *final* state, not a loading state.

---

## 6. Bug logging procedure

For every failed check above:

1. Open [`bugs/error-404.md`](../../bugs/error-404.md).
2. Append a new entry using the `E404-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 7. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Page renders `<ps-footer>` after the marquee | `error-page.html` — remove the footer; the marquee is the final element |
| Error block has a border / surface fill | `error-page.scss` — `.center-card` must have no border, no background |
| H1 has `404` italic / orange | Markup must be `404 / not <em>found</em>` with only `found` italicized |
| H1 has the `/` styled as a slash glyph | Do NOT wrap `/` in a span; it must inherit base display |
| Mono path is hardcoded | Bind to `Location.path()` (Angular) or `window.location.pathname` |
| Browse tutorials button has a `→` | The skeleton has no trailing arrow on this CTA. Remove it from the template. |
| Home button is solid | Must be ghost (transparent + ink-dim) |
| Marquee shows the full 12-item home list | Pass a 10-item array to the marquee on this route |
| Marquee not scrolling | `marquee-strip.scss` — verify `@keyframes scroll` and `animation: scroll 40s linear infinite` |
| Server returns HTTP 200 for unmatched URL | Configure SPA fallback to issue 404 for unmatched routes (e.g., Azure Static Web Apps `routes.json` `responseOverrides`) |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before block |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
