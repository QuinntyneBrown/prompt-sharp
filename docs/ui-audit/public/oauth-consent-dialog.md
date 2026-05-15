# OAuth Consent Dialog — UI Audit

- **Route:** `/auth/consent` (in-product mimic of the provider's own consent screen)
- **Skeleton:** [`docs/skeletons/oauth-consent-dialog.html`](../../skeletons/oauth-consent-dialog.html)
- **Pattern:** A — **NOT** Pattern B. This is a full-page consent screen that *mimics* Microsoft's own consent UI when wired in-product (e.g., when Prompt/Sharp acts as both client and identity provider, or for a custom in-app re-consent flow). Pattern B would be a modal dialog overlay — this is not that.
- **Bug log:** [`bugs/oauth-consent-dialog.md`](../../bugs/oauth-consent-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/auth/oauth-consent-page` (composes `auth/oauth-consent-card`)

> Cosmetic mimicry of a provider consent page — foot-mark logo at the top of the card, "wants to access your Microsoft account" headline, scope rows, and the binary Allow / Deny choice. The visual register sits between the loading-state callback page (transient) and a finalized signed-in screen (confident).

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
2. Open `http://localhost:4200/auth/consent` in one tab.
3. Open `docs/skeletons/oauth-consent-dialog.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/oauth-consent-dialog.md`](../../bugs/oauth-consent-dialog.md) using ID prefix `OAUTH-CONSENT-`.

---

## Composition (DOM order, from `oauth-consent-dialog.html:336-365`)

```
<ps-nav>              ← shared sticky nav (same as home)
<ps-shell>
  └─ <ps-consent-stage class="center-stage">
       └─ <ps-consent-card class="panel center-card">
            ├─ .foot-mark (inline-styled to 48px) — "Prompt/Sharp" with italic slash
            ├─ <h1 class="display">  "Prompt/Sharp wants to access your Microsoft account"
            ├─ .mono                  "Signed in as quinntyne@example.com"
            ├─ .rule                  (1px navy divider, margin 22px 0)
            ├─ .skeleton-stack        3 × .label-value rows (Scope · sk-line)
            └─ .cta-row               Allow (solid) + Deny (ghost)
</ps-shell>
```

No footer, no marquee — same minimal shell as the OAuth callback page. The `center-stage` vertically centers the card between the nav and viewport bottom.

Live counterpart: `frontend/projects/domain/src/lib/auth/oauth-consent-page/oauth-consent-page.html` composing `auth/oauth-consent-card/oauth-consent-card.html`.

---

## 1. `<ps-nav>` — Shared sticky navigation

Source: `oauth-consent-dialog.html:336-348`.

Identical to home — **verify against [`home.md` § 1 — `<ps-nav>`](./home.md#1-ps-nav--sticky-navigation-bar)** rather than re-documenting:
- Sticky `top: 0`, z-index 50, backdrop-blur navy.
- 3-column grid: brand · links · `Sign in` ghost button.

### Notes specific to this page
- The user is **not yet fully signed in** at this point (consent precedes session establishment), so the `Sign in` button in the actions column is technically still accurate. Different from `/auth/callback`.
- No link is marked active.

### Checks
- [ ] Nav matches `home.md` § 1.
- [ ] No link is marked active.
- [ ] Same `Sign in` ghost button visible.

---

## 2. `<ps-shell>` + `<ps-consent-stage>` — Centered card shell

Source: `oauth-consent-dialog.html:99-105, 263-267, 349-352`.

Identical layout to the OAuth callback stage:
- Shell: max-width 1440 px, padding `0 var(--gutter)`, `z-index: 1`.
- Stage: `min-height: calc(100vh - 95px)`, `display: grid; place-items: center`, padding `72px var(--gutter)`.

### Checks
- [ ] Card sits centered between nav bottom and viewport bottom on a 1080 px tall screen.
- [ ] On a 700 px tall viewport the page scrolls (no clipping).
- [ ] **Live component:** `oauth-consent-page.scss` should host the centering grid; the card itself stays a dumb panel.

---

## 3. `<ps-consent-card>` (`.panel.center-card`) — The consent panel

Source: `oauth-consent-dialog.html:180-186, 268, 352-363`.

### Layout
- `width: min(100%, 540px)` — same 540 px ceiling as the OAuth callback card.
- `.panel`: `border: 1px solid var(--rule)` (`#003E80`), background `linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06)), var(--surface)` (`#002A54`), padding **24px**.
- No `::before` badge. No border-radius. Children stack with their own spacing (no card-level `gap`).

### 3a. `.foot-mark` — Brand wordmark (inline-sized to 48 px)

- Markup: `<div class="foot-mark" style="font-size: 48px;">Prompt<em>/</em>Sharp</div>`.
- Base `.foot-mark`: Mona Sans, `font-variation-settings: "wdth" 80, "wght" 700`, **base size 64 px** (overridden inline to **48 px** here), `line-height: 1`, `letter-spacing: -0.05em`, `margin-bottom: 18px`.
- `em` (the `/`): italic, `wdth 90 / wght 500`, `color: var(--accent)`.
- This is the **canonical foot-mark style** (Memory → "Foot-mark wordmark"). It's the same atom used in `<ps-footer>` on home, sized down to 48 px so it reads as a "logo at the top of a consent card" rather than a footer brand.

### 3b. `<h1 class="display">` — Consent headline

- Inline style: `font-size: clamp(34px, 5vw, 58px); margin: 0 0 18px;`.
- Exact text: `Prompt/Sharp wants to access your Microsoft account`. **No `<em>` markup** — the entire headline is in the base display style (italic accents are NOT applied to this headline despite `.display em` being defined globally).
- Base `.display`: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`, `color: var(--ink)`.
- Margin 0 / 0 / 18 px — flush to the foot-mark above, 18 px gap before the next element.
- The provider-mimicry tone: this is exactly how Microsoft's own consent page reads ("App X wants to sign you in" / "wants to access your account"). The visual style is Prompt/Sharp's, but the **copy pattern** is borrowed from Microsoft.

### 3c. `.mono` — "Signed in as" line

- Markup: `<div class="mono">Signed in as quinntyne@example.com</div>`.
- `.mono`: IBM Plex Mono, **12 px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)` (`#C5CDE4`).
- Exact text format: `Signed in as <email>`. The email is **not** wrapped in a tag in the skeleton — it inherits mono styling.
- In the live app this email should be bound to the active session's user (the one that the consent will be linked against). Hardcoding `quinntyne@example.com` is a bug.

### 3d. `.rule` — Divider

- Markup: `<div class="rule" style="margin: 22px 0;"></div>`.
- `.rule`: `height: 1px; background: var(--rule); width: 100%`.
- Inline 22 px top/bottom margin separates the meta header from the scope list.
- Same color as the card border.

### 3e. `.skeleton-stack` — Scope list

- Markup:
  ```html
  <div class="skeleton-stack">
    <div class="label-value"><span class="label">Scope</span><sk-line w="70"></sk-line></div>
    <div class="label-value"><span class="label">Scope</span><sk-line w="58" delay="1"></sk-line></div>
    <div class="label-value"><span class="label">Scope</span><sk-line w="64" delay="2"></sk-line></div>
  </div>
  ```
- `.skeleton-stack`: `display: flex; flex-direction: column; gap: 8px`.
- `.label-value`: `display: grid; grid-template-columns: 160px 1fr; gap: 18px; padding: 14px 0; border-top: 1px solid var(--rule-soft)` (`#001A36`).
- Each row is **a single scope**. The skeleton renders shimmer placeholders (`<sk-line>`) for the scope description, with the literal word `Scope` on the left.
- `.label` (the `Scope` text): Plex Mono, **11 px**, `letter-spacing: 0.14em`, uppercase, `color: var(--muted)` (`#6B7AAF`).
- `<sk-line>` widths: 70 / 58 / 64 percent. The 2nd and 3rd have `delay="1"` and `delay="2"` → animation-delays `-1.1s` and `-2s` so all three are out of phase.
- **In the live app**, each `sk-line` should be replaced with the human-readable scope description, e.g.:
  - `Read your profile` (scope `User.Read`)
  - `Read your email` (scope `Mail.Read`)
  - `Sign in and read your profile` (scope `openid profile`)
  - Style the resolved text as Mona Sans `wdth 100 / wght 400`, **14 px**, `color: var(--ink)` (not ink-dim — these are the things the user is consenting to and should read with confidence).

### 3f. `.cta-row` — Allow / Deny

- Markup: `<div class="cta-row"><button class="btn solid">Allow</button><button class="btn ghost">Deny</button></div>`.
- `.cta-row`: `display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px`.
- **Allow** — `.btn.solid`: background `var(--accent)` (`#FF9800`), color `var(--bg)` (`#00000F`), border-color `var(--accent)`, font-weight 600. Padding `12px 22px`, Plex Mono 12 px, letter-spacing 0.1em, uppercase, line-height 1, min-height 42 px.
- **Deny** — `.btn.ghost`: transparent background, color `var(--ink-dim)`, border `1px solid var(--rule)`. Same dimensions / font as Allow.
- **NOT** a `.btn.danger` (red border) for Deny — the Deny button is intentionally **muted ghost**, not alarming red. The destructive emphasis on Deny would skew users toward Allow; the muted ghost is more neutral.
- Allow comes **first** (left). Deny comes second.

### Responsive
- **1100px:** no change to card width (still 540 px).
- **720px:** card fills width minus gutter; `.cta-row` may wrap such that Deny stacks below Allow. `.label-value` becomes `grid-template-columns: 1fr; gap: 6px` per the global 720 px rule — so the `Scope` label sits **above** each `sk-line`.

### Checks
- [ ] Card width 540 px on desktop; foot-mark sized to 48 px (not the default 64 px).
- [ ] Foot-mark renders `Prompt/Sharp` with the **slash italic orange** (`wdth 90 / wght 500`). Memory → "Foot-mark wordmark".
- [ ] Headline reads exactly `Prompt/Sharp wants to access your Microsoft account` — no italics, no orange highlights in the title.
- [ ] Headline scales fluidly 34 px → 58 px.
- [ ] `Signed in as <email>` line is mono 12 px ink-dim; in the live app the email must be bound to the active session user (not hardcoded).
- [ ] 1 px navy divider with 22 px top/bottom margin separates the meta block from the scope list.
- [ ] Three `Scope` rows render with `Scope` label on the left (160 px wide column) and shimmer placeholders on the right. Out-of-phase shimmer (`delay="1"` and `delay="2"`).
- [ ] In the live app the shimmer is replaced by real scope descriptions in Mona Sans `wdth 100 / wght 400`, 14 px ink (not ink-dim).
- [ ] Allow / Deny CTAs at the bottom: Allow is solid orange (left), Deny is ghost (right). Deny is **not** styled as `.btn.danger`.
- [ ] 14 px gap between the two CTAs.
- [ ] At 720 px the scope rows collapse to single-column (label above shimmer).
- [ ] **Live component:** `auth/oauth-consent-card/oauth-consent-card.html` — must accept inputs for `provider` (e.g. `Microsoft`), `userEmail`, and a `scopes` array. The card template must replace `<sk-line>` shimmer with the resolved scope strings when data is available.

---

## 4. Page-level visual checks (global)

- [ ] **Body background:** same as home / OAuth callback — orange `radial-gradient(1200px 600px at 85% -10%, rgba(255, 152, 0, 0.18), transparent 60%)` top-right, periwinkle gradient top-left, 3-4 px scan lines.
- [ ] **No footer on this route.**
- [ ] **No marquee, no hero, no other sections.**
- [ ] **No `font-family: serif`** — only Mona Sans + IBM Plex Mono.
- [ ] **Custom element registrations:** DevTools console — no warnings about unknown `<ps-consent-card>`, `<ps-consent-stage>`, `<sk-line>`.
- [ ] **Accessibility:** Tab order is Allow → Deny → (loop). Both buttons must have visible focus rings; verify on keyboard navigation.
- [ ] **Visual register:** the page should feel "settled" — no spinning indicators, no progress UI. This is a *decision* state, not a *loading* state. (If you see a spinner here, log a bug — that belongs on the callback page only.)

---

## 5. Bug logging procedure

For every failed check above:

1. Open [`bugs/oauth-consent-dialog.md`](../../bugs/oauth-consent-dialog.md).
2. Append a new entry using the `OAUTH-CONSENT-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 6. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Renders as a modal dialog overlay instead of a full page | This is Pattern A — must be a full page, not a `<dialog>` element. Move to `<ps-consent-page>` route component. |
| Foot-mark renders at full 64 px (footer size) | `oauth-consent-card.html` — inline `style="font-size: 48px;"` on the `.foot-mark` element |
| Foot-mark slash not italic / not orange | `layout/public-footer` foot-mark SCSS — ensure the `em` child has `wdth 90 / wght 500; color: var(--accent); font-style: italic` |
| Headline has italic orange words | Remove any `<em>` from the h1 — this headline is **plain display style** |
| `Signed in as` email is hardcoded | Bind to `authState.currentUser.email` (or equivalent) |
| Scope list shows shimmer permanently | Replace `<sk-line>` shimmer with resolved scope strings once `scopes$` emits |
| Scope label column is too narrow / too wide | `.label-value { grid-template-columns: 160px 1fr; }` — 160 px is the spec |
| Deny button is red | Must be `.btn.ghost`, NOT `.btn.danger`. The danger variant is reserved for `access-denied.md`. |
| Allow button is ghost instead of solid | `.btn.solid` (`background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 600`) |
| Spinner / loading indicator visible | This is the decision state — remove any pending indicators (those belong on `/auth/callback`) |
| 720 px: scope rows still 2-column | Apply the global `.label-value { grid-template-columns: 1fr; gap: 6px; }` 720 px rule |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Bug log:** `docs/bugs/OAUTH-CONSENT-001-oauth-consent-composition.md`
- **Screenshots:**
  - `docs/ui-audit/screenshots/oauth-consent-dialog/oauth-consent-dialog-desktop.png`
  - `docs/ui-audit/screenshots/oauth-consent-dialog/oauth-consent-dialog-tablet.png`
  - `docs/ui-audit/screenshots/oauth-consent-dialog/oauth-consent-dialog-mobile.png`
