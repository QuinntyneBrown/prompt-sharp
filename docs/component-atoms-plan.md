# Component Atoms Implementation Plan

This plan covers the atoms extracted from the public and admin skeleton pages and dialogs in `docs/skeletons/`. The implementation target is the Angular component library at `frontend/projects/components`.

The existing `docs/skeletons-plan.md` is a plan for producing the standalone HTML skeleton files. This document is the follow-up plan for implementing the reusable Angular atoms those skeletons imply.

## Success Criteria

- Every true atom used by the public and admin skeleton pages/dialogs is either mapped to an existing component or assigned a target component directory under `frontend/projects/components/src/lib`.
- Page, section, and feature-level skeleton elements are explicitly excluded from the atom library so the components project does not become a page-layout dumping ground.
- Existing atoms are preserved and extended where practical instead of duplicated.
- New atoms follow the current library conventions: Angular components, `ChangeDetectionStrategy.OnPush`, signal `input()`, external HTML/SCSS files, SCSS tokens from `frontend/projects/tokens`, and exports from `frontend/projects/components/src/public-api.ts`.
- The implementation plan includes validation gates for build, exports, accessibility, and skeleton parity.

## Source Inventory

Skeleton source files reviewed: all 30 files under `docs/skeletons/`.

Public/auth skeletons:

- `home.html`
- `catalog.html`
- `signin.html`
- `tutorial-detail.html`
- `category.html`
- `search-results.html`
- `about.html`
- `error-404.html`
- `oauth-callback.html`
- `oauth-consent-dialog.html`
- `access-denied.html`
- `profile.html`
- `progress.html`
- `signout-dialog.html`

Admin skeletons and dialogs:

- `admin-dashboard.html`
- `admin-tutorial-list.html`
- `admin-tutorial-dialog.html`
- `admin-tutorial-editor.html`
- `admin-categories.html`
- `admin-category-dialog.html`
- `admin-media.html`
- `admin-media-upload-dialog.html`
- `admin-users.html`
- `admin-user-invite-dialog.html`
- `admin-audit-log.html`
- `admin-confirm-delete-dialog.html`
- `admin-publish-dialog.html`
- `admin-unsaved-changes-dialog.html`
- `session-expired-dialog.html`
- `notifications.html`

Existing component atoms in `frontend/projects/components/src/lib`:

- `button`
- `chip`
- `difficulty-badge`
- `eyebrow`
- `glyph`
- `mono`
- `rule`
- `skeleton-circle`
- `skeleton-line`
- `skeleton-tile`
- `stat`
- `wordmark`

## Atom Boundary

Implement these in `frontend/projects/components`:

- Atomic typography, status, media, form, feedback, and action primitives.
- Small wrappers around one semantic control or visual primitive.
- Components that can be used unchanged in both public and admin surfaces by theme inputs or CSS custom properties.

Do not implement these as atoms:

- `ps-shell`, `ps-nav`, `ps-footer`, `ps-admin-shell`, `ps-admin-nav-rail`, `ps-admin-topbar`.
- Page sections such as `ps-hero`, `ps-catalog-grid`, `ps-admin-tutorial-editor`, `ps-profile-section`, `ps-progress-list`.
- Full dialogs such as `ps-publish-dialog` or `ps-user-invite-dialog`.
- Full tables, cards composed of business data, page rails, and feature workflows.

Those belong in app features or a later molecules/layout library. The atoms library should supply the primitives those higher-level surfaces compose.

## Dependency Decision

The admin skeletons use Material Web tags (`md-dialog`, `md-outlined-text-field`, `md-chip-set`, `md-snackbar`, etc.), but `frontend/projects/components/package.json` currently has no `@material/web` dependency. Implement Prompt/Sharp-owned Angular atoms styled to the same MD3-inspired token contract rather than importing Material Web into the shared components library.

If the app later decides to consume Material Web directly, these atoms can become thin facades or be skipped in favor of app-level adapters. Until then, the components project remains dependency-light.

## Existing Atom Upgrades

| Atom | Current path | Skeleton evidence | Planned work |
|---|---|---|---|
| Button | `src/lib/button` | `.btn`, `.solid`, `.ghost`, `.danger-button`, `md-filled-button`, `md-text-button`, `md-outlined-button` | Extend variants to `solid`, `outline`, `ghost`, `text`, `danger`; add `size`, `iconStart`, `iconEnd`, `loading`, full-width option, and aria passthrough. |
| Chip | `src/lib/chip` | `.chip`, `.filter-chip`, `.pill`, `md-filter-chip`, `md-assist-chip`, `md-suggestion-chip`, `md-input-chip` | Extend variants to `default`, `accent`, `filter`, `assist`, `input`, `status`, `danger`; add selected/removable/disabled states. |
| Difficulty badge | `src/lib/difficulty-badge` | difficulty chips in catalog/tutorial/detail/editor | Keep as domain-specific atom; ensure it composes `Chip` styles and supports compact/table density. |
| Eyebrow | `src/lib/eyebrow` | `.eyebrow` across public pages and admin headers | Add tone input (`default`, `accent`, `muted`, `danger`) and optional inline icon. |
| Glyph | `src/lib/glyph` | `.glyph`, `md-icon`, `.ico` | Convert to a general icon atom with Material Symbols name input, decorative/labelled modes, and size/tone inputs. |
| Mono | `src/lib/mono` | `.mono`, timestamps, ids, metadata, code captions | Add size/tone inputs and optional `as` input if different semantic wrappers are needed. |
| Rule | `src/lib/rule` | `.rule`, `md-divider`, panel dividers | Add vertical orientation and inset variants. |
| Skeleton line | `src/lib/skeleton-line` | `sk-line`, prose placeholders, code rows, form placeholders | Add roundedness, tone, inline/block mode, and width as CSS length or percent. |
| Skeleton tile | `src/lib/skeleton-tile` | `sk-tile`, media thumbs, hero art, cards | Add aspect ratio input, radius input, and optional overlay slot. |
| Skeleton circle | `src/lib/skeleton-circle` | `sk-circle`, avatars | Add size presets matching avatar sizes. |
| Stat | `src/lib/stat` | `.stat`, `.kpi-card`, admin metrics | Add trend/tone/supporting label inputs; keep simple enough for cards to compose. |
| Wordmark | `src/lib/wordmark` | Prompt/Sharp nav, foot-mark, auth logo | Add `variant="inline|foot"` and preserve the orange italic slash. |

## New Atoms To Add

### Typography and Metadata

| Atom | Target path | Skeleton evidence | API sketch |
|---|---|---|---|
| Display text | `src/lib/display-text` | `.display`, `.giant`, page hero headlines | `level`, `tone`, `italicAccent` inputs; projected text. |
| Label value | `src/lib/label-value` | `.label-value`, profile fields, dialog metadata | `label`, `value`, `orientation`, optional projected value. |
| Breadcrumb | `src/lib/breadcrumb` | `.breadcrumb`, `ps-crumbs` | A single breadcrumb item/link atom; page-level breadcrumb list composes it. |
| Code caption | `src/lib/code-caption` | code block labels, mono captions | Small mono label row with optional copy action slot. |

### Status and Data Markers

| Atom | Target path | Skeleton evidence | API sketch |
|---|---|---|---|
| Badge | `src/lib/badge` | `.badge`, `.published`, role badges | `tone`, `size`, `icon`, projected label. |
| Status dot | `src/lib/status-dot` | `.dot`, status rows, snackbar tones | `tone`, `pulse`, accessible label. |
| Avatar | `src/lib/avatar` | `.avatar`, `.avatar-sm`, `.avatar-lg`, `sk-circle` usage | `name`, `src`, `size`, `status`, fallback initials. |
| Meter | `src/lib/meter` | `.meter`, progress page, upload/progress indicators | `value`, `max`, `tone`, `label`, indeterminate mode. |
| Swatch | `src/lib/swatch` | `.swatch`, category dialog color picker | `color`, `selected`, `label`. |

### Actions and Navigation Primitives

| Atom | Target path | Skeleton evidence | API sketch |
|---|---|---|---|
| Icon button | `src/lib/icon-button` | `md-icon-button`, row actions, close buttons | `icon`, `label`, `variant`, `size`, `disabled`, `pressed`. |
| FAB | `src/lib/fab` | `md-fab`, admin create/upload actions | `icon`, `label`, `variant`, `extended`. |
| Pagination button | `src/lib/pagination-button` | `.page-btn`, `.page-arrows` | `active`, `disabled`, `ariaLabel`; can wrap `Button` styles. |
| Nav item | `src/lib/nav-item` | `.nav-item`, `.nav-label`, admin rail/public nav links | `icon`, `label`, `active`, `href`, `collapsed`; use in later nav molecules. |

### Form and Control Atoms

| Atom | Target path | Skeleton evidence | API sketch |
|---|---|---|---|
| Text field | `src/lib/text-field` | `ps-field`, `md-outlined-text-field`, `.search-field` | `label`, `value`, `placeholder`, `type`, `prefix`, `suffix`, `error`, `disabled`, `readonly`. |
| Text area | `src/lib/text-area` | multiline dialog/editor fields | `label`, `value`, `rows`, `error`, `disabled`. |
| Select field | `src/lib/select-field` | `md-outlined-select`, role/category selects | `label`, options input, value, error, disabled. |
| Checkbox | `src/lib/checkbox` | `md-checkbox`, audit filters, table selection | `checked`, `indeterminate`, `label`, disabled. |
| Radio | `src/lib/radio` | `md-radio`, publish scheduling | `checked`, `name`, `value`, `label`, disabled. |
| Switch | `src/lib/switch` | `md-switch`, publish/feature toggles | `checked`, `label`, disabled. |
| Segmented control | `src/lib/segmented-control` | difficulty/visibility/view toggles | options input, selected value, density. |
| Tabs | `src/lib/tabs` | `md-tabs`, categories/tags admin page | tab item atom or simple tab-list atom with selected value. |
| Search field | `src/lib/search-field` | `ps-search-bar`, admin filters | Composition-friendly wrapper around `TextField` with search icon and clear action. |

### Feedback and Overlay Primitives

| Atom | Target path | Skeleton evidence | API sketch |
|---|---|---|---|
| Dialog shell | `src/lib/dialog-shell` | `md-dialog`, all dialog skeletons | Open state, headline, supporting text, modal/non-modal mode, action slots. Specific dialogs remain outside atom scope. |
| Snackbar | `src/lib/snackbar` | `md-snackbar`, `notifications.html` | `tone`, `message`, `actionLabel`, open/timeout inputs. |
| Banner | `src/lib/banner` | `.banner`, notifications gallery | `tone`, `icon`, projected content, action slot. |
| Empty state | `src/lib/empty-state` | 404/access-denied/oauth stages | Icon/display/description/action slots; use sparingly as an atom-level primitive. |
| Spinner dot | `src/lib/spinner-dot` | `.spin-dot`, oauth callback | `size`, `tone`, accessible label. |

### Media and Surface Primitives

| Atom | Target path | Skeleton evidence | API sketch |
|---|---|---|---|
| Thumbnail | `src/lib/thumbnail` | `.thumb`, `.thumb-wrap`, media grid | `src`, `alt`, `ratio`, `selected`, fallback skeleton. |
| Surface | `src/lib/surface` | `.card`, `.panel`, `.table-card`, `.center-card` | Lightweight wrapper with tone/radius/padding inputs. Higher-level cards compose it. |
| Drop zone | `src/lib/drop-zone` | `.drop-zone`, media upload dialog | `accept`, `multiple`, disabled, drag-active state. |

## Public vs Admin Theme Coverage

The skeletons define two visual modes:

- Public/auth mode: deep navy surface, orange accent, Mona Sans + IBM Plex Mono.
- Admin mode: MD3-inspired controls mapped to the same palette, Roboto Flex + Mona Sans + Material Symbols.

Implementation approach:

1. Keep component SCSS token-driven, not hard-coded to page colors.
2. Add tone inputs for semantic color changes (`default`, `accent`, `muted`, `danger`, `success`, `warning`, `info`).
3. Let app shells provide font loading and root CSS variables.
4. Avoid page-specific margins/widths inside atoms.

## File and Export Pattern

Each new atom should use this shape:

```text
frontend/projects/components/src/lib/<atom-name>/
  <atom-name>.ts
  <atom-name>.html
  <atom-name>.scss
  <atom-name>.spec.ts
```

Then export it from:

```text
frontend/projects/components/src/public-api.ts
```

Naming rules:

- Folder/file names: kebab-case.
- Class names: PascalCase without the `Component` suffix, matching existing atoms (`Button`, `Chip`, `Wordmark`).
- Selectors: current library uses `lib-*`; keep that convention unless the whole library is renamed in a separate migration.

## Implementation Waves

### Wave 1 - Harden Existing Public Atoms

Goal: make the existing atom set capable of replacing the public skeleton primitives without introducing duplicates.

Work:

- Extend `Button`, `Chip`, `Eyebrow`, `Glyph`, `Mono`, `Rule`, `Stat`, `Wordmark`.
- Extend `SkeletonLine`, `SkeletonTile`, `SkeletonCircle`.
- Add tests for input defaults and host attributes.
- Confirm `ng build components` still passes.

Skeleton coverage unlocked:

- `home.html`
- `catalog.html`
- `category.html`
- `search-results.html`
- `tutorial-detail.html`
- `about.html`
- `profile.html`
- `progress.html`
- `oauth-callback.html`

### Wave 2 - Add Typography, Status, and Media Atoms

Goal: cover repeated visual primitives that appear across public and admin screens.

Add:

- `display-text`
- `label-value`
- `breadcrumb`
- `code-caption`
- `badge`
- `status-dot`
- `avatar`
- `meter`
- `swatch`
- `thumbnail`
- `surface`
- `spinner-dot`

Skeleton coverage unlocked:

- Public error/auth stages.
- Profile identity panel.
- Progress rows.
- Admin tables and media grids.
- Dialog metadata rows.

### Wave 3 - Add Form and Control Atoms

Goal: provide the common control primitives implied by Pattern A auth/search pages and Pattern B admin pages.

Add:

- `text-field`
- `text-area`
- `select-field`
- `checkbox`
- `radio`
- `switch`
- `segmented-control`
- `tabs`
- `search-field`

Skeleton coverage unlocked:

- `signin.html`
- `oauth-consent-dialog.html`
- `admin-tutorial-dialog.html`
- `admin-tutorial-editor.html`
- `admin-category-dialog.html`
- `admin-user-invite-dialog.html`
- `admin-publish-dialog.html`
- `admin-audit-log.html`

### Wave 4 - Add Action, Feedback, and Overlay Atoms

Goal: cover the primitives used by dialogs, notifications, and dense admin actions.

Add:

- `icon-button`
- `fab`
- `pagination-button`
- `nav-item`
- `dialog-shell`
- `snackbar`
- `banner`
- `empty-state`
- `drop-zone`

Skeleton coverage unlocked:

- All admin dialogs.
- `notifications.html`.
- Public signout/session flows.
- Admin rail/topbar composition by future layout components.

### Wave 5 - Consolidation and Documentation

Goal: make the components library consumable by app feature teams.

Work:

- Update `frontend/projects/components/README.md` with atom categories and examples.
- Ensure every atom is exported from `src/public-api.ts`.
- Add a small usage matrix that maps skeleton files to atom coverage.
- Remove any duplicate styling that should live in `frontend/projects/tokens`.
- Run final build and test gates.

## Skeleton-to-Atom Coverage Matrix

| Skeleton group | Atom coverage needed |
|---|---|
| Public nav/home/catalog/category/search | `wordmark`, `button`, `chip`, `eyebrow`, `skeleton-*`, `stat`, `display-text`, `surface`, `pagination-button`, `search-field` |
| Tutorial detail | `breadcrumb`, `display-text`, `chip`, `difficulty-badge`, `skeleton-*`, `code-caption`, `button`, `surface`, `nav-item` |
| Auth/error/access pages | `wordmark`, `display-text`, `button`, `empty-state`, `spinner-dot`, `text-field`, `skeleton-*` |
| Profile/progress | `avatar`, `label-value`, `badge`, `status-dot`, `meter`, `skeleton-line`, `surface`, `button` |
| Admin shell/table screens | `nav-item`, `icon-button`, `button`, `fab`, `chip`, `badge`, `status-dot`, `avatar`, `checkbox`, `text-field`, `tabs`, `surface`, `rule` |
| Admin tutorial editor | `text-field`, `text-area`, `select-field`, `segmented-control`, `chip`, `icon-button`, `skeleton-*`, `code-caption`, `surface`, `button` |
| Admin media/upload | `thumbnail`, `drop-zone`, `meter`, `icon-button`, `button`, `chip`, `surface`, `skeleton-tile` |
| Admin dialogs | `dialog-shell`, `button`, `icon-button`, `text-field`, `text-area`, `select-field`, `radio`, `switch`, `swatch`, `badge`, `label-value` |
| Notifications gallery | `snackbar`, `banner`, `button`, `icon-button`, `status-dot` |

## Validation Gates

Run these from `C:\projects\prompt-sharp\frontend` after each wave:

```bash
npx ng build components
```

When specs are added:

```bash
npx ng test components --watch=false
```

Manual review gates:

- Every new atom has a `public-api.ts` export.
- Every atom supports keyboard/focus states where interactive.
- Every interactive atom has an accessible name path.
- Components do not hard-code page layout widths, page margins, or screen-specific copy.
- Public and admin use cases are covered by inputs/tone variants rather than duplicated components.
- No atom imports app features, API services, or domain-specific data models unless it is intentionally domain-specific like `DifficultyBadge`.

## Implementation Risks

- The admin skeletons are visually based on Material Web, while the Angular library has no Material dependency. Recreating all MD3 control behavior would be costly; keep the first implementation focused on the visual/API contract needed by current app screens.
- `Surface`, `DialogShell`, and `EmptyState` can drift into molecule territory. Keep them slot-based and generic.
- `NavItem`, `Tabs`, and `SegmentedControl` need strong keyboard semantics. Do not ship them as static divs.
- Do not make one-off atoms for every `ps-*` custom element in the skeletons. Most `ps-*` tags are sections, not atoms.

## Done Definition

The atom implementation effort is complete when:

- All target atom directories listed above exist under `frontend/projects/components/src/lib`.
- All atoms are exported from `frontend/projects/components/src/public-api.ts`.
- Existing atoms have the planned variant/state coverage.
- The skeleton-to-atom coverage matrix has no unmapped primitive.
- `npx ng build components` passes.
- Component tests exist for required inputs, host attributes, and key accessibility states.
