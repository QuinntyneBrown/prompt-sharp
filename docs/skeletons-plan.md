# Skeleton Build-Out Plan

A plan to produce the remaining HTML skeletons in `docs/skeletons/` for every screen listed in `docs/screens.md`, plus every dialog and notification the app will need. Each skeleton is a single self-contained `.html` file under `docs/skeletons/`, matching one of the two existing patterns described below.

---

## 1. Patterns to maintain

Two patterns are already in use. **Do not invent a third.** Every new file must pick exactly one, based on which surface it belongs to.

### Pattern A — Public / marketing / auth ("ps-shell")
Reference files: `home.html`, `catalog.html`, `signin.html`.

- Typography: `Mona Sans` (variable, wdth 75–125, wght 200–900) + `IBM Plex Mono` for eyebrows / labels / mono metadata. No serif.
- Palette: `--bg #00000F`, `--surface #002A54`, `--rule #003E80`, `--ink #FBFFFF`, `--accent #FF9800`, `--accent-2 #8AA8FF`, etc. (copy the `:root` block from `home.html` verbatim).
- Structure: autonomous custom elements per MDN's "Using custom elements".
  - `<ps-*>` sections use **light DOM** so the page stylesheet styles them.
  - `<sk-*>` skeleton primitives (`sk-line`, `sk-tile`, `sk-circle`) use **shadow DOM** with the shared `SHIMMER_SHEET` constructable stylesheet. Reuse these — don't redefine.
- Wordmark: condensed-sans + italic accent-orange slash (`Prompt<span class="slash">/</span>Sharp`). The "foot-mark" recipe in `home.html` is the canonical large variant.
- Sticky `<ps-nav>` outside `<ps-shell>` so the bottom rule bleeds full viewport.
- Responsive breakpoints at 1100px and 720px (same as `home.html`).

### Pattern B — Admin (Material 3 Web)
Reference files: `admin-dashboard.html`, `admin-tutorial-list.html`, `admin-tutorial-dialog.html`.

- Typography: `Roboto Flex` (MD3 default) + `Mona Sans` reserved for display headlines + `Material Symbols Outlined` for icons.
- Components: `@material/web` via the importmap pattern already in those files — `md-dialog`, `md-text-button`, `md-filled-button`, `md-outlined-text-field`, `md-list`, `md-icon-button`, `md-chip-set`, etc.
- MD3 system color tokens are mapped onto the **same** palette as Pattern A (orange primary, periwinkle secondary, deep navy surfaces). Copy the `:root` block from `admin-tutorial-dialog.html` verbatim.
- Admin chrome: left nav rail + top app bar. Lift the layout from `admin-dashboard.html`; do not redesign it.

### Skeleton-state convention (both patterns)
Skeletons here show the **loading state** of every screen — that's the whole point of the folder. Treat content blocks as shimmer placeholders (`sk-tile`, `sk-line`) by default, with just enough real text (titles, eyebrows, chip labels) to make the layout legible. Keep dialogs filled with realistic data because dialogs in production typically open already-populated.

---

## 2. Inventory — what's done, what's missing

Existing (6): `home.html`, `catalog.html`, `signin.html`, `admin-dashboard.html`, `admin-tutorial-list.html`, `admin-tutorial-dialog.html`.

Derived from `docs/screens.md`, the remaining **screens** to skeleton:

| # | File                              | Screen                          | Pattern |
|---|-----------------------------------|---------------------------------|---------|
| 1 | `tutorial-detail.html`            | Tutorial Detail (core read UX)  | A |
| 2 | `category.html`                   | Category / Tag page             | A |
| 3 | `search-results.html`             | Search results                  | A |
| 4 | `about.html`                      | About / Contact                 | A |
| 5 | `error-404.html`                  | 404 / generic error             | A |
| 6 | `oauth-callback.html`             | OAuth callback / consent        | A |
| 7 | `access-denied.html`              | Access denied (RBAC)            | A |
| 8 | `profile.html`                    | My Profile                      | A |
| 9 | `progress.html`                   | Progress / Bookmarks            | A |
| 10 | `admin-tutorial-editor.html`     | Tutorial Editor (+ inline step editor) | B |
| 11 | `admin-categories.html`          | Category / Tag management       | B |
| 12 | `admin-media.html`               | Media library                   | B |
| 13 | `admin-users.html`               | User & Role management          | B |
| 14 | `admin-audit-log.html`           | Audit log                       | B |

And the **dialogs / notifications** the app needs (all Pattern B except where noted — dialogs in Pattern A surfaces still use `<md-dialog>` overlaid on a Pattern-A backdrop, matching how `admin-tutorial-dialog.html` overlays its list):

| # | File                                  | Surface                                     | Pattern |
|---|---------------------------------------|---------------------------------------------|---------|
| 15 | `admin-confirm-delete-dialog.html`   | Generic destructive confirmation            | B |
| 16 | `admin-publish-dialog.html`          | Publish / unpublish tutorial                | B |
| 17 | `admin-category-dialog.html`         | Create/edit category or tag                 | B |
| 18 | `admin-media-upload-dialog.html`     | Media upload (drag-drop + progress)         | B |
| 19 | `admin-user-invite-dialog.html`      | Invite user / assign role                   | B |
| 20 | `admin-unsaved-changes-dialog.html`  | Discard unsaved edits in editor             | B |
| 21 | `signout-dialog.html`                | Confirm sign out (over Pattern A page)      | B |
| 22 | `session-expired-dialog.html`        | Session/token expired → re-auth             | B |
| 23 | `oauth-consent-dialog.html`          | OAuth scope consent (provider-style)        | A |
| 24 | `notifications.html`                 | Snackbars + banners gallery (success/error/info/warning, single-line + with-action, plus top-of-page system banner) | B |

The notifications file is a **gallery**, not a screen — every toast/snackbar/banner variant on one page so the visual contract is reviewable in one place. Pattern B because `md-snackbar` is part of `@material/web`.

---

## 3. Per-file content specs

Only the parts that vary from the reference files are spelled out. Everything else (head, fonts, palette, nav chrome) is copied from the closest existing reference.

### Public / auth screens (Pattern A)

1. **`tutorial-detail.html`** — Reading layout.
   - Sections: `<ps-nav>`, `<ps-shell>` containing `<ps-crumbs>`, `<ps-tutorial-hero>` (title, eyebrow "TUTORIAL № 412", chip row, byline, hero image as `sk-tile`), `<ps-tutorial-toc>` (sticky left rail with numbered step list), `<ps-tutorial-body>` (alternating prose `sk-line` blocks + code-block placeholders with mono caption), `<ps-tutorial-nav>` (prev / next step), `<ps-related>`, `<ps-footer>`.
   - Code-block placeholder = surface-2 box, `sk-line` rows, top-right `Copy` chip.
2. **`category.html`** — Almost identical to `catalog.html` but with one big `<ps-category-hero>` block on top (eyebrow "CATEGORY", display title with italic accent, count + difficulty mix mono row) and the existing card grid below. Reuse `catalog.html`'s grid component.
3. **`search-results.html`** — Reuse `catalog.html` shell. Replace hero with `<ps-search-bar>` (large input with mono `query =` prefix) and a `<ps-search-meta>` row ("412 results · sorted by relevance"). Results list reuses the `.latest-list` row component from `home.html`.
4. **`about.html`** — Single-column long-form. `<ps-about-hero>` (display headline, lede), `<ps-about-body>` (two-column prose / mono call-outs), `<ps-contact-card>` (mono address block + form with three `sk-line` inputs).
5. **`error-404.html`** — Minimal: `<ps-nav>` + centered block. Giant display "404 / not <em>found</em>", mono path readout, two CTAs ("Browse tutorials", "Home"). Use the marquee strip from `home.html` at the bottom for texture.
6. **`oauth-callback.html`** — Centered card. Eyebrow "AUTHENTICATING…", spinning dot or shimmer chip, mono `Provider: Microsoft` + `Returning to: /admin`, single ghost button "Cancel". This is the in-between state — show the shimmer prominently.
7. **`access-denied.html`** — Same shell as `error-404.html` but accent-red treatment on display (use `--md-sys-color-error #FFB4AB` for the italic accent). Headline "Access <em>denied</em>", mono "Role required: <kbd>sysadmin</kbd>", CTAs "Request access" + "Home".
8. **`profile.html`** — Two-column. Left: avatar `sk-circle` + name + provider chip + mono ID. Right: stacked `<ps-profile-section>` cards (Email, Linked accounts, Roles, Notifications) each with two-row label/value rule lines.
9. **`progress.html`** — Reuse `home.html`'s `.latest-list` row but add a left meter (% complete bar made from `sk-line` plus accent fill) and group rows under two `<header class="sect-head">` blocks: "In progress" and "Bookmarked".

### Admin screens (Pattern B)

10. **`admin-tutorial-editor.html`** — Three-pane.
    - Left: `<md-list>` step outline (drag handles, numbered, "+ Add step" at bottom).
    - Center: active step editor — title `md-outlined-text-field`, then a stack of block editors (prose / code / image / callout). Step editor lives **inline** in this file; `screens.md` notes it could be inline, so don't make a separate file.
    - Right: metadata panel (slug, category chips via `md-chip-set`, difficulty segmented buttons, save state mono readout).
    - Top app bar from `admin-dashboard.html` with `Save draft` + `Publish…` buttons (the latter opens `admin-publish-dialog.html`).
11. **`admin-categories.html`** — Two-tab admin page (`md-tabs`: "Categories" / "Tags"). Table mirrors `admin-tutorial-list.html` structure: row icon, name, slug, tutorial count, last edited, row actions. "+ New category" FAB opens `admin-category-dialog.html`.
12. **`admin-media.html`** — Grid of `sk-tile` cards with filename + size + mono dimensions caption. Left filter rail (Type, Used in, Uploader). Top app bar action "Upload" opens `admin-media-upload-dialog.html`. Selection mode shows a bottom bar with bulk actions.
13. **`admin-users.html`** — Same table chrome as `admin-tutorial-list.html`. Columns: avatar `sk-circle`, name, email, provider chip, role (`md-chip-set` with `sysadmin` / `editor` / `viewer`), last seen, status dot, row menu. "+ Invite" opens `admin-user-invite-dialog.html`.
14. **`admin-audit-log.html`** — Read-only table. Columns: timestamp (mono), actor, action verb, target type, target id, IP, expand caret. Expanded row reveals a diff block (`sk-line` rows). Right rail has date-range picker + actor filter + action-type checkboxes.

### Dialogs (Pattern B unless noted)

All dialogs use `<md-dialog open>` pinned over a dimmed copy of the relevant parent page — match the way `admin-tutorial-dialog.html` overlays `admin-tutorial-list.html` so the snapshot reads as a real moment in the flow.

15. **`admin-confirm-delete-dialog.html`** — Headline "Delete tutorial?", body paragraph with name in `<strong>`, secondary mono line "This cannot be undone.", actions `Cancel` (text) + `Delete` (filled, error color). Show overlaid on `admin-tutorial-list.html`.
16. **`admin-publish-dialog.html`** — Headline "Publish tutorial". Body: status pill (Draft → Published), schedule radio (`Now` / `Scheduled`), datetime field (disabled until Scheduled selected), visibility segmented (Public / Members). Actions `Cancel` + `Publish`.
17. **`admin-category-dialog.html`** — Headline "New category" / "Edit category". Fields: name, slug (auto-derived, mono helper text), description (multiline), color swatch picker (8-tile row), icon picker (`md-icon-button` row of Material Symbols). Actions `Cancel` + `Create` / `Save`.
18. **`admin-media-upload-dialog.html`** — Dashed-border drop zone, list of in-progress uploads with `md-linear-progress`, retry / cancel `md-icon-button` per row. Filename + size + mono `image/png · 1920×1080`. Actions `Close` + `Upload more`.
19. **`admin-user-invite-dialog.html`** — Headline "Invite user". Fields: email, role select (`md-select` with the three roles), optional message multiline. Body footer mono note: "Invitation expires in 7 days." Actions `Cancel` + `Send invite`.
20. **`admin-unsaved-changes-dialog.html`** — Headline "Unsaved changes". Body: list of dirty fields as mono diff lines (e.g. `~ title`, `+ step 14`). Actions `Discard`, `Keep editing`, `Save and close`. Overlaid on `admin-tutorial-editor.html`.
21. **`signout-dialog.html`** — Overlaid on `home.html`. Small dialog: "Sign out of Prompt/Sharp?", actions `Cancel` + `Sign out`. Use this to validate the Pattern B dialog reads correctly when the backdrop is Pattern A — both palettes share the same hex values so the contrast should hold.
22. **`session-expired-dialog.html`** — Modal (non-dismissable scrim). Headline "Session expired", body explanatory line, single primary action `Sign in again`. Overlaid on `admin-dashboard.html` (dimmed + slightly blurred).
23. **`oauth-consent-dialog.html`** — **Pattern A**, not B — this mimics the provider's own consent page when wired in-product. Centered card on the auth shell: app logo (foot-mark), "Prompt/Sharp wants to access your Microsoft account", scope list with `sk-line` placeholders, `Allow` (solid accent button) + `Deny` (ghost button).
24. **`notifications.html`** — Gallery, not a screen. Three columns of `md-snackbar` variants (success / error / info / warning, with and without action button, single-line and two-line), plus two top-page banners (system-wide warning, system-wide info) at the top of the page. Each variant is annotated with a mono caption ("snackbar / success / with-action") so the file works as a contract sheet for the frontend implementation.

---

## 4. Build order

Order chosen so each new file extends the smallest set of new components. After every group, take a screenshot pass so deviations from the references are caught early.

**Wave 1 — public completion (Pattern A primitives only)**
1. `error-404.html`
2. `access-denied.html`
3. `oauth-callback.html`
4. `about.html`
5. `search-results.html`
6. `category.html`

**Wave 2 — authenticated user**
7. `profile.html`
8. `progress.html`

**Wave 3 — the core read experience**
9. `tutorial-detail.html` — biggest Pattern A page; introduces the TOC rail, code-block placeholder, and step navigation. Doing this after Wave 1/2 means those primitives are reusable from earlier files instead of invented here.

**Wave 4 — admin screens**
10. `admin-tutorial-editor.html` (largest admin surface — three-pane shell becomes reusable)
11. `admin-categories.html`
12. `admin-users.html`
13. `admin-media.html`
14. `admin-audit-log.html`

**Wave 5 — dialogs & notifications**
15. `admin-confirm-delete-dialog.html`
16. `admin-publish-dialog.html`
17. `admin-category-dialog.html`
18. `admin-user-invite-dialog.html`
19. `admin-media-upload-dialog.html`
20. `admin-unsaved-changes-dialog.html`
21. `session-expired-dialog.html`
22. `signout-dialog.html`
23. `oauth-consent-dialog.html`
24. `notifications.html`

---

## 5. Per-file checklist (apply to every new skeleton)

- [ ] `:root` block copied verbatim from the matching reference file (`home.html` for A, `admin-tutorial-dialog.html` for B). Palette hex values must not drift.
- [ ] Typography links match the pattern (Mona Sans + IBM Plex Mono for A; Roboto Flex + Mona Sans + Material Symbols for B).
- [ ] Wordmark uses the `Prompt<span class="slash">/</span>Sharp` recipe — condensed wdth + italic accent slash. The large foot-mark uses wdth 80 / wght 700.
- [ ] Nav (Pattern A) or app bar (Pattern B) lifted unchanged from the reference; only the active nav item differs.
- [ ] Skeleton primitives (`sk-line`, `sk-tile`, `sk-circle`) reused. Don't define new shimmer atoms in individual files.
- [ ] Light DOM for sections, shadow DOM for shimmer atoms — both with constructable stylesheets where the reference uses them.
- [ ] Responsive breakpoints at 1100px and 720px match `home.html`.
- [ ] Dialog files render the parent page underneath, dimmed via the existing scrim, so the snapshot is a real flow moment.
- [ ] The file opens cleanly in a browser with no console errors (custom-element registrations all present at the bottom).

---

## 6. Out of scope (don't do in this pass)

- Wiring any of this into the Angular workspace under `frontend/projects/`. These remain reference HTML in `docs/skeletons/` until a separate skill (`ui-audit` or the Angular implementation work) consumes them.
- Designing the production app in `.pen` files. If a `.pen` design system already exists for these screens, the audit phase (driven by `/ui-audit`) is the right tool — not this plan.
- Producing PNG / Figma exports. The skeletons themselves are the spec.
