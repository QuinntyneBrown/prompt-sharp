# TUTORIAL-001 - Tutorial Detail Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/tutorial-detail.md`
- **Route:** `/tutorials/wiring-mediatr-clean-architecture-api`
- **Skeleton:** `docs/skeletons/tutorial-detail.html`
- **Section:** Full tutorial detail page composition, breadcrumbs, hero, TOC, body code blocks, related cards, footer

## Expected

The live tutorial detail route renders the skeleton composition in DOM order: shared public navigation with Tutorials active, tight breadcrumb row, two-column tutorial hero with metadata and shimmer tile, desktop TOC plus reading body, two code-block panels with copy chips and periwinkle captions, step navigation, related tutorial card grid, and the shared footer. The layout reflows to a single-column hero/detail body at 1100 px and a one-card related grid at 720 px.

## Actual

The running Angular page rendered a sparse tutorial implementation with a simple title, loading/error states, progress list, and current-step controls. Breadcrumbs, the skeleton hero, sticky TOC, code-block placeholder styling, related tutorial grid, and required responsive skeleton structure were missing.

## Fix

Updated `frontend/projects/domain/src/lib/tutorial/tutorial-detail-page/tutorial-detail-page.html` to render the audited Pattern A tutorial detail surface while preserving route initialization. Added tutorial detail, TOC, code-block, step-nav, section-header, and related-card grid styles to `frontend/projects/promp-sharp/src/styles.scss`.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- DOM/responsive check: tutorial-detail Playwright assertions passed at 1440, 1100, and 720 px.
- Desktop screenshot: `docs/ui-audit/screenshots/tutorial-detail/tutorial-detail-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/tutorial-detail/tutorial-detail-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/tutorial-detail/tutorial-detail-mobile.png`
- Fix commit: pending final audit commit.
