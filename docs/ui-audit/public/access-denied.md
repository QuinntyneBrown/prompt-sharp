# Access Denied — UI Audit

- **Route:** `/access-denied` (also: any RBAC-blocked route guard's redirect target)
- **Skeleton:** [`docs/skeletons/access-denied.html`](../../skeletons/access-denied.html)
- **Pattern:** A (ps-shell / Mona Sans + IBM Plex Mono — same shell as home, with **error-red accent on the italic display word**)
- **Bug log:** [`bugs/access-denied.md`](../../bugs/access-denied.md)
- **Live component:** `frontend/projects/domain/src/lib/auth/access-denied-page`

> Same minimal shell as the 404 page — nav, centered block, marquee — but with two intentional differences:
> 1. The italic display word is **error-red** (`--md-sys-color-error #FFB4AB`) rather than accent-orange.
> 2. The mono readout shows the **required role** as a `<kbd>` chip, not a URL path.
> 3. The primary CTA is **danger-bordered** (`Request access`) rather than solid-orange.

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
2. Sign in as a non-sysadmin user and navigate to a sysadmin-only route (e.g., `/admin/users`). The RBAC guard should redirect to `/access-denied`. Or open `/access-denied` directly.
3. Open `docs/skeletons/access-denied.html` directly in a second tab (file:// is fine).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px.
5. Walk the checks below in DOM order. Log every gap in [`bugs/access-denied.md`](../../bugs/access-denied.md) using ID prefix `ACCESS-`.

---

## Composition (DOM order, from `access-denied.html:337-360`)

```
<ps-nav>              ← shared sticky nav (same as home)
<ps-shell>
  ├─ <ps-access-stage class="center-stage">
  │    └─ .center-card
  │         ├─ .eyebrow      (orange dot + "RBAC boundary")
  │         ├─ <h1 class="display giant">  "Access <em>denied</em>" — em is RED
  │         ├─ .mono          "Role required: <kbd>sysadmin</kbd>"
  │         └─ .cta-row       Request access (danger) + Home (ghost)
  └─ <ps-marquee>     ← same 10-item marquee strip as 404 page
</ps-shell>
```

Structurally identical to the 404 page composition — the differences are entirely cosmetic (color tokens) and copy (RBAC wording). Same minimal shell, no footer.

Live counterpart: `frontend/projects/domain/src/lib/auth/access-denied-page/access-denied-page.html`. The component must inherit the same centering / shell scaffold as `error-page` — consider extracting a shared `<ps-error-stage>` atom if both pages diverge only in copy and accent color.

---

## 1. `<ps-nav>` — Shared sticky navigation

Source: `access-denied.html:337-349`.

Identical to home — **verify against [`home.md` § 1 — `<ps-nav>`](./home.md#1-ps-nav--sticky-navigation-bar)** rather than re-documenting:
- Sticky `top: 0`, z-index 50, backdrop-blur navy.
- 3-column grid: brand · `Tutorials Categories About` · `Sign in` ghost.

### Notes specific to this page
- No link is marked active.
- The user is signed in (otherwise the RBAC guard would not have run) — but the `Sign in` button is still rendered. UX consideration: should the live app swap this for a user-menu / sign-out on this route? Log as a UX bug if you want to surface that.

### Checks
- [ ] Nav matches `home.md` § 1.
- [ ] No link marked active.

---

## 2. `<ps-shell>` + `<ps-access-stage>` — Centered stage

Source: `access-denied.html:99-105, 263-267, 352`.

### Layout
- Shell: max-width 1440 px, padding `0 var(--gutter)`, `z-index: 1`.
- Stage (`.center-stage`): `min-height: calc(100vh - 95px)`, `display: grid; place-items: center`, padding `72px var(--gutter)`.
- Single child: `.center-card` (bare container, no panel border).

### Local stylesheet override

Source: `access-denied.html:331`.

```css
ps-access-stage .display em { color: var(--md-sys-color-error, #FFB4AB); }
```

This **single rule** is the entire delta from the 404 page. It overrides the global `.display em { color: var(--accent); }` (orange) with `#FFB4AB` (Material 3 light error tone). The `var()` falls back to the literal `#FFB4AB` if the token is undefined.

### Checks
- [ ] Bare centered card, no border / no surface fill.
- [ ] Italic `<em>` words inside the stage render in **#FFB4AB error red**, not accent orange.
- [ ] Verify the override is scoped to `ps-access-stage` (not leaking to other pages).
- [ ] **Live component:** `access-denied-page.scss` — define `--md-sys-color-error` (typically in a Material 3 token set) and apply the `:host .display em` rule. If using Angular Material, the token should already exist; otherwise hardcode `#FFB4AB`.

---

## 3. `.center-card` content — Access-denied block

Source: `access-denied.html:353-358`.

### 3a. `.eyebrow` — "RBAC boundary"

- Markup: `<div class="eyebrow"><span class="dot"></span>RBAC boundary</div>`.
- Font: IBM Plex Mono, **11 px**, `font-weight: 500`, `letter-spacing: 0.18em`, uppercase, `color: var(--muted)`.
- `.dot`: 6×6 px **orange** solid square (unchanged from other pages — the eyebrow dot stays orange even though the display word is red).
- Exact text: `RBAC boundary` (mixed case in markup → `RBAC BOUNDARY` after CSS).

### 3b. `<h1 class="display giant">` — Giant denial headline

- Exact markup: `<h1 class="display giant">Access <em>denied</em></h1>`.
- The literal text is `Access denied`, with **only `denied` inside `<em>`**.
- `.display` base: Mona Sans, `wdth 75 / wght 600`, `letter-spacing: -0.035em`, `line-height: 0.92`, `color: var(--ink)`.
- `.giant` modifier: `font-size: clamp(72px, 15vw, 180px); margin: 0 0 24px`.
- `em` (the `denied` word): italic, `wdth 85 / wght 500`, **`color: #FFB4AB`** (per the `ps-access-stage .display em` override).
- The word `Access` is plain display (ink white, not styled).

### 3c. `.mono` — Required role line

- Markup: `<div class="mono">Role required: <kbd>sysadmin</kbd></div>`.
- `.mono` (wrapper text `Role required:`): IBM Plex Mono, **12 px**, `letter-spacing: 0.04em`, `color: var(--ink-dim)`.
- `<kbd>`: Plex Mono, `color: var(--accent)` (`#FF9800`), `border: 1px solid var(--rule)` (`#003E80`), `padding: 2px 6px`, `background: var(--bg)` (`#00000F`). No `border-radius` (sharp chip).
- The role chip is **orange**, not red — the red is reserved for the headline emphasis only.
- Exact format: `Role required: <kbd>{role}</kbd>`. In the live app the role string must be bound to whichever role failed the guard (e.g., `editor`, `sysadmin`, `verifier`). Hardcoding `sysadmin` is a bug.

### 3d. `.cta-row` — Request access + Home

- Markup: `<div class="cta-row"><button class="btn danger">Request access</button><button class="btn ghost">Home</button></div>`.
- `.cta-row`: `display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px`.
- **Request access** — `.btn.danger`: `border-color: var(--md-sys-color-error, #FFB4AB)`, `color: var(--md-sys-color-error, #FFB4AB)`, background **transparent** (inherits the base `.btn` transparent background). Padding `12px 22px`, Plex Mono 12 px, letter-spacing 0.1em, uppercase, line-height 1, min-height 42 px, font-weight 500.
  - Note: `.btn.danger` is **outlined red on transparent**, NOT solid red. Solid would be too aggressive — this is a recoverable state.
- **Home** — `.btn.ghost`: transparent, color `var(--ink-dim)`, border `1px solid var(--rule)`.
- Request access first (primary action — escalate / ask for the role), Home second (back out).
- This is the **only page using `.btn.danger`** in the public surface. Verify that other pages do not accidentally inherit it.

### Checks
- [ ] Eyebrow reads `RBAC BOUNDARY` (uppercased by CSS) with the 6×6 **orange** dot — not red.
- [ ] H1 reads `Access denied` with **only `denied` italic** and in error-red (`#FFB4AB`).
- [ ] H1 scales between 72 px and 180 px (matches 404 page sizing).
- [ ] Mono line reads `Role required: <role>` with the role wrapped in a bordered `<kbd>` chip.
- [ ] `<kbd>` chip is **orange text on dark bg with navy border** — sharp corners, no border-radius.
- [ ] In live app the role text must reflect the actually-required role, not hardcoded.
- [ ] Two CTAs: Request access (danger / red-outlined, left), Home (ghost, right). 14 px gap.
- [ ] Request access has a **red border + red text + transparent background** — NOT a solid red fill.
- [ ] No border or surface fill around the access-denied block.
- [ ] **Live component:** `access-denied-page.html` — must (a) bind the `<kbd>` content to the required role (e.g., from route data or query param), (b) wire `Request access` to either an email mailto, a workflow form, or `/contact?subject=role-request`, (c) wire `Home` to `/`.

---

## 4. `<ps-marquee>` — Bottom marquee strip

Source: `access-denied.html:204-215, 360`.

**Identical** to the 404 page's marquee — same 10-item content, same animation, same styling. See [`error-404.md` § 4](./error-404.md#4-ps-marquee--bottom-marquee-strip) for the full spec.

Items in order: `.NET 9`, `Blazor`, `EF Core`, `MediatR`, `SQL Server`, `Azure Functions`, `Clean Architecture`, `RBAC`, `OAuth 2.0`, `Aspire` — doubled.

### Checks
- [ ] Marquee identical to 404 page's marquee (10 items, doubled, ✦ separators, 40 s cycle, 12 px Plex Mono ink-dim, ✦ orange).
- [ ] `RBAC` is present in the marquee — visually rhymes with the page's headline / eyebrow (`RBAC boundary`). This is intentional editorial; verify the live app keeps it.
- [ ] **Live component:** Same `marquee-strip` component as the 404 page — pass the same 10-item array.

---

## 5. Page-level visual checks (global)

- [ ] **Body background:** same as home — orange `radial-gradient(1200px 600px at 85% -10%, rgba(255, 152, 0, 0.18), transparent 60%)` top-right, periwinkle top-left, 3-4 px scan lines. **No red tint** — the red is contained to the headline `em` and the danger CTA outline only.
- [ ] **No `<ps-footer>` on this route.**
- [ ] **No `font-family: serif`.**
- [ ] **Color discipline:** Verify red is **only** used on (a) the italic `denied` word, (b) the `Request access` button outline + label. Everything else stays in the orange / periwinkle palette.
- [ ] **Custom element registrations:** DevTools console — no warnings about unknown `<ps-access-stage>`, `<ps-marquee>`.
- [ ] **Status code:** the response should be **403 Forbidden** for RBAC-blocked routes (server-side). The SPA route itself is 200, but server APIs called from this page should not return success.
- [ ] **No spinner, no shimmer** — this is a final state.

---

## 6. Bug logging procedure

For every failed check above:

1. Open [`bugs/access-denied.md`](../../bugs/access-denied.md).
2. Append a new entry using the `ACCESS-NNN` prefix.
3. Include:
   - The section + check that failed
   - Expected value (copy from this doc)
   - Actual value (from the running app)
   - Suggested fix location (component path)
4. Once fixed, append the commit SHA and mark `resolved`.

## 7. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Italic `denied` is orange instead of red | `access-denied-page.scss` — add `:host .display em { color: var(--md-sys-color-error, #FFB4AB); }` |
| Red leaks to other pages (e.g., `denied`-italic appears red elsewhere) | Verify the CSS selector is scoped to the page component's host, not global |
| Eyebrow dot is red | The dot stays **orange** (`var(--accent)`) — only the `em` shifts to red |
| `<kbd>` role chip is red / no border | Must be orange text, navy border, dark bg, sharp corners (`border-radius: 0`) |
| Role text is hardcoded as `sysadmin` | Bind to the actually-required role from route data / query param |
| Request access button is solid red | Must be `.btn.danger` — outlined only (transparent bg + red border + red text) |
| Request access button is ghost (navy outline) | Apply `.btn.danger`: `border-color: var(--md-sys-color-error); color: var(--md-sys-color-error)` |
| Page renders `<ps-footer>` | `access-denied-page.html` — remove footer; the marquee is the last element |
| Marquee shows the 12-item home list | Pass the 10-item array (same as 404 page) |
| `--md-sys-color-error` token undefined | Define it in `frontend/projects/tokens/` or use the literal `#FFB4AB` fallback (already in the CSS via `var()` default) |
| Server returns 200 for RBAC-blocked API calls | Server-side RBAC middleware should return 403 — not a UI fix, but log here for visibility |
| Color token drift | `frontend/projects/tokens/_colors.scss` |
