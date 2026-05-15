# Domain Components Implementation Plan

This plan covers the molecules and organisms extracted from the public and admin skeleton pages and dialogs in `docs/skeletons/`. The implementation target is the Angular domain library at `frontend/projects/domain`.

The intent is that `frontend/projects/promp-sharp` becomes a thin composition shell: routing, providers, auth bootstrap, and page mounting only. UI should be composed from `domain` components, which in turn compose reusable atoms from `components` and call backend services from `api` when data is needed.

## Success Criteria

- Every skeleton page/dialog has a mapped domain component or component group under `frontend/projects/domain/src/lib`.
- Molecules and organisms live in `frontend/projects/domain`, not in `frontend/projects/components`.
- Domain components use atoms from `frontend/projects/components` for primitive UI.
- Service-backed domain components use only public APIs from `frontend/projects/api` for backend communication.
- Domain exports route-ready page components, dialogs, and reusable feature organisms from `frontend/projects/domain/src/public-api.ts`.
- The application can be assembled without duplicating UI markup in `frontend/projects/promp-sharp`.

## Current State

`frontend/projects/domain` is currently the Angular CLI stub:

- `src/lib/domain.ts`
- `src/lib/domain.spec.ts`
- `src/public-api.ts`

The domain package has no declared dependency on local `components` or `api` libraries yet. The domain library also does not include token style include paths in `ng-package.json`, while `components` already does.

Before implementing domain components, update:

- `frontend/projects/domain/package.json` to declare `components` and `api` as peer dependencies or workspace dependencies according to the repo's packaging convention.
- `frontend/projects/domain/ng-package.json` to include token SCSS paths if domain SCSS imports shared tokens.
- `frontend/projects/domain/src/public-api.ts` to export each public component group.

## Source Inventory

Skeleton source files reviewed: all 30 files under `docs/skeletons`.

Public/auth surfaces:

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

Admin surfaces:

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

## Component Boundary

Use this split consistently:

- Atoms in `frontend/projects/components`: buttons, chips, typography, fields, dialogs shells, skeleton primitives, badges, icons, status dots, avatars, meters.
- Molecules in `frontend/projects/domain`: tutorial cards, filter rails, pagination controls, profile sections, editor block rows, upload rows, nav rows, table rows.
- Organisms in `frontend/projects/domain`: page shells, nav bars, admin rails, full tables, page sections, dialogs with domain copy, route-ready pages.
- API services in `frontend/projects/api`: all HTTP calls and backend DTO models.
- App project in `frontend/projects/promp-sharp`: routing, providers, auth adapter, app-level layout outlet, no feature UI reimplementation.

Do not copy atom SCSS from the skeletons into domain components if a planned atom already owns it. Domain components should compose atoms and own only layout, feature structure, data binding, and domain-specific states.

## Dependency Rules

Domain components may import:

- `@angular/core`, `@angular/common`, `@angular/forms`, and `@angular/router` where needed.
- Public exports from `components`.
- Public exports from `api`.

Domain components must not import:

- Files by deep paths from `frontend/projects/components/src/lib/...`.
- Files by deep paths from `frontend/projects/api/src/lib/...`.
- App code from `frontend/projects/promp-sharp`.
- Backend-generated or private API implementation files that are not exported from `api/src/public-api.ts`.

If an API service is needed but not exported by `api/src/public-api.ts`, update the API public surface first, then consume it from domain.

## Data Pattern

Use two layers for service-backed screens:

- Smart route/page component: injects API services, reads route/query params if needed, owns loading/error/retry state, and maps DTOs into view models.
- Presentational organism: receives inputs, emits UI events, composes atoms and molecules, and has no direct HTTP dependency.

Example:

```text
catalog-page/
  catalog-page.ts        # injects PromptSharpTutorialsApi, PromptSharpCategoriesApi, PromptSharpTagsApi
  catalog-page.html      # binds data into catalog organisms
catalog-view/
  catalog-view.ts        # pure presentational organism
  catalog-view.html
```

Route-ready pages should be exported so the app router can point directly to domain components.

## Target Directory Layout

```text
frontend/projects/domain/src/lib/
  layout/
  public/
  auth/
  tutorial/
  catalog/
  profile/
  progress/
  admin/
  dialogs/
  notifications/
  shared/
```

Each component should use the same file pattern:

```text
<feature>/<component-name>/
  <component-name>.ts
  <component-name>.html
  <component-name>.scss
  <component-name>.spec.ts
```

Selectors should use the `ps-*` prefix where they correspond to skeleton `ps-*` custom elements. Keep atom selectors as their existing `lib-*` selectors.

## Layout Organisms

| Component | Target path | Skeleton tags/files | Atom dependencies | API dependency |
|---|---|---|---|---|
| Public shell | `layout/public-shell` | `ps-shell` in public pages | `surface`, `rule` if available | none |
| Public nav | `layout/public-nav` | `ps-nav`, `ps-nav-min`, `ps-public-nav` | `wordmark`, `button`, `nav-item` | optional auth state input only |
| Public footer | `layout/public-footer` | `ps-footer` | `wordmark`, `mono`, `button` | none |
| Admin shell | `layout/admin-shell` | `ps-admin-shell` | `surface`, `rule` | none |
| Admin nav rail | `layout/admin-nav-rail` | `ps-admin-nav-rail` | `wordmark`, `nav-item`, `icon-button` | none |
| Admin topbar | `layout/admin-topbar` | `ps-admin-topbar` | `button`, `icon-button`, `avatar`, `status-dot` | optional current user input |
| Public dialog backdrop | `layout/public-dialog-backdrop` | `ps-public-backdrop` in `signout-dialog.html` | `skeleton-tile`, `surface` | none |

## Public Page Components

| Page/component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Home page | `public/home-page` | `home.html` | route-ready organism | `PromptSharpTutorialsApi` for featured/latest |
| Home hero | `public/home-hero` | `ps-hero` | organism | none |
| Featured tutorials | `tutorial/featured-tutorials` | `ps-featured` | organism | optional API in container variant |
| Latest tutorials | `tutorial/latest-tutorials` | `ps-latest` | organism | optional API in container variant |
| Tutorial tracks | `public/tutorial-tracks` | `ps-tracks` | organism | none initially |
| Marquee strip | `public/marquee-strip` | `ps-marquee` | molecule | none |
| About page | `public/about-page` | `about.html` | route-ready organism | none |
| About hero | `public/about-hero` | `ps-about-hero` | organism | none |
| About body | `public/about-body` | `ps-about-body` | organism | none |
| Contact card | `public/contact-card` | `ps-contact-card` | molecule | optional future contact API, none now |
| Error page | `public/error-page` | `error-404.html` | route-ready organism | none |
| Access denied page | `auth/access-denied-page` | `access-denied.html` | route-ready organism | none |

## Catalog and Search Components

| Component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Catalog page | `catalog/catalog-page` | `catalog.html` | route-ready organism | `PromptSharpTutorialsApi`, `PromptSharpCategoriesApi`, `PromptSharpTagsApi` |
| Catalog header | `catalog/catalog-header` | `ps-catalog-header` | organism | none |
| Catalog toolbar | `catalog/catalog-toolbar` | `ps-catalog-toolbar` | molecule | none |
| Catalog body | `catalog/catalog-body` | `ps-catalog-body` | organism | none |
| Catalog grid | `catalog/catalog-grid` | `ps-catalog-grid` | organism | none |
| Tutorial card | `tutorial/tutorial-card` | `ps-tutorial-card` | molecule | none |
| Filter rail | `catalog/filter-rail` | `ps-filter-rail` | organism | categories/tags input from page |
| Pagination | `catalog/pagination` | `ps-pagination` | molecule | none |
| Category page | `catalog/category-page` | `category.html` | route-ready organism | `PromptSharpCategoriesApi`, `PromptSharpTagsApi`, `PromptSharpTutorialsApi` |
| Category hero | `catalog/category-hero` | `ps-category-hero` | organism | none |
| Search page | `catalog/search-page` | `search-results.html` | route-ready organism | `PromptSharpTutorialsApi` |
| Search bar | `catalog/search-bar` | `ps-search-bar` | molecule | none |
| Search meta | `catalog/search-meta` | `ps-search-meta` | molecule | none |
| Results list | `catalog/results-list` | `ps-results-list` | organism | none |

## Tutorial Detail Components

| Component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Tutorial detail page | `tutorial/tutorial-detail-page` | `tutorial-detail.html` | route-ready organism | `PromptSharpTutorialsApi`, `PromptSharpMeApi` for progress/bookmarks if authenticated |
| Breadcrumbs | `tutorial/tutorial-breadcrumbs` | `ps-crumbs` | molecule | none |
| Tutorial hero | `tutorial/tutorial-hero` | `ps-tutorial-hero` | organism | none |
| Tutorial TOC | `tutorial/tutorial-toc` | `ps-tutorial-toc` | organism | none |
| Tutorial body | `tutorial/tutorial-body` | `ps-tutorial-body` | organism | none |
| Tutorial code block | `tutorial/tutorial-code-block` | code block pattern in `tutorial-detail.html` | molecule | none |
| Tutorial step nav | `tutorial/tutorial-step-nav` | `ps-tutorial-nav` | molecule | none |
| Related tutorials | `tutorial/related-tutorials` | `ps-related` | organism | `PromptSharpTutorialsApi` optional container |

## Auth and Account Components

| Component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Sign-in page | `auth/sign-in-page` | `signin.html` | route-ready organism | external auth adapter through inputs/events, not API |
| Sign-in card | `auth/sign-in-card` | `ps-signin-card` | organism | none |
| Sign-in field row | `auth/sign-in-field-row` | `ps-field` | molecule | none |
| Sign-in footer | `auth/sign-in-footer` | `ps-signin-foot` | molecule | none |
| OAuth callback page | `auth/oauth-callback-page` | `oauth-callback.html` | route-ready organism | external auth adapter through inputs/events, not API |
| OAuth consent page | `auth/oauth-consent-page` | `oauth-consent-dialog.html` | route-ready organism | external auth adapter through inputs/events, not API |
| OAuth consent card | `auth/oauth-consent-card` | `ps-consent-card` | organism | none |
| Profile page | `profile/profile-page` | `profile.html` | route-ready organism | `PromptSharpMeApi` |
| Profile hero | `profile/profile-hero` | `ps-profile-hero` | organism | none |
| Profile section | `profile/profile-section` | `ps-profile-section` | molecule | none |
| Progress page | `progress/progress-page` | `progress.html` | route-ready organism | `PromptSharpMeApi` |
| Progress list | `progress/progress-list` | `ps-progress-list` | organism | none |
| Progress row | `progress/progress-row` | rows inside `progress.html` | molecule | none |

## Admin Shell and Dashboard

| Component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Admin dashboard page | `admin/dashboard/admin-dashboard-page` | `admin-dashboard.html` | route-ready organism | admin APIs for counts/recent activity when endpoints exist |
| Admin KPI card | `admin/shared/admin-kpi-card` | dashboard KPI cards | molecule | none |
| Admin activity list | `admin/shared/admin-activity-list` | dashboard activity list | organism | none |
| Admin table shell | `admin/shared/admin-table-shell` | table pages | organism | none |
| Admin row actions | `admin/shared/admin-row-actions` | row action menus/icons | molecule | none |
| Admin filter chips | `admin/shared/admin-filter-chips` | filter chip rows | molecule | none |

## Admin Tutorial Management

| Component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Admin tutorial list page | `admin/tutorials/admin-tutorial-list-page` | `admin-tutorial-list.html` | route-ready organism | `PromptSharpAdminTutorialsApi` |
| Admin tutorial table | `admin/tutorials/admin-tutorial-table` | `ps-admin-tutorial-list` | organism | none |
| Admin tutorial row | `admin/tutorials/admin-tutorial-row` | table rows | molecule | none |
| Admin tutorial dialog | `admin/tutorials/admin-tutorial-dialog` | `admin-tutorial-dialog.html` | organism/dialog | `PromptSharpAdminTutorialsApi`, category/tag APIs through page/container |
| Admin tutorial list mini | `admin/tutorials/admin-tutorial-list-mini` | `ps-admin-tutorial-list-mini` | organism | none |
| Admin tutorial editor page | `admin/tutorials/admin-tutorial-editor-page` | `admin-tutorial-editor.html` | route-ready organism | `PromptSharpAdminTutorialsApi`, `PromptSharpAdminCategoriesApi`, `PromptSharpAdminTagsApi`, `PromptSharpAdminMediaApi` |
| Tutorial editor layout | `admin/tutorials/tutorial-editor-layout` | `ps-admin-tutorial-editor` | organism | none |
| Step outline | `admin/tutorials/step-outline` | editor left rail | organism | none |
| Step outline item | `admin/tutorials/step-outline-item` | editor list item | molecule | none |
| Step block editor | `admin/tutorials/step-block-editor` | editor block stack | organism | none |
| Step block row | `admin/tutorials/step-block-row` | prose/code/image/callout block rows | molecule | none |
| Tutorial metadata panel | `admin/tutorials/tutorial-metadata-panel` | editor right rail | organism | none |

## Admin Taxonomy, Media, Users, and Audit

| Component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Admin categories page | `admin/taxonomy/admin-taxonomy-page` | `admin-categories.html` | route-ready organism | `PromptSharpAdminCategoriesApi`, `PromptSharpAdminTagsApi` |
| Admin taxonomy table | `admin/taxonomy/admin-taxonomy-table` | category/tag table | organism | none |
| Admin taxonomy row | `admin/taxonomy/admin-taxonomy-row` | table rows | molecule | none |
| Admin media page | `admin/media/admin-media-page` | `admin-media.html` | route-ready organism | `PromptSharpAdminMediaApi` |
| Media filter rail | `admin/media/media-filter-rail` | media left rail | organism | none |
| Media grid | `admin/media/media-grid` | media cards | organism | none |
| Media card | `admin/media/media-card` | `.media-card` | molecule | none |
| Media selection bar | `admin/media/media-selection-bar` | bottom bulk action bar | organism | none |
| Admin users page | `admin/users/admin-users-page` | `admin-users.html` | route-ready organism | `PromptSharpAdminUsersApi` |
| Admin users table | `admin/users/admin-users-table` | `ps-admin-users` | organism | none |
| Admin user row | `admin/users/admin-user-row` | table rows | molecule | none |
| User role chips | `admin/users/user-role-chips` | role chip set | molecule | none |
| Admin audit log page | `admin/audit/admin-audit-log-page` | `admin-audit-log.html` | route-ready organism | future audit API; use empty adapter until backend exists |
| Audit log table | `admin/audit/audit-log-table` | `ps-admin-audit-log` | organism | none |
| Audit log row | `admin/audit/audit-log-row` | audit row/expanded diff | molecule | none |
| Audit filter rail | `admin/audit/audit-filter-rail` | audit right rail | organism | none |

## Domain Dialogs

All specific dialogs belong in domain. They compose a generic atom-level `dialog-shell` when available.

| Dialog component | Target path | Source skeleton | API services |
|---|---|---|---|
| Tutorial edit dialog | `dialogs/tutorial-dialog` | `admin-tutorial-dialog.html` | called by tutorial page/container |
| Confirm delete dialog | `dialogs/confirm-delete-dialog` | `admin-confirm-delete-dialog.html` | emits confirmation; caller invokes API |
| Publish dialog | `dialogs/publish-dialog` | `admin-publish-dialog.html` | emits publish settings; caller invokes API |
| Category dialog | `dialogs/category-dialog` | `admin-category-dialog.html` | emits category/tag upsert model; caller invokes taxonomy API |
| Media upload dialog | `dialogs/media-upload-dialog` | `admin-media-upload-dialog.html` | `PromptSharpAdminMediaApi` for upload |
| User invite dialog | `dialogs/user-invite-dialog` | `admin-user-invite-dialog.html` | future invite API; until then emits form value |
| Unsaved changes dialog | `dialogs/unsaved-changes-dialog` | `admin-unsaved-changes-dialog.html` | none |
| Session expired dialog | `dialogs/session-expired-dialog` | `session-expired-dialog.html` | auth adapter through output event |
| Sign-out dialog | `dialogs/sign-out-dialog` | `signout-dialog.html` | auth adapter through output event |

Dialog rule: domain dialogs own copy, validation, form grouping, and event contracts. They should not own parent page dimming; parent shells/pages decide overlay placement.

## Notifications

| Component | Target path | Source skeleton | Type | API services |
|---|---|---|---|---|
| Notifications gallery page | `notifications/notifications-gallery-page` | `notifications.html` | route-ready review page | none |
| Notification banner | `notifications/notification-banner` | top banners | organism/molecule | none |
| Notification snackbar host | `notifications/notification-snackbar-host` | snackbar variants | organism | none |
| Notification service facade | `notifications/notification-center` | app-level feedback | service | none |

If atom-level `snackbar` and `banner` components exist, domain notification components should wrap those atoms with app-specific message contracts.

## API Service Usage Map

| API service | Domain consumers |
|---|---|
| `PromptSharpTutorialsApi` | `home-page`, `catalog-page`, `category-page`, `search-page`, `tutorial-detail-page`, `related-tutorials` |
| `PromptSharpCategoriesApi` | `catalog-page`, `category-page`, `filter-rail` container inputs |
| `PromptSharpTagsApi` | `catalog-page`, `category-page`, `filter-rail` container inputs |
| `PromptSharpMeApi` | `profile-page`, `progress-page`, `tutorial-detail-page` for bookmarks/progress |
| `PromptSharpAdminTutorialsApi` | `admin-tutorial-list-page`, `admin-tutorial-editor-page`, tutorial dialogs/actions |
| `PromptSharpAdminCategoriesApi` | `admin-taxonomy-page`, tutorial metadata/category selectors |
| `PromptSharpAdminTagsApi` | `admin-taxonomy-page`, tutorial metadata/tag selectors |
| `PromptSharpAdminMediaApi` | `admin-media-page`, `media-upload-dialog`, tutorial image pickers |
| `PromptSharpAdminUsersApi` | `admin-users-page`, role assignment flows |
| Future audit API | `admin-audit-log-page` |

## Implementation Waves

### Wave 1 - Library Infrastructure

- Remove or quarantine the generated `Domain` stub.
- Add domain package dependencies on `components` and `api`.
- Add token style include paths to `domain/ng-package.json` if SCSS imports tokens.
- Create the directory taxonomy under `src/lib`.
- Establish export barrel files and update `src/public-api.ts`.
- Add testing utilities for component input/output contracts.

Validation:

```bash
npx ng build api
npx ng build components
npx ng build domain
```

### Wave 2 - Shared Layout Organisms

- Implement public shell/nav/footer and admin shell/nav rail/topbar.
- Implement shared admin table shell, row actions, and filter chip group.
- Implement route-safe layout inputs for active nav, user summary, and auth actions.

Coverage unlocked:

- All public pages can mount in a common shell.
- All admin pages/dialog backdrops can reuse the admin chrome.

### Wave 3 - Public Catalog and Tutorial Read Experience

- Implement tutorial card, catalog toolbar, filter rail, catalog grid, pagination, category hero, search results list.
- Implement home page organisms: hero, featured tutorials, latest tutorials, tracks, marquee.
- Implement tutorial detail organisms: breadcrumbs, hero, TOC, body, code block, step nav, related tutorials.
- Add smart pages using public API services.

Coverage unlocked:

- `home.html`
- `catalog.html`
- `category.html`
- `search-results.html`
- `tutorial-detail.html`

### Wave 4 - Auth, Profile, and Progress

- Implement sign-in, OAuth callback, OAuth consent, access denied, and error pages.
- Implement profile hero/sections and progress list/rows.
- Wire `PromptSharpMeApi` for profile, bookmarks, and tutorial progress.

Coverage unlocked:

- `signin.html`
- `oauth-callback.html`
- `oauth-consent-dialog.html`
- `access-denied.html`
- `error-404.html`
- `profile.html`
- `progress.html`
- `signout-dialog.html`

### Wave 5 - Admin Read/List Surfaces

- Implement admin dashboard, tutorial table, taxonomy table, media grid/filter, users table, audit log table/filter.
- Wire admin APIs for tutorials, taxonomy, media, and users.
- Use empty-state adapters for audit data until backend support exists.

Coverage unlocked:

- `admin-dashboard.html`
- `admin-tutorial-list.html`
- `admin-categories.html`
- `admin-media.html`
- `admin-users.html`
- `admin-audit-log.html`

### Wave 6 - Admin Editor and Dialogs

- Implement tutorial editor layout, step outline, block editor, metadata panel.
- Implement domain dialogs: tutorial, delete, publish, category, media upload, user invite, unsaved changes, session expired, sign out.
- Keep API mutations in page/container components unless a dialog is specifically service-backed, such as media upload.

Coverage unlocked:

- `admin-tutorial-editor.html`
- `admin-tutorial-dialog.html`
- all admin dialog skeletons
- `session-expired-dialog.html`

### Wave 7 - Notifications and App Composition

- Implement notifications gallery and notification service facade.
- Replace app-level UI markup in `frontend/projects/promp-sharp` with exported domain page components.
- Ensure routes point at domain route-ready components.
- Keep app code limited to providers, auth adapters, environment config, and route definitions.

## Public API Export Plan

Export from `frontend/projects/domain/src/public-api.ts` by feature group:

```ts
export * from './lib/layout/public-shell/public-shell';
export * from './lib/layout/public-nav/public-nav';
export * from './lib/layout/public-footer/public-footer';
export * from './lib/layout/admin-shell/admin-shell';
export * from './lib/layout/admin-nav-rail/admin-nav-rail';
export * from './lib/layout/admin-topbar/admin-topbar';

export * from './lib/public/home-page/home-page';
export * from './lib/catalog/catalog-page/catalog-page';
export * from './lib/tutorial/tutorial-detail-page/tutorial-detail-page';
export * from './lib/auth/sign-in-page/sign-in-page';
export * from './lib/profile/profile-page/profile-page';
export * from './lib/progress/progress-page/progress-page';

export * from './lib/admin/dashboard/admin-dashboard-page/admin-dashboard-page';
export * from './lib/admin/tutorials/admin-tutorial-list-page/admin-tutorial-list-page';
export * from './lib/admin/tutorials/admin-tutorial-editor-page/admin-tutorial-editor-page';
export * from './lib/admin/taxonomy/admin-taxonomy-page/admin-taxonomy-page';
export * from './lib/admin/media/admin-media-page/admin-media-page';
export * from './lib/admin/users/admin-users-page/admin-users-page';
export * from './lib/admin/audit/admin-audit-log-page/admin-audit-log-page';
```

Only export components intended for app consumption or cross-feature composition. Keep tiny private helper rows internal unless another feature needs them.

## Skeleton-to-Domain Coverage Matrix

| Skeleton | Domain entry component |
|---|---|
| `home.html` | `public/home-page` |
| `catalog.html` | `catalog/catalog-page` |
| `category.html` | `catalog/category-page` |
| `search-results.html` | `catalog/search-page` |
| `tutorial-detail.html` | `tutorial/tutorial-detail-page` |
| `about.html` | `public/about-page` |
| `error-404.html` | `public/error-page` |
| `signin.html` | `auth/sign-in-page` |
| `oauth-callback.html` | `auth/oauth-callback-page` |
| `oauth-consent-dialog.html` | `auth/oauth-consent-page` |
| `access-denied.html` | `auth/access-denied-page` |
| `profile.html` | `profile/profile-page` |
| `progress.html` | `progress/progress-page` |
| `admin-dashboard.html` | `admin/dashboard/admin-dashboard-page` |
| `admin-tutorial-list.html` | `admin/tutorials/admin-tutorial-list-page` |
| `admin-tutorial-dialog.html` | `dialogs/tutorial-dialog` plus tutorial list page |
| `admin-tutorial-editor.html` | `admin/tutorials/admin-tutorial-editor-page` |
| `admin-categories.html` | `admin/taxonomy/admin-taxonomy-page` |
| `admin-category-dialog.html` | `dialogs/category-dialog` |
| `admin-media.html` | `admin/media/admin-media-page` |
| `admin-media-upload-dialog.html` | `dialogs/media-upload-dialog` |
| `admin-users.html` | `admin/users/admin-users-page` |
| `admin-user-invite-dialog.html` | `dialogs/user-invite-dialog` |
| `admin-audit-log.html` | `admin/audit/admin-audit-log-page` |
| `admin-confirm-delete-dialog.html` | `dialogs/confirm-delete-dialog` |
| `admin-publish-dialog.html` | `dialogs/publish-dialog` |
| `admin-unsaved-changes-dialog.html` | `dialogs/unsaved-changes-dialog` |
| `session-expired-dialog.html` | `dialogs/session-expired-dialog` |
| `signout-dialog.html` | `dialogs/sign-out-dialog` |
| `notifications.html` | `notifications/notifications-gallery-page` |

## Validation Gates

Run from `C:\projects\prompt-sharp\frontend` after each wave:

```bash
npx ng build api
npx ng build components
npx ng build domain
```

When app routes are changed:

```bash
npx ng build promp-sharp
```

When tests are added:

```bash
npx ng test domain --watch=false
```

Manual review gates:

- Each route-ready page has loading, error, empty, and populated states.
- Each service-backed component imports services/models from `api` public exports only.
- Each domain component imports atoms from `components` public exports only.
- Presentational organisms do not inject HTTP services.
- Dialogs expose clear inputs/outputs and do not mutate backend state unless explicitly service-backed.
- App templates do not duplicate skeleton-derived UI once the corresponding domain page exists.
- Responsive behavior from the skeletons is preserved at xs, s, m, l, and xl breakpoints.
- Keyboard navigation and accessible names are present for tables, dialogs, nav, forms, menus, and editor controls.

## Risks and Decisions

- The domain library will become the main UI surface. Keep feature folders strict so it does not become an unstructured component dump.
- Some admin skeleton behavior, especially audit log and user invite, may not have backend endpoints yet. Implement those with explicit adapter interfaces or empty-state placeholders until the API project exposes them.
- Route-ready components may inject Angular Router. Presentational components should not.
- Tutorial editor state can become complex. Keep editor state in a focused domain service under `admin/tutorials/state` rather than spreading mutable state across components.
- Avoid duplicating atoms in domain. If a component is reusable without domain data or domain copy, move it to the atom plan instead.

## Done Definition

The domain implementation effort is complete when:

- Every skeleton file in the coverage matrix has a route-ready page or dialog component in `frontend/projects/domain`.
- Every molecule/organism listed in this plan is either implemented or intentionally deferred with a documented reason.
- Domain components compose atoms from `components` for primitive UI.
- Service-backed components use API services from `api`.
- `frontend/projects/promp-sharp` routes/screens are composed from domain exports and component atoms, with no duplicate feature markup.
- `npx ng build api`, `npx ng build components`, `npx ng build domain`, and `npx ng build promp-sharp` pass.
- Tests cover route-ready smart components, key presentational organisms, dialog contracts, and editor state behavior.
