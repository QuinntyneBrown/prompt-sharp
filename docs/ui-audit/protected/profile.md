# Profile — UI Audit

- **Route:** `/profile`
- **Skeleton:** [`docs/skeletons/profile.html`](../../skeletons/profile.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono — same palette + chrome as the public site)
- **Bug log:** [`bugs/profile.md`](../../bugs/profile.md)
- **Live component:** `frontend/projects/domain/src/lib/protected/profile-page`

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
2. Open `http://localhost:4200/signin` and authenticate. After sign-in, navigate to `http://localhost:4200/profile` (or use the user menu in the public nav).
3. Open `docs/skeletons/profile.html` directly in a second tab (file:// is fine — the skeleton has no external deps beyond Google Fonts).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px (use DevTools device toolbar).
5. Walk the checks below in DOM order. Log every gap in [`bugs/profile.md`](../../bugs/profile.md) using ID prefix `PROFILE-`.

> **Auth gate:** this route is protected. If hitting `/profile` while signed out, the app must redirect to `/signin?returnUrl=/profile`. Verify before auditing.

---

## Composition (DOM order, from `profile.html:336-399`)

```
<ps-nav>                                ← sticky, full-viewport, lives outside ps-shell
<ps-shell>
  ├─ <ps-profile-hero class="page-hero">
  ├─ <section class="profile-layout section-block">
  │   ├─ <aside class="panel">                  ← left avatar / name / chips / ID
  │   └─ <div style="display: grid; gap: 18px;"> ← right stack of profile sections
  │       ├─ <ps-profile-section class="panel">  Email
  │       ├─ <ps-profile-section class="panel">  Linked accounts
  │       ├─ <ps-profile-section class="panel">  Roles
  │       └─ <ps-profile-section class="panel">  Notifications
  └─ <ps-footer>
</ps-shell>
```

Live counterpart should be `frontend/projects/domain/src/lib/protected/profile-page/profile-page.html`. Verify the order and that **every section is rendered**, not just stubbed.

---

## 1. `<ps-nav>` — Sticky navigation bar

Source: `profile.html:336-348`. Identical chrome to the home page; see [`public/home.md` §1](../public/home.md#1-ps-nav--sticky-navigation-bar) for the full audit (sticky position, brand wordmark `wdth 82 / wght 700`, italic orange slash, links, Sign-in button).

### Differences from home

- **None of the three links is active in the skeleton.** Each `<span class="">` has an empty class string (`profile.html:340-342`). The live app should highlight `Tutorials` / `Categories` / `About` only when on those routes; on `/profile`, none of them should have the active underline.
- **The `Sign in` ghost button must be replaced** with an authenticated user control on this route. Options: a user-avatar `md-icon-button` with a dropdown (My profile, Progress, Sign out), or a `Sign out` ghost button. The skeleton still renders the static `Sign in` text but that is a placeholder — flag if the live app shows `Sign in` while the user is signed in.

### Checks

- [ ] Nav chrome (sticky, blurred background, brand wordmark, three links, right-aligned actions) matches `public/home.md §1`.
- [ ] On `/profile`, **none** of the three nav links has the active underline.
- [ ] The right `.actions` slot shows a user control (avatar dropdown or "Sign out" ghost button), **not** the literal "Sign in" placeholder from the skeleton.
- [ ] At 720 px: links hidden, brand + user control only.
- [ ] **Live component:** `frontend/projects/domain/src/lib/layout/public-nav` must conditionally swap its right-side action based on `AuthService.isSignedIn`. The signed-in variant should expose links to `/profile`, `/progress`, and a `Sign out` action.

---

## 2. `<ps-profile-hero class="page-hero">` — Page hero

Source: `profile.html:351-354` (CSS at `169-173, 320-321`)

### Layout
- Block element with `page-hero` chrome: padding `72px 0 48px`, `border-bottom: 1px solid var(--rule)`.
- Content stacks vertically with default block flow.

### Eyebrow line
- Class `.eyebrow` — IBM Plex Mono, 11 px, weight 500, `letter-spacing: 0.18em`, uppercase, color `var(--muted)` (`#6B7AAF`).
- `.dot` prefix — 6×6 px square, background `var(--accent)` (`#FF9800`), `margin-right: 10px`, `vertical-align: middle`.
- Text content: `My Profile` (mixed-case in the skeleton; CSS lifts it to uppercase). Exact source: `<div class="eyebrow"><span class="dot"></span>My Profile</div>`.

### Display headline
- `<h1 class="display">` — Mona Sans, `font-variation-settings: "wdth" 75, "wght" 600`, `letter-spacing: -0.035em`, `line-height: 0.92`.
- Size: `clamp(48px, 8vw, 112px)`. At 1440 px ≈ 112 px; at 720 px shrinks via the 720 media query to `clamp(42px, 12vw, 72px)`.
- Color `var(--ink)` (`#FBFFFF`).
- Exact text: `Account ` then `<em>settings</em>` (italic, `wdth 85 / wght 500`, color `var(--accent)`).
- `margin: 0 0 24px`.

### Responsive
- **1100px:** unchanged.
- **720px:** `.page-hero` padding `48px 0 28px`; `h1.display` size shrinks via the smaller clamp.

### Checks
- [ ] Eyebrow renders the orange dot prefix followed by `My Profile` in uppercase tracked Plex Mono muted.
- [ ] `<h1>` reads exactly `Account settings` with `settings` italic orange.
- [ ] Headline uses Mona Sans `wdth 75 / wght 600` (the public-site "display" mixin).
- [ ] Headline scales fluidly between 48 px (small) and 112 px (≥1400 px).
- [ ] Bottom border of the hero is a single 1 px navy hairline (`var(--rule)`).
- [ ] At 720 px the hero padding shrinks to `48px 0 28px`.
- [ ] **Live component:** `protected/profile-page/profile-hero` (or inlined in `profile-page`). The headline `<em>` accent should come from a shared `display-em` SCSS partial — the same one used by the public hero — so the styling stays in sync.

---

## 3. `<section class="profile-layout section-block">` — Two-column layout

Source: `profile.html:355-385` (CSS at `175-189, 311-315`)

### Layout
- `.profile-layout` — grid `1.25fr 1fr`, gap 48 px, `align-items: start`.
- `.section-block` — padding `72px 0 48px`, `border-bottom: 1px solid var(--rule)`.

### Responsive
- **1100px:** grid collapses to `1fr` (stacked). Left aside renders above the right stack.
- **720px:** same single-column stack; `.label-value` rule lines flip to single column too (see §5).

### Checks
- [ ] Desktop layout: left column is 1.25× wider than the right (~56% vs 44%).
- [ ] Gap between columns is 48 px.
- [ ] Border-bottom on the section is a single 1 px navy hairline.
- [ ] At 1100 px the columns stack with the aside on top.
- [ ] **Live component:** `profile-page.html` should use a CSS grid with the same `1.25fr 1fr` ratio. Avoid `display: flex` here — the equal alignment at the top is fragile under flex.

---

## 4. Left aside (`<aside class="panel">`) — Identity card

Source: `profile.html:356-361` (CSS at `180-184, 277`)

### Panel chrome
- `border: 1px solid var(--rule)`, background `linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06)), var(--surface)`, padding 24 px.

### Children (in order)

1. **`<sk-circle class="avatar-lg">`** — circular shimmer placeholder.
   - Width 132 px (`.avatar-lg`), aspect-ratio 1, `border-radius: 50%`.
   - Background: shimmer gradient `#002A54 → #003E80` over 220% with 3.2 s loop (per `SHIMMER_SHEET`).
   - In the live app this should be replaced by the user's avatar image (square cropped to circle) with the shimmer used only during load.

2. **`<h2>`** — Mona Sans, default `wdth 100 / wght 400` (no `display` class), font-size inherited from `.panel h2` rule (no explicit size in skeleton → uses browser default `h2` ≈ 24 px). `letter-spacing: -0.025em`, `line-height: 1.1`, `margin: 24px 0 8px` (inline style).
   - Exact text: `Quinntyne Brown`.

3. **`.chip-row`** — flex wrap, gap 8 px, align center.
   - Chip 1: `<span class="chip accent">Microsoft</span>` — provider chip. Plex Mono 10 px, `letter-spacing: 0.12em`, padding `4px 8px`, color `var(--accent)`, border `1px solid var(--accent)`, background `var(--bg)`, uppercase via CSS.
   - Chip 2: `<span class="chip">Editor</span>` — role chip. Same base, color `var(--ink)`, border `var(--rule)`.

4. **`.mono` block** — Plex Mono, 12 px, `letter-spacing: 0.04em`, color `var(--ink-dim)`. `margin-top: 18px` (inline).
   - Two lines separated by `<br/>`:
     - `ID: usr_8F3A-2291`
     - `Last sync: 2 min ago`

### Checks
- [ ] Aside has the 1 px navy border with the warm subtle orange-tinted gradient overlay on `var(--surface)` (panel chrome).
- [ ] Padding inside the aside is 24 px on all sides.
- [ ] Avatar circle is 132 px diameter, shimmering during load.
- [ ] Name `Quinntyne Brown` appears below the avatar with 24 px top margin, 8 px bottom.
- [ ] **Provider chip is `Microsoft`** in accent variant (orange text + orange border).
- [ ] **Role chip is `Editor`** in default variant (ink text + rule border).
- [ ] Both chips render uppercase via CSS, even though the markup is title-case.
- [ ] Mono ID block: `ID: usr_8F3A-2291` on line 1, `Last sync: 2 min ago` on line 2 (Plex Mono 12 px ink-dim).
- [ ] At 1100 px the aside reflows above the right stack but keeps the same chrome.
- [ ] **Live component:** `profile-identity-card` atom in `domain/src/lib/protected/profile-identity-card`. Inputs: `avatarUrl`, `name`, `provider` (`'Microsoft' | 'GitHub' | ...`), `role`, `userId`, `lastSyncAt`. The provider value should map to a localised chip label and the accent variant should always apply.

---

## 5. Right stack (`<div style="display: grid; gap: 18px;">`) — Profile sections

Source: `profile.html:362-384`

### Layout
- Inner grid, gap 18 px, single column (one section per row).
- Four `<ps-profile-section class="panel">` cards stacked vertically. Each is its own `.panel` (same chrome as the aside).

### Card structure (shared)
- Panel chrome: 1 px rule border, surface + faint orange gradient, padding 24 px.
- `<h3>` — `margin: 0 0 16px`, `letter-spacing: -0.025em`, `line-height: 1.1`. Inherits Mona Sans default; no explicit size in CSS → browser default `h3` ≈ 18.72 px. The four cards use these exact `h3` text values (one per card):
  - Card 1: `Email`
  - Card 2: `Linked accounts`
  - Card 3: `Roles`
  - Card 4: `Notifications`
- Each card contains **two `.label-value` rule lines** with identical structure:
  - `.label-value` — grid `160px 1fr`, gap 18 px, padding `14px 0`, `border-top: 1px solid var(--rule-soft)` (`#001A36`).
  - `.label` — Plex Mono 11 px, `letter-spacing: 0.14em`, uppercase, color `var(--muted)`.
  - Value: shimmer `<sk-line>` placeholder. Row 1 → `w="68"` (68% width). Row 2 → `w="42"` with `delay="1"` (animation-delay -1.1s, so rows shimmer out-of-phase).

#### Card 1 — Email

```
<ps-profile-section class="panel">
  <h3>Email</h3>
  <div class="label-value"><span class="label">Primary</span><sk-line w="68"></sk-line></div>
  <div class="label-value"><span class="label">Status</span><sk-line w="42" delay="1"></sk-line></div>
</ps-profile-section>
```

#### Card 2 — Linked accounts

Same shape, `<h3>Linked accounts</h3>`. Labels: `Primary`, `Status`.

#### Card 3 — Roles

Same shape, `<h3>Roles</h3>`. Labels: `Primary`, `Status`.

#### Card 4 — Notifications

Same shape, `<h3>Notifications</h3>`. Labels: `Primary`, `Status`.

> **Important:** The skeleton uses **the same two label texts (`Primary` / `Status`)** in every card as placeholder shimmer rows. The live app must replace these with the real label/value pairs per card (e.g. Email → `Primary` / `Backup` / `Verified`; Roles → `Active role` / `Permissions`; Notifications → `Tutorial updates` / `Account alerts` / `Weekly digest`). Mirror the skeleton **structure**, not the placeholder copy.

### Responsive
- **1100px:** the right stack moves below the aside; cards remain full-width.
- **720px:** `.label-value` grid collapses to `1fr` with gap 6 px, so each rule line stacks the label above the value.

### Checks
- [ ] Right column shows **exactly four cards** in this order: Email, Linked accounts, Roles, Notifications.
- [ ] Each card shares the same panel chrome as the left aside (border + tinted gradient + 24 px padding).
- [ ] Each card's `<h3>` text matches verbatim: `Email`, `Linked accounts`, `Roles`, `Notifications`.
- [ ] Each card has two `.label-value` rule lines separated only by a faint `var(--rule-soft)` (`#001A36`) top border.
- [ ] Each `.label` renders Plex Mono 11 px uppercase tracked-out muted.
- [ ] Each value column is a shimmer line (live app should replace with real data).
- [ ] Row 1 shimmer width = 68%; Row 2 shimmer width = 42% with -1.1s animation offset.
- [ ] At 720 px the label and value stack vertically with 6 px gap inside each rule line.
- [ ] **Live components:** `profile-section` atom in `domain/src/lib/protected/profile-section` accepts a `title` input and projects rule-lines via `<ng-content>`. A `profile-rule-line` atom takes `label` + `value` inputs and renders the grid layout. The four section components live in `protected/profile-page` and feed real data.

---

## 6. `<ps-footer>` — Site footer

Source: `profile.html:387-398`. Identical to the public footer; see [`public/home.md` §7](../public/home.md#7-ps-footer--site-footer) for the full audit (foot-mark 64 px wordmark, three link columns, copyright row, responsive collapse).

### Checks
- [ ] Footer chrome matches `public/home.md §7` verbatim — Foot-mark wordmark (Memory: foot-mark wordmark style is canonical), three columns (Tutorials / Categories / Account), and `© 2026 · Prompt/Sharp` bottom row.
- [ ] **Live component:** same `frontend/projects/domain/src/lib/layout/public-footer` used by the home page. Reused across public and protected routes.

---

## 7. Page-level visual checks (global)

- [ ] **Background radial gradients:** the body `::before` overlay produces a soft orange glow at top-right and a periwinkle glow at top-left, plus 1px horizontal scan lines (`repeating-linear-gradient` at 3-4px). Verify these are present and not occluded.
- [ ] **Page horizontal padding** is `clamp(20px, 4vw, 64px)` — at 1440 px this is 57.6 px, at 720 px ~28.8 px.
- [ ] **No `font-family: serif`** anywhere — both fonts are sans-serif (Mona Sans + IBM Plex Mono).
- [ ] **Skeleton primitives** — until real data is wired, sections should show shimmer (`sk-circle`, `sk-line`) gracefully, not blank blocks.
- [ ] **No leakage of admin tokens** — this is Pattern A, so no `--md-sys-color-*` variables should be in scope.

---

## 8. Bug logging procedure

For every failed check above:

1. Open [`bugs/profile.md`](../../bugs/profile.md).
2. Append a new entry using the `PROFILE-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 9. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Nav still shows "Sign in" while authenticated | `domain/src/lib/layout/public-nav/public-nav.html` — branch on `auth.isSignedIn$` |
| H1 missing italic-orange "settings" | `protected/profile-page/profile-page.html` — wrap `settings` in `<em>` inside `.display` |
| Avatar not circular | Verify `sk-circle` / live avatar atom applies `border-radius: 50%` and `aspect-ratio: 1` |
| Provider chip not accent variant | Apply `.chip.accent` modifier or `<ps-chip accent>` |
| Mono ID block wrong font | Apply `.mono` class — Plex Mono 12 px, 0.04em tracking, ink-dim |
| Cards missing tinted gradient | `.panel` mixin — verify `linear-gradient(180deg, transparent, rgba(255, 152, 0, 0.06))` is layered on `var(--surface)` |
| Label column wrong width | `.label-value { grid-template-columns: 160px 1fr; }` |
| Label not uppercase Plex Mono | `.label-value .label` — Plex Mono 11 px, 0.14em tracking, uppercase, muted |
| Rule lines have full-`--rule` border instead of soft | `.label-value` uses `border-top: 1px solid var(--rule-soft)` (`#001A36`) |
| Right stack gap wrong | The outer `<div>` style is `display: grid; gap: 18px;` — verify exact 18 px gap |
| Shimmer too uniform across rows | Add `delay="1"` to alternating rows so they shimmer out of phase |
| Footer foot-mark not condensed/heavy | `domain/src/lib/layout/public-footer/public-footer.scss` |
| Background gradients missing | `frontend/projects/promp-sharp/src/styles.scss` body::before block |
| Color token drift | `frontend/projects/tokens/_colors.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/PROFILE-001-profile-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/profile/profile-desktop.png`; `docs/ui-audit/screenshots/profile/profile-tablet.png`; `docs/ui-audit/screenshots/profile/profile-mobile.png`
