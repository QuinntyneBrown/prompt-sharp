# 02 - Visual, Icons, Fonts, and Mock Fidelity

## Objective

Prove that implemented screens visually match the HTML skeleton mocks for the most part, with icons, fonts, styles, responsive layout, and component states loading correctly.

## Mock Source of Truth

Use `docs/skeletons/*.html` as the design source for visual comparison.

| Implemented route or dialog | Skeleton mock |
| --- | --- |
| `/` | `docs/skeletons/home.html` |
| `/tutorials` | `docs/skeletons/catalog.html` |
| `/categories/:slug` | `docs/skeletons/category.html` |
| `/tags/:slug` | `docs/skeletons/category.html` |
| `/search` | `docs/skeletons/search-results.html` |
| `/tutorials/:slug` | `docs/skeletons/tutorial-detail.html` |
| `/about` | `docs/skeletons/about.html` |
| `/contact` | `docs/skeletons/about.html` plus contact section |
| `/sign-in` | `docs/skeletons/signin.html` |
| `/auth/callback` | `docs/skeletons/oauth-callback.html` |
| `/auth/consent` | `docs/skeletons/oauth-consent-dialog.html` |
| `/access-denied` | `docs/skeletons/access-denied.html` |
| `/me/profile` | `docs/skeletons/profile.html` |
| `/me/progress` | `docs/skeletons/progress.html` |
| `/notifications` | `docs/skeletons/notifications.html` |
| `/admin` | `docs/skeletons/admin-dashboard.html` |
| `/admin/tutorials` | `docs/skeletons/admin-tutorial-list.html` |
| `/admin/tutorials/new` | `docs/skeletons/admin-tutorial-editor.html` |
| `/admin/taxonomy` | `docs/skeletons/admin-categories.html` |
| `/admin/media` | `docs/skeletons/admin-media.html` |
| `/admin/users` | `docs/skeletons/admin-users.html` |
| `/admin/audit-log` | `docs/skeletons/admin-audit-log.html` |
| Confirm delete dialog | `docs/skeletons/admin-confirm-delete-dialog.html` |
| Category dialog | `docs/skeletons/admin-category-dialog.html` |
| Media upload dialog | `docs/skeletons/admin-media-upload-dialog.html` |
| Publish dialog | `docs/skeletons/admin-publish-dialog.html` |
| Tutorial dialog | `docs/skeletons/admin-tutorial-dialog.html` |
| Unsaved changes dialog | `docs/skeletons/admin-unsaved-changes-dialog.html` |
| User invite dialog | `docs/skeletons/admin-user-invite-dialog.html` |
| Session expired dialog | `docs/skeletons/session-expired-dialog.html` |
| Sign out dialog | `docs/skeletons/signout-dialog.html` |

## Visual Test Procedure

For each route:

1. Navigate directly to the route with deterministic seed data.
2. Wait for network idle and app-specific loading states to finish.
3. Assert no visible skeleton loaders remain unless the screen intentionally demonstrates loading states.
4. Capture screenshots at mobile, tablet, desktop, and wide desktop sizes.
5. Compare to the matching skeleton mock using approved baseline screenshots.
6. Manually review the first run for structural parity:
   - Same primary regions.
   - Same relative hierarchy.
   - Same major spacing rhythm.
   - Same typography scale.
   - Same action placement.
   - Same nav and footer presence.
   - Same admin shell placement.
7. Record approved differences with reason and owner.

## Icon Rendering Checks

Every icon-bearing component must be tested in at least one rendered screen and one isolated component test where possible.

Components to verify:

- `IconButton`
- `Button` with icon slots or icon labels
- `NavItem`
- `Wordmark`
- `Glyph`
- `StatusDot`
- `Avatar`
- `DifficultyBadge`
- `Badge`
- `Banner`
- `Snackbar`
- `PaginationButton`
- `Checkbox`
- `DropZone`
- Any inline SVG or icon glyph in domain templates

Required assertions:

- Icon element exists in the DOM.
- Icon has non-zero rendered width and height.
- Icon is visible and not clipped.
- Icon color matches the expected CSS token or computed color for that state.
- Icon does not render as missing fallback text, empty square, broken image, or invisible node.
- Icon remains visible in hover, focus, active, disabled, selected, and error states.
- Icon has accessible name or is hidden from assistive technology when decorative.

Suggested Playwright assertions:

```ts
await expect(icon).toBeVisible();
await expect(icon).toHaveJSProperty('clientWidth', expect.any(Number));
const box = await icon.boundingBox();
expect(box?.width).toBeGreaterThan(0);
expect(box?.height).toBeGreaterThan(0);
```

## Font and Style Loading Checks

For every major screen:

- Assert the primary heading uses the expected font family.
- Assert body text uses the expected font family.
- Assert monospace/code text uses the expected monospace font family.
- Assert key design token colors are applied to:
  - Page background.
  - Surface background.
  - Primary text.
  - Muted text.
  - Accent/action elements.
  - Borders/rules.
- Assert global styles loaded from `frontend/projects/promp-sharp/src/styles.scss`.
- Assert component library styles loaded for every rendered library component.
- Assert there are no unstyled custom elements.

Required computed-style checks:

- `font-family`
- `font-size`
- `font-weight`
- `line-height`
- `color`
- `background-color`
- `border-color`
- `box-shadow` where applicable
- `display`
- `gap`
- `grid-template-columns` for major layouts

## Responsive Layout Checks

For every screen:

- No horizontal document scroll unless expected for code blocks.
- Header/nav remains usable.
- Primary CTA remains visible.
- Cards, tables, forms, and dialogs do not overlap.
- Text does not overflow buttons, cards, chips, or table cells.
- Code blocks scroll horizontally on mobile without breaking layout.
- Admin tables degrade to a usable layout or remain horizontally scrollable inside their own container.
- Dialogs fit inside the viewport and keep primary actions visible.
- Sticky or fixed elements do not cover content.

## Interaction State Visual Checks

Every interactive control must have verified states:

- Default.
- Hover.
- Focus-visible.
- Active/pressed.
- Disabled.
- Loading, where applicable.
- Selected/current.
- Error/validation.
- Empty state.

## Visual Acceptance Rule

A screen passes visual fidelity when:

- The implementation matches the skeleton's main structure, hierarchy, spacing, typography, and action placement.
- Differences are intentional, documented, and approved.
- No missing icons, missing fonts, unstyled content, broken images, layout overlaps, or unreadable text remain.

