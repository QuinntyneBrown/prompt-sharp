# UI Audit

Per-page and per-dialog UI audits comparing the running Angular app at `frontend/projects/promp-sharp` against the authoritative HTML skeletons in `docs/skeletons/`.

## Folder layout

```
docs/
├── bugs/                    ← one bug log per audit; cross-linked from each audit doc
└── ui-audit/
    ├── README.md            ← this file (process + index)
    ├── public/              ← unauthenticated pages and pre-auth dialogs
    └── protected/           ← signed-in pages and dialogs
```

## How to run an audit

1. **Start the app locally:**
   ```pwsh
   cd C:\projects\prompt-sharp\frontend
   npm start
   ```
   The app serves at `http://localhost:4200`. The API (`http://127.0.0.1:5000`) should also be running — see `backend/README.md`.

2. **Open the skeleton in a second browser tab** by double-clicking the matching HTML file in `docs/skeletons/` (e.g., `docs/skeletons/home.html`). Skeletons open directly without a server.

3. **Open the audit doc for that page** under `public/` or `protected/`.

4. **Walk the checklist top-to-bottom.** For each item, compare the live app against the skeleton at three viewport widths:
   - **Desktop:** ≥ 1440 px
   - **Tablet:** 1100 px (the first breakpoint in the skeletons)
   - **Mobile:** 720 px (the second breakpoint)

5. **For every gap found**, append an entry to the bug log linked at the top of the audit doc. Use this template:
   ```md
   ### BUG-<NNN>: <one-line summary>
   - **Audit doc:** `public/home.md` (section "Hero · CTA buttons")
   - **Expected (skeleton):** Solid orange button labeled `Browse tutorials →` with an arrow glyph; uppercase `IBM Plex Mono` 12px; `letter-spacing: 0.1em`; background `#FF9800`; text `#00000F`.
   - **Actual (app):** Button is white-bordered with `#FBFFFF` text; missing arrow; lowercase label.
   - **Fix location:** `frontend/projects/components/src/lib/button/button.scss` (solid variant), and ensure `frontend/projects/domain/src/lib/public/home-hero` binds `variant="solid"` and uses an arrow glyph.
   - **Status:** open
   ```
   Bug IDs are per-page (`HOME-001`, `CATALOG-001`, etc.) so each page's bug list is self-contained.

6. **Fix bugs** by editing components in `frontend/projects/components/` (atoms — button, chip, badge, etc.) or `frontend/projects/domain/` (compositions — home-hero, tutorial-card, etc.). Do not patch the page template inline — the audit fails if the same gap can recur on another page that consumes the same component.

7. **Re-run the audit** after each fix; mark the bug `resolved` with the commit SHA.

## What to check on every page

Every audit doc follows the same skeleton (pun intended):

1. **Route / surface** — URL to navigate to in the running app
2. **Skeleton source** — path to the `.html` file under `docs/skeletons/`
3. **Component composition** — every `<ps-*>` (or `<md-*>`) section, in DOM order
4. **Per-section checks** — for each section: text content, fonts (family + variation settings), spacing (padding, margin, gap), colors (background, foreground, border), positioning (grid / flex), responsive behavior at 1100 px and 720 px
5. **Atom-level checks** — buttons, chips, eyebrows, mono labels, skeleton primitives — colors, borders, weights, letter spacing
6. **Tokens** — verify any custom values match `frontend/projects/tokens/_*.scss`. Drift means either the tokens or the consumer is wrong.
7. **Bugs section** — link to `bugs/<page>.md`

## Color tokens (Pattern A — public + auth)

These hex values appear verbatim in `docs/skeletons/home.html:32-60` and must match `frontend/projects/tokens/_colors.scss`.

| Token         | Hex          | Role                                |
|---------------|--------------|-------------------------------------|
| `--bg`        | `#00000F`    | Page background (near-black)        |
| `--surface`   | `#002A54`    | Card/hero-card background           |
| `--surface-2` | `#003E80AA`  | Elevated surface (alpha 0xAA)       |
| `--rule`      | `#003E80`    | Borders / hairline rules            |
| `--rule-soft` | `#001A36`    | Faint inner borders                 |
| `--ink`       | `#FBFFFF`    | Primary text                        |
| `--ink-dim`   | `#C5CDE4`    | Secondary text                      |
| `--muted`     | `#6B7AAF`    | Eyebrow / metadata text             |
| `--hush`      | `#3A4880`    | Quietest text                       |
| `--accent`    | `#FF9800`    | Primary signal (orange)             |
| `--accent-2`  | `#8AA8FF`    | Secondary accent (periwinkle)       |
| `--gold`      | `#FFC85C`    | Intermediate difficulty badge       |
| `--moss`      | `#8AA8FF`    | Beginner difficulty badge           |

## Color tokens (Pattern B — admin / dialogs)

MD3 system tokens. Same palette, mapped to Material 3 roles. Source: `docs/skeletons/admin-tutorial-dialog.html` `:root` block.

## Typography (Pattern A)

| Family            | Use                                                   |
|-------------------|-------------------------------------------------------|
| `Mona Sans`       | Variable sans for display, body, titles. Width `wdth` 75–125, weight `wght` 200–900, italic. |
| `IBM Plex Mono`   | Eyebrows, mono labels, chip text, metadata.           |

Variation-settings recipes that recur across pages:
- **Foot-mark / hero brand:** `"wdth" 80, "wght" 700`
- **Display headline:** `"wdth" 75, "wght" 600` with italic `em` at `"wdth" 85, "wght" 500`
- **Section h2:** `"wdth" 78, "wght" 600`
- **Section h2 italic em:** `"wdth" 88, "wght" 500`
- **Stat number:** `"wdth" 80, "wght" 600`
- **Card h3:** `"wdth" 85–90, "wght" 550`
- **Row title:** `"wdth" 90, "wght" 550`

## Typography (Pattern B)

`Roboto Flex` (MD3 default) + `Mona Sans` reserved for display headlines + `Material Symbols Outlined` for icons.

## Index

### Public pages

| File | Skeleton | Route |
|------|----------|-------|
| [home.md](public/home.md) | `home.html` | `/` |
| [catalog.md](public/catalog.md) | `catalog.html` | `/tutorials` |
| [category.md](public/category.md) | `category.html` | `/categories/:slug` |
| [search-results.md](public/search-results.md) | `search-results.html` | `/search?q=...` |
| [tutorial-detail.md](public/tutorial-detail.md) | `tutorial-detail.html` | `/tutorials/:slug` |
| [about.md](public/about.md) | `about.html` | `/about` |
| [signin.md](public/signin.md) | `signin.html` | `/signin` |
| [oauth-callback.md](public/oauth-callback.md) | `oauth-callback.html` | `/auth/callback` |
| [oauth-consent-dialog.md](public/oauth-consent-dialog.md) | `oauth-consent-dialog.html` | overlay on `/signin` |
| [error-404.md](public/error-404.md) | `error-404.html` | unmatched route |
| [access-denied.md](public/access-denied.md) | `access-denied.html` | `/access-denied` |

### Protected pages

| File | Skeleton | Route |
|------|----------|-------|
| [profile.md](protected/profile.md) | `profile.html` | `/profile` |
| [progress.md](protected/progress.md) | `progress.html` | `/progress` |
| [notifications.md](protected/notifications.md) | `notifications.html` | `/notifications` (and `/admin/notifications`) |
| [admin-dashboard.md](protected/admin-dashboard.md) | `admin-dashboard.html` | `/admin` |
| [admin-tutorial-list.md](protected/admin-tutorial-list.md) | `admin-tutorial-list.html` | `/admin/tutorials` |
| [admin-tutorial-editor.md](protected/admin-tutorial-editor.md) | `admin-tutorial-editor.html` | `/admin/tutorials/:id/edit` |
| [admin-categories.md](protected/admin-categories.md) | `admin-categories.html` | `/admin/categories` |
| [admin-media.md](protected/admin-media.md) | `admin-media.html` | `/admin/media` |
| [admin-users.md](protected/admin-users.md) | `admin-users.html` | `/admin/users` |
| [admin-audit-log.md](protected/admin-audit-log.md) | `admin-audit-log.html` | `/admin/audit-log` |

### Protected dialogs

| File | Skeleton | Trigger |
|------|----------|---------|
| [admin-tutorial-dialog.md](protected/admin-tutorial-dialog.md) | `admin-tutorial-dialog.html` | "+ New tutorial" / row "Edit" on admin-tutorial-list |
| [admin-confirm-delete-dialog.md](protected/admin-confirm-delete-dialog.md) | `admin-confirm-delete-dialog.html` | row "Delete" action |
| [admin-publish-dialog.md](protected/admin-publish-dialog.md) | `admin-publish-dialog.html` | "Publish…" in editor |
| [admin-category-dialog.md](protected/admin-category-dialog.md) | `admin-category-dialog.html` | "+ New category" / row "Edit" on admin-categories |
| [admin-media-upload-dialog.md](protected/admin-media-upload-dialog.md) | `admin-media-upload-dialog.html` | "Upload" on admin-media |
| [admin-user-invite-dialog.md](protected/admin-user-invite-dialog.md) | `admin-user-invite-dialog.html` | "+ Invite" on admin-users |
| [admin-unsaved-changes-dialog.md](protected/admin-unsaved-changes-dialog.md) | `admin-unsaved-changes-dialog.html` | navigating away from dirty editor |
| [signout-dialog.md](protected/signout-dialog.md) | `signout-dialog.html` | "Sign out" in nav menu |
| [session-expired-dialog.md](protected/session-expired-dialog.md) | `session-expired-dialog.html` | 401 from API after session expiry |
