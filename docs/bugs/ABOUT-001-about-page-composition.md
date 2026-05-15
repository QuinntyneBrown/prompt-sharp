# ABOUT-001 — About Page Composition Did Not Match Skeleton

- **Status:** resolved
- **Audit:** `docs/ui-audit/public/about.md`
- **Route:** `/about`
- **Skeleton:** `docs/skeletons/about.html`
- **Section:** Full page composition, about hero, editorial body, contact section, shared footer

## Expected

The live about route renders the audited composition: sticky nav with `About` active, two-column hero with `About / Contact` eyebrow, editorial principles panel, contact address and form section, and shared footer. The contact email is a `mailto:` link, and the form submits through the contact endpoint.

## Actual

The route rendered a short static text block with no audited hero grid, no editorial panel, no contact form section, and no section-level rules or skeleton placeholders.

## Fix

Added reusable Pattern A page primitives, updated `about-page` to render the required hero/body/contact sections, and updated `contact-card` to use the existing `PromptSharpContactApi` with a skeleton-matched panel form.

## Evidence

- Build: `npx ng build domain --configuration development` passed.
- Build: `npm run build -- --configuration development` passed.
- Desktop screenshot: `docs/ui-audit/screenshots/about/about-desktop.png`
- Tablet screenshot: `docs/ui-audit/screenshots/about/about-tablet.png`
- Mobile screenshot: `docs/ui-audit/screenshots/about/about-mobile.png`
- Fix commit: pending final audit commit.
