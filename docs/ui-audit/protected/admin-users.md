# Admin Users — UI Audit

- **Route:** `/admin/users`
- **Skeleton:** [`docs/skeletons/admin-users.html`](../../skeletons/admin-users.html)
- **Pattern:** B (`@material/web` MD3 components + Roboto Flex / Mona Sans / Material Symbols Outlined, admin shell with sticky top app bar + 240 px left nav rail)
- **Bug log:** [`bugs/admin-users.md`](../../bugs/admin-users.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/users/admin-users-page`

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
2. Sign in via the public `/signin` page using an OAuth account that maps to a user with the `sysadmin` role (the Users page is **sysadmin-only** — editors and viewers receive a 403 via the role guard). Once signed in, click **Users** in the admin nav rail to land on `/admin/users`.
3. Open `docs/skeletons/admin-users.html` directly in a second tab (file:// fine — Google Fonts + `@material/web` importmap only).
4. Set browser zoom to 100%. Audit at three widths: 1440 px, 1100 px, 720 px. At 720 px the nav rail collapses to a 72 px icon-only rail and the data table becomes horizontally scrollable inside its rounded card.
5. Walk the checks below in DOM order. Log every gap in [`bugs/admin-users.md`](../../bugs/admin-users.md) using ID prefix `USERS-`.

---

## Composition (DOM order, from `admin-users.html:264-337`)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             ← sticky, z-index 50
  │   ├─ menu md-icon-button
  │   ├─ .brand-row  (Prompt/Sharp + Admin tag)
  │   ├─ .spacer
  │   └─ .actions  (notifications · help · QB avatar)
  ├─ <div class="admin-layout">    ← grid 240px / 1fr
  │   ├─ <ps-admin-nav-rail>       ← Users = active
  │   └─ <main class="admin-main">
  │       └─ <ps-admin-users>
  │           ├─ <header class="page-header">  (breadcrumb · H1 · summary · Invite)
  │           └─ <section class="card table-wrap">  (data-table — 8 columns)
</ps-admin-shell>
```

Live counterpart: `admin-users-page.ts` composes `admin-users-table` (rows = `admin-user-row`, role cells = `user-role-chips`).

Pattern B foundations (top bar + nav rail + MD3 `:root`) are shared — see [`admin-tutorial-editor.md`](./admin-tutorial-editor.md) sections 1 and 2 for the full breakdown; only the **active nav item** and the **page body** differ here.

---

## 1. `<ps-admin-topbar>` — Sticky top app bar

Source: `admin-users.html:266-276`

### Layout
- Identical to other admin pages: 64 px height, sticky `top: 0; z-index: 50`, `background: #0F1A30`, `border-bottom: 1px solid #3A4880`, `padding: 0 12px`, flex with `gap: 16px`.

### Right cluster — `.actions`
- `<md-icon-button aria-label="Notifications"><md-icon>notifications</md-icon></md-icon-button>`.
- `<md-icon-button aria-label="Help"><md-icon>help</md-icon></md-icon-button>`.
- `.avatar` 36 × 36 circle, content `QB`, `title="Quinntyne Brown"`, orange container.

### Checks
- [ ] Top bar contains only `notifications`, `help`, and the user avatar in the right cluster — **no** Invite button up here (Invite lives only in the page header).
- [ ] Wordmark renders Mona Sans `wdth 82 / wght 700`, slash italic orange `wdth 92 / wght 500`.
- [ ] `Admin` chip is solid orange.
- [ ] At 720 px the `Admin` chip is hidden.
- [ ] **Live component:** `admin-top-bar` — default action slot.

---

## 2. `<ps-admin-nav-rail>` — Left navigation rail

Source: `admin-users.html:279-311`

Same seven-item rail. **Active item: `Users`** (`group` icon).

### Checks
- [ ] Active item is **Users**, with `background: #2A3970`, `color: #D8E2FF`, `font-weight: 600`, `group` icon filled (`'FILL' 1`).
- [ ] `Tutorials` shows the `12` orange badge.
- [ ] Items appear in this exact order: Dashboard, Tutorials (badge 12), Categories, Tags, Media, Users (**active**), Audit log.
- [ ] At 720 px the rail collapses to 72 px icon-over-label cells.
- [ ] **Live component:** `admin-nav-rail` — `routerLinkActive` on the Users link matches `/admin/users`.

---

## 3. `<header class="page-header">` — Page header

Source: `admin-users.html:316-323`

### Layout
- `display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap`.

### Breadcrumb
- `Admin` · `/` · `.current` `Users`. 13 px, ink-dim, `inline-flex`, `gap: 6px`, `margin-bottom: 8px`. `.current` color `#FBFFFF`, weight 500.

### H1
- Exact text: `Users and roles`.
- Roboto Flex, **36 px / weight 400**, `letter-spacing: 0`, `line-height: 1.1`, `margin: 0 0 8px`.

### Summary
- `font-size: 14px`, `color: #C5CDE4`, `display: flex; gap: 14px; flex-wrap: wrap`.
- Two spans with bold-prefix counts:
  - `<b>38</b> users`
  - `<b>5</b> sysadmins`

### Actions
- `<md-filled-button><md-icon slot="icon">person_add</md-icon>Invite</md-filled-button>` — orange filled button, leading `person_add` glyph, label `Invite`. Opens `admin-user-invite-dialog` (see `docs/skeletons/admin-user-invite-dialog.html`).

### Responsive
- **720 px:** `flex-direction: column; align-items: flex-start` — Invite button drops below the summary.

### Checks
- [ ] Breadcrumb reads exactly `Admin / Users` with `Users` as the bold `current` segment.
- [ ] H1 text is **exactly** `Users and roles` (lowercase `and`).
- [ ] Summary shows `38 users` and `5 sysadmins` with the digits bold (`<b>` wrap).
- [ ] Summary counts bind to live data — `38` and `5` are placeholders.
- [ ] `Invite` is an `md-filled-button` with a leading `person_add` icon and label `Invite`.
- [ ] Invite button opens `admin-user-invite-dialog`, not a generic create form.
- [ ] Header wraps cleanly at 720 px.

---

## 4. `<section class="card table-wrap">` — Users data table

Source: `admin-users.html:324-331`

### Layout
- `.card`: `background: #0F1A30`, `border-radius: 16px`, `overflow: hidden`.
- `.table-wrap`: `overflow-x: auto`.
- No top margin — the table card abuts the page-header directly.

### Table
- `<table class="data-table">`: `width: 100%; border-collapse: collapse; min-width: 860px`.
- **Eight columns**: `Avatar`, `Name`, `Email`, `Provider`, `Role`, `Last seen`, `Status`, `(row actions)`.

### `<thead>`
- `font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase`, `color: #C5CDE4`, `background: #0A1428`, `border-bottom: 1px solid #3A4880`, `padding: 14px 16px`, `text-align: left`, `white-space: nowrap`.
- Headers in order: `Avatar`, `Name`, `Email`, `Provider`, `Role`, `Last seen`, `Status`, (empty for row actions).

### `<tbody>` — Four rows (verbatim content)

| Avatar (initials) | Name | Email | Provider | Role | Last seen | Status |
|---|---|---|---|---|---|---|
| `QB` | `Quinntyne Brown` | `quinn@example.com` | `Microsoft` | `sysadmin` | `2 min ago` | `Active` |
| `AC` | `Alex Chen` | `alex@example.com` | `Microsoft` | `editor` | `34 min ago` | `Active` |
| `JR` | `Jamie Ruiz` | `jamie@example.com` | `GitHub` | `viewer` | `Yesterday` | `Invited` |
| `SL` | `Sam Lee` | `sam@example.com` | `Microsoft` | `editor` | `3 days ago` | `Active` |

### Cell anatomy

#### 4.1 Avatar cell
- `<span class="avatar-sm">QB</span>` — 32 × 32 circle, `background: var(--md-sys-color-secondary-container)` (`#2A3970`), `color: var(--md-sys-color-on-secondary-container)` (`#D8E2FF`), **12 px / weight 700**, `display: inline-flex; align-items: center; justify-content: center`. Note: this is **periwinkle**, not orange like the top-bar QB avatar — the table avatars use the secondary-container palette to read as data, not actions.

#### 4.2 Name cell
- Plain `<td>` with name text — Roboto Flex 14 px, ink `#FBFFFF`. In production should be a link to the user detail page (`/admin/users/:id`).

#### 4.3 Email cell
- Plain `<td>` with email text — Roboto Flex 14 px, default ink. Optionally render as `mailto:` link.

#### 4.4 Provider cell
- `<span class="pill">Microsoft</span>` or `<span class="pill">GitHub</span>`.
- `.pill` default variant: `background: var(--md-sys-color-secondary-container)` (`#2A3970`), `color: var(--md-sys-color-on-secondary-container)` (`#D8E2FF`), **11 px / weight 600**, `letter-spacing: 0.06em`, `padding: 4px 10px`, `border-radius: 999px`, `white-space: nowrap`.
- Possible values: `Microsoft`, `GitHub` (and probably `Google` in production). All providers use the same periwinkle pill — no per-provider color in the skeleton.

#### 4.5 Role cell — `<md-chip-set>` with a single `<md-assist-chip>`
- `<md-chip-set><md-assist-chip label="sysadmin"></md-assist-chip></md-chip-set>`.
- Possible label values: `sysadmin`, `editor`, `viewer`.
- MD3 assist-chip: outlined chip with rounded corners, label text from the `label` attribute. The skeleton uses **one chip per user** — a user has exactly one role.
- The skeleton uses `md-assist-chip` (not `md-filter-chip`), which means the chip is **display-only** in this row. To change a role, the user opens the row menu (more_vert) → `Change role…`, which presents a select.

#### 4.6 Last seen cell
- Plain `<td>` with humanized relative time: `2 min ago`, `34 min ago`, `Yesterday`, `3 days ago`. Wire via a `relativeTime` pipe.

#### 4.7 Status cell — `<span class="status ...">`
- Active: `<span class="status published">Active</span>` — uses the `.status.published` variant which maps to `background: var(--md-sys-color-primary-container)` (`#4A2F00`), `color: var(--md-sys-color-on-primary-container)` (`#FFDAA8`). The class name `published` is reused from the Tutorials skeleton's status taxonomy — visually it's the "good / live" pill.
- Invited: `<span class="status ">Invited</span>` — bare `.status` (no modifier), defaults to `background: #2A3970`, `color: #D8E2FF` (the periwinkle pill).
- Other statuses to support in production: `Suspended` (use `.status.error` → error-container `#93000A` + `#FFDAD6`), `Disabled` (greyer).

#### 4.8 Row actions cell
- `<md-icon-button><md-icon>more_vert</md-icon></md-icon-button>`.
- Opens a row-level menu: `Change role…`, `Resend invite`, `Suspend`, `Delete`.

### Status dot (mentioned in task brief)
- The task brief mentions a **status dot**. The skeleton renders the status entirely via the `.status` pill — there is no separate colored dot. If the live app draws a `●` dot prefix inside the pill (as a `::before` glyph), document it; otherwise the pill itself is the status indicator.

### Material Web components
- `md-chip-set`, `md-assist-chip`, `md-icon`, `md-icon-button`.

### Responsive
- **1100 px:** `.card.table-wrap` activates horizontal scroll (table has `min-width: 860px`).
- **720 px:** same — the table scrolls horizontally inside the 16 px-radius card.

### Checks
- [ ] Table has exactly eight columns in this order: Avatar, Name, Email, Provider, Role, Last seen, Status, row actions.
- [ ] Header row uses uppercase **11 px / weight 600 / letter-spacing 0.08em** labels on the `#0A1428` background.
- [ ] Four rows present with verbatim content (names, emails, providers, roles, last seen, statuses) — see the table above.
- [ ] Avatar cell uses `.avatar-sm` (32 × 32 periwinkle circle, 12 px / weight 700 initials) — **not** the orange 36 × 36 top-bar avatar.
- [ ] Name cell links to `/admin/users/:id` (in the live app).
- [ ] Provider cell uses `.pill` (periwinkle); both `Microsoft` and `GitHub` use the same pill style.
- [ ] Role cell wraps an `md-assist-chip` (display-only) inside an `md-chip-set`. Labels are exactly `sysadmin`, `editor`, `viewer` — lowercase, no prefix glyph.
- [ ] Quinntyne Brown is `sysadmin` (only one in the skeleton; verify the summary `5 sysadmins` is consistent with the bound dataset).
- [ ] Last seen values are humanized relative times.
- [ ] Status cell uses `.status.published` for `Active` (orange-container warm pill), bare `.status` for `Invited` (periwinkle pill). No `.status.error` row in the skeleton, but the component must support it for future suspended/disabled rows.
- [ ] Row actions column has an `md-icon-button` with `more_vert` glyph that opens a row menu.
- [ ] Last row (Sam Lee) has no bottom border on its `td`s (hidden by `tr:last-child td`).
- [ ] At 720 px the card scrolls horizontally inside its 16 px-radius container without clipping the scrollbar.
- [ ] **Live components:** `frontend/projects/domain/src/lib/admin/users/admin-users-table` composes `admin-user-row` rows. The role chip lives in `user-role-chips`. Confirm `user-role-chips` accepts a `role: 'sysadmin' | 'editor' | 'viewer'` input and renders the matching `md-assist-chip` label.

---

## 5. Page-level visual checks (global)

- [ ] **`:root` MD3 tokens** match `admin-tutorial-dialog.html` verbatim.
- [ ] **Body background** is solid `#00000F` (near-black). No radial gradients.
- [ ] **`main.admin-main`** padding is `32px 40px 96px`, `max-width: 1480px`.
- [ ] **Card radius** is 16 px on the table card; the card clips the horizontal scrollbar gracefully.
- [ ] **No custom-element console warnings** — `<ps-admin-users>` must resolve.
- [ ] **Material Web modules** load from the importmap.
- [ ] **Fonts loaded** — `Roboto Flex`, `Mona Sans`, `Material Symbols Outlined`. The Material Symbols font must be loaded for the `more_vert` and `person_add` glyphs.
- [ ] **No prod data leak** — emails in the screenshot are placeholders (`@example.com`). In production this page exposes real PII to sysadmins only; confirm the route is sysadmin-gated, not editor-accessible.

---

## 6. Bug logging procedure

For every failed check above:

1. Open [`bugs/admin-users.md`](../../bugs/admin-users.md).
2. Append a new entry using the `USERS-NNN` prefix.
3. Include:
   - The section + check that failed.
   - Expected value (copy from this doc; for skeleton text, copy verbatim).
   - Actual value (from the running app).
   - Suggested fix location (component path).
4. Once fixed, append the commit SHA and mark `resolved`.

## 7. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Active nav rail item highlights wrong page | `routerLinkActive` config on `admin-nav-rail.html` — match `/admin/users` |
| Editor or viewer can access `/admin/users` | tighten the route guard to require `sysadmin` claim |
| H1 not exactly `Users and roles` | `admin-users-page.html` page header |
| Summary counts hardcoded | bind `{{ userCount }}` and `{{ sysadminCount }}` via the users facade |
| Invite button missing leading `person_add` icon | `admin-users-page.html` — `<md-icon slot="icon">person_add</md-icon>` |
| Invite opens wrong dialog | route to `admin-user-invite-dialog` |
| Table column order wrong | `admin-users-table.html` |
| Avatar cell renders 36 px orange circle (top-bar style) | use `.avatar-sm` (32 px periwinkle) in `admin-user-row.html` |
| Provider pill colored per-provider | strip per-provider classes; use default `.pill` (periwinkle) for all |
| Role rendered as plain text instead of chip | `user-role-chips.html` — wrap `md-assist-chip` inside `md-chip-set` |
| Role chip selectable (filter-chip) | switch to `md-assist-chip` (display-only) |
| Status `Active` rendered as periwinkle pill | apply `.status.published` for active rows |
| Last seen showing ISO timestamp | apply a `relativeTime` pipe |
| Row menu missing | wire `(click)` on `md-icon-button[more_vert]` to an action menu service |
| Table not horizontally scrollable on mobile | wrap in `.table-wrap { overflow-x: auto }` and set `min-width: 860px` on `.data-table` |
| Color token drift | `frontend/projects/tokens/_md3-tokens.scss` |

---

## Audit Status

- **Status:** complete
- **Completed:** 2026-05-15
- **Resolved bugs:** `docs/bugs/ADMIN-USERS-001-users-composition.md`
- **Verification:** `npx ng build domain --configuration development`; `npm run build -- --configuration development`
- **Screenshots:** `docs/ui-audit/screenshots/admin-users/admin-users-desktop.png`; `docs/ui-audit/screenshots/admin-users/admin-users-tablet.png`; `docs/ui-audit/screenshots/admin-users/admin-users-mobile.png`
