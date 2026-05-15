# Frontend Audit — Dead Code, Stubs & Temp Code

**Date:** 2026-05-15
**Scope:** `frontend/projects/` (api, components, domain, promp-sharp, tokens)
**Goal:** Identify incomplete components, dead code (empty components/services, unused functions), and temp code; recommend fixes.

---

## TL;DR

The frontend is in good shape — **no TODO/FIXME/HACK markers, no commented-out code blocks, and no obviously stubbed services** anywhere in the workspace. The audit surfaced four real issues plus three quality/coverage concerns:

| # | Finding | Severity | Effort |
|---|---|---|---|
| 1 | `TutorialCard` (and other domain card components) declared but never consumed; pages inline raw `<article>` HTML instead | **High** | Medium |
| 2 | 13 components fully implemented in `components` lib but with zero consumers | **High** | Low (delete) or Medium (adopt) |
| 3 | App has no production `apiBaseUrl` configuration — falls back to empty string outside localhost | **High** | Low |
| 4 | 4 unused models exported from `api` lib | Low | Low |
| 5 | 101 spec files contain only "creates the component" boilerplate | Medium | High |
| 6 | Two unused component inputs (`TutorialCard.slug`, `ProgressRow.percent`) | Low | Low |
| 7 | Redundant barrel files in `api` lib (`admin-api.ts`, `catalog-api.ts`, `me-api.ts`, `contact-api.ts`) | Low | Low |

---

## 1. `TutorialCard` and friends are dead components (HIGH)

`projects/domain/src/lib/tutorial/tutorial-card/tutorial-card.ts` defines a fully-featured `ps-tutorial-card` component with six inputs (title, slug, summary, categoryName, difficulty, estimatedMinutes) and a `selected` output. **No template in the codebase ever uses `<ps-tutorial-card>`.**

Instead, five page templates render tutorial cards inline with `<article data-testid="tutorial-card">` markup, duplicating the card structure each time:

- `domain/src/lib/public/home-page/home-page.html` (lines 18, 46)
- `domain/src/lib/progress/progress-page/progress-page.html` (lines 14, 23)
- `domain/src/lib/catalog/catalog-page/catalog-page.html` (line 39)
- `domain/src/lib/catalog/category-page/category-page.html` (line 22)
- `domain/src/lib/catalog/search-page/search-page.html` (line 25)

The inline markup is also less rich than the component (no eyebrow, no difficulty badge, no estimated-minutes mono chip).

**Recommendation:** Replace the inline `<article>` blocks with `<ps-tutorial-card [title]="..." [slug]="..." ...>`. This deletes ~50 lines of duplicated markup across 5 templates and gives the catalog a consistent visual treatment that already exists.

**Also check the same pattern** for any other domain card that is declared but never bound — `ProgressRow` (`ps-progress-row`) has the same issue: only its own files reference its selector.

---

## 2. Thirteen `components` library exports have zero consumers (HIGH)

The following components in `projects/components/src/lib/` are fully implemented (template, SCSS, inputs/outputs, spec) and exported from `public-api.ts` but are not used anywhere in `domain/` or `promp-sharp/`:

- `badge` (`lib-badge`)
- `fab` (`lib-fab`)
- `glyph` (`lib-glyph`)
- `label-value` (`lib-label-value`)
- `radio` (`lib-radio`)
- `segmented-control` (`lib-segmented-control`)
- `skeleton-circle` (`lib-skeleton-circle`)
- `skeleton-line` (`lib-skeleton-line`)
- `skeleton-tile` (`lib-skeleton-tile`)
- `spinner-dot` (`lib-spinner-dot`)
- `surface` (`lib-surface`)
- `swatch` (`lib-swatch`)
- `switch` (`lib-switch`)

Grep confirms each selector appears only in its own component file.

**Recommendation:** Decide per component. Where domain screens have loading/empty states using bespoke markup (e.g., `<p class="state state--loading">Loading…</p>` in `home-page.html`), swap in `lib-spinner-dot` / `lib-skeleton-*`. Where there is no near-term use (`swatch`, `radio`, `segmented-control`, `fab`), delete them or move to a `not-yet-used/` folder. Keeping fully built but unused public-API exports inflates the library surface area and bundle size.

---

## 3. App has no production API base URL (HIGH)

`projects/promp-sharp/src/app/app.config.ts:18-24`:

```ts
function promptSharpApiBaseUrl(): string {
  if (typeof location === 'undefined') {
    return '';
  }
  return ['localhost', '127.0.0.1'].includes(location.hostname) ? 'http://127.0.0.1:5000' : '';
}
```

Outside localhost, the function returns `''`. There is no `environment.ts` / `environment.production.ts`, no build-time replacement, and no runtime config endpoint. **Any non-localhost deployment will issue API requests against the page origin** — possibly correct if backend is colocated, possibly silently broken otherwise.

**Recommendation:** Either (a) document that the empty string means "same origin" and add a comment to that effect, (b) add `src/environments/environment.ts` with file-replacement in `angular.json`, or (c) load runtime config from `/assets/config.json`. Option (a) is the least churn if the deployment model is single-origin.

---

## 4. Four `api` library models are exported but never imported (LOW)

In `projects/api/src/lib/models/`:

- `api-problem-details.ts` — `ApiProblemDetails` interface
- `api-validation-problem-details.ts` — `ApiValidationProblemDetails` interface
- `iso-date-time-string.ts` — `IsoDateTimeString` type alias
- `tutorial-sort.ts` — `TutorialSort` type union (sort param is inlined as string literals in `TutorialListQuery`)

Each appears only in its own file (and `models.ts` barrel). They look like planned API contract types that haven't been wired into the HTTP services or error handlers yet.

**Recommendation:**
- `ApiProblemDetails` / `ApiValidationProblemDetails` are useful for typed error handling — consider wiring them into the `prompt-sharp-auth-interceptor.ts` error path, or delete.
- `IsoDateTimeString` would be valuable if applied to all `createdAt`/`updatedAt` fields in the model files (currently typed as plain `string`). Either apply consistently or delete.
- `TutorialSort` should replace the inline literal in `TutorialListQuery.sort` (`'newest' | 'oldest' | ...`). Quick win.

---

## 5. 101 spec files are boilerplate-only (MEDIUM)

Every component spec under `projects/domain/src/lib/**/*.spec.ts` and most under `projects/components/src/lib/**/*.spec.ts` contains only a "creates the component" assertion. Examples:

- `domain/src/lib/admin/audit/admin-audit-log-page/admin-audit-log-page.spec.ts`
- `domain/src/lib/tutorial/tutorial-card/tutorial-card.spec.ts`
- `domain/src/lib/auth/access-denied-page/access-denied-page.spec.ts`

The `api` library `api.spec.ts` does have meaningful contract tests, so the precedent exists.

**Recommendation:** Either (a) add meaningful tests for input/output binding, loading/error/success states, and routing wiring on the highest-traffic components first (home, catalog, sign-in, tutorial detail); or (b) if unit testing isn't the strategy and Playwright e2e is the source of truth, delete the boilerplate specs entirely so CI surfaces real coverage rather than noise. Don't leave them as a false-positive coverage signal.

---

## 6. Two unused inputs in domain components (LOW)

- `domain/src/lib/tutorial/tutorial-card/tutorial-card.ts:14` — `readonly slug = input.required<string>();` declared, but `tutorial-card.html` never references `slug()`. The card emits `selected` and the parent presumably routes — but consumers still must supply a slug they can't see used.
- `domain/src/lib/progress/progress-row/progress-row.ts:11` — `readonly percent = input<number>(0);` declared, but `progress-row.html` only renders `title()` and `<ng-content>`.

**Recommendation:** Either remove the inputs, or use them (TutorialCard could render the slug as a link `[href]="'/tutorials/' + slug()"`; ProgressRow could render a `<lib-meter [value]="percent()">` instead of an `<ng-content>` slot).

---

## 7. Redundant barrel files in `api` lib (LOW)

`projects/api/src/lib/api.ts` re-exports four sibling barrel files (`admin-api.ts`, `catalog-api.ts`, `me-api.ts`, `contact-api.ts`), each of which only re-exports from `services/`. This is a two-level barrel with no value-add — public-api.ts → api.ts → admin-api.ts → services/prompt-sharp-admin-*-api.ts.

**Recommendation:** Inline the four sibling barrels into `api.ts` (or delete `api.ts` and inline into `public-api.ts`). Single-step indirection is enough.

---

## Items inspected and cleared (no action needed)

- **TODO/FIXME/HACK/XXX/WIP markers:** zero matches across all four projects.
- **Commented-out code blocks:** none detected.
- **Empty/stub services:** none — every service class has real methods that are called from at least one consumer.
- **Empty HTML/SCSS files:** the empty templates (`rule.html`, `status-dot.html`, `skeleton-circle.html`, `skeleton-line.html`) are intentional — those components are pure CSS shapes driven by `:host` styling.
- **Routes pointing to nonexistent components:** none. Every route target resolves to a real, non-stub component.
- **`NotificationCenter` at `/notifications` and `/admin/notifications`:** this is a deliberate gallery/demo route, not dead code. Decide separately whether to ship it in production builds.
- **Wrapper components in `domain` (e.g., `audit-filter-rail`, `audit-log-row`, `profile-hero`, `marquee-strip`, `public-footer`):** these are intentional presentational containers around `<ng-content>`. Not dead.
- **Boilerplate SCSS (`:host { display: block; }`):** 83 files. Trivial styling for layout — not problematic.

---

## Suggested cleanup PR sequence

1. **PR-1 (mechanical):** Delete unused api models (`tutorial-sort`, `iso-date-time-string`, or wire them up) and unused inputs (`TutorialCard.slug`, `ProgressRow.percent`). Inline the four `api` barrel files.
2. **PR-2 (architectural):** Replace inline `<article data-testid="tutorial-card">` markup in 5 page templates with `<ps-tutorial-card>` bindings. Also adopt `ProgressRow` in `progress-page` if appropriate.
3. **PR-3 (decision):** Per-component decision on the 13 unused `components` exports — adopt or delete. Document outcomes in the components README.
4. **PR-4 (config):** Fix production API base URL story in `app.config.ts` — comment it, environment-file it, or runtime-config it.
5. **PR-5 (tests):** Either delete boilerplate specs or replace them with real assertions on the top 10 highest-value components.
