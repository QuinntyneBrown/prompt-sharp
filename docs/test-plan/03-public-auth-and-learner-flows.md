# 03 - Public, Auth, and Learner Flows

## Objective

Verify all public discovery, authentication, learner workspace, tutorial reading, contact, and notification flows through browser automation and direct persistence checks.

## Public Navigation Baseline

Run on every public route:

- Header renders with wordmark and nav links.
- Footer renders where expected.
- Current route is reflected in the nav state.
- All header and footer links navigate to the expected route.
- Back and forward browser navigation work.
- Page refresh preserves the correct state where applicable.
- No console errors.
- No failed API calls.
- Icons, fonts, and styles pass the visual checks in [02](./02-visual-icons-fonts-and-mock-fidelity.md).

## PUB-001 Home

Route: `/`

Steps:

1. Load the home page anonymously.
2. Verify hero content, primary CTA, secondary CTA, featured tutorial, editor pick, categories, latest tutorials, and sign-in link.
3. Click the primary catalog CTA.
4. Return to home.
5. Click a featured tutorial.
6. Return to home.
7. Click a category.
8. Return to home.
9. Click sign in.

Assertions:

- CTAs navigate to `/tutorials`, `/tutorials/:slug`, `/categories/:slug`, and `/sign-in`.
- Featured and latest tutorial data matches seeded database records.
- Visual layout matches `docs/skeletons/home.html`.
- All icons in nav, cards, badges, and CTAs render.

Database verification:

- Query `Tutorials`, `Categories`, `Tags`, and `TutorialTags` to confirm displayed records come from SQL Server.

## PUB-002 Catalog

Route: `/tutorials`

Steps:

1. Load the catalog.
2. Search for a seeded tutorial title.
3. Apply category filter.
4. Apply tag filter.
5. Apply difficulty filter.
6. Change sort order.
7. Switch layout if the UI supports grid/list mode.
8. Use pagination.
9. Reset filters.
10. Open a tutorial.

Assertions:

- URL query state updates and can be refreshed.
- Result count changes correctly.
- Empty results state renders for a query with no matches.
- Pagination disables at boundaries.
- Filter chips and reset controls work.
- Tutorial card metadata matches the API response and database.

Database verification:

- Query `Tutorials`, `Categories`, `Tags`, and `TutorialTags` for filtered result membership.

## PUB-003 Category and Tag Pages

Routes:

- `/categories/:slug`
- `/tags/:slug`
- `/category/:slug` redirect

Steps:

1. Load a seeded category route.
2. Verify category heading, summary, and tutorial list.
3. Filter or sort inside the category page.
4. Open a tutorial.
5. Load a seeded tag route.
6. Verify tag heading and tutorial list.
7. Load legacy `/category/:slug`.

Assertions:

- Category and tag results contain only associated tutorials.
- Legacy route redirects to canonical route.
- Breadcrumbs and back links work.
- Empty category or tag state is handled.

Database verification:

- Query category/tag joins and confirm displayed records match SQL Server.

## PUB-004 Search

Route: `/search`

Steps:

1. Navigate to `/search?q=azure`.
2. Verify search input contains `azure`.
3. Submit a different query.
4. Open a result.
5. Use browser back to return to the same query.
6. Submit a no-result query.

Assertions:

- Query is preserved in URL and input.
- Results match search query.
- No-result state renders with recovery actions.
- Result links navigate to tutorial detail.

Database verification:

- Query `Tutorials` for matching title, summary, category, and tag content.

## PUB-005 Tutorial Detail and Reader

Route: `/tutorials/:slug`

Steps:

1. Load a seeded tutorial with multiple steps.
2. Verify hero metadata, category, tags, difficulty, and estimated time.
3. Use table of contents to jump between steps.
4. Copy a code block.
5. Complete a step.
6. Continue to next step.
7. Navigate previous and next steps.
8. Bookmark the tutorial.
9. Open related tutorial/category/tag links.
10. Refresh the page.

Assertions:

- Step order matches database ordering.
- Code block uses monospace font and mobile horizontal scroll.
- Copy button works and shows feedback.
- Completion state persists after refresh.
- Bookmark state persists after refresh.
- Related navigation works.
- Visual layout matches `docs/skeletons/tutorial-detail.html`.

Database verification:

- `TutorialProgress` row is created or updated for the authenticated user.
- `Bookmarks` row is created for the authenticated user.
- Tutorial, category, tag, and step data matches the database.

## PUB-006 About and Contact

Routes:

- `/about`
- `/contact`

Steps:

1. Load about page.
2. Verify company context and public links.
3. Navigate to contact.
4. Submit empty form.
5. Submit invalid email.
6. Submit valid name, email, subject, and message.
7. Refresh contact page.

Assertions:

- Validation messages appear and block invalid submission.
- Valid submission shows success feedback.
- Form does not double-submit on repeated clicks.
- Contact page remains styled after validation and success states.

Database verification:

- `ContactSubmissions` contains the submitted values.
- `CreatedUtc` or equivalent timestamp is populated.
- Invalid attempts do not create rows.

## AUTH-001 Sign In

Route: `/sign-in`

Steps:

1. Load sign-in anonymously.
2. Verify provider buttons are visible.
3. Click each OAuth provider button in a controlled test context.
4. Toggle remember me.
5. Submit fallback credentials empty.
6. Submit invalid fallback credentials.

Assertions:

- Provider buttons initiate expected redirect or request.
- Remember-me state changes visually and logically.
- Invalid fallback path shows validation without granting access.
- No token is created for invalid auth.
- Visual layout matches `docs/skeletons/signin.html`.

Database verification:

- No new user is created for invalid credentials.
- On valid token callback tests, the user is created or updated through `EnsureUserExistsCommand`.

## AUTH-002 OAuth Callback and Consent

Routes:

- `/auth/callback`
- `/auth/consent`

Steps:

1. Load callback success state.
2. Load callback provider error state.
3. Load callback missing-code state.
4. Load consent screen.
5. Accept consent.
6. Deny consent.

Assertions:

- Processing, success, and error states render.
- Errors provide recovery actions.
- Consent accept continues the flow.
- Consent deny returns to a safe public route.

Database verification:

- Successful callback creates or updates `Users`.
- Failed callback does not create a user.

## AUTH-003 Access Denied and Session Expired

Routes and dialogs:

- `/access-denied`
- Session expired dialog

Steps:

1. Access admin route as learner.
2. Verify access-denied route or state.
3. Request access if the UI supports it.
4. Use expired-token storage state.
5. Trigger an authenticated request.
6. Verify session-expired dialog.
7. Click sign in again.

Assertions:

- Missing role is explained.
- Request access action works or is explicitly disabled with reason.
- Expired session clears unsafe state and redirects to sign in.
- Dialog focus and close behavior work.

Database verification:

- Access request creates the expected record if implemented.
- Expired-token flow does not mutate protected data.

## USER-001 Profile

Route: `/me/profile`

Steps:

1. Load as authenticated learner.
2. Verify identity, roles, avatar, email, and saved learning summary.
3. Open links to progress and bookmarks.
4. Open sign-out dialog.
5. Cancel sign out.
6. Open sign-out dialog again.
7. Confirm sign out.

Assertions:

- Identity matches token and database user.
- Links navigate correctly.
- Sign-out cancel leaves user authenticated.
- Sign-out confirm clears access token and returns to sign in.

Database verification:

- `Users` row exists for the authenticated subject.
- No unintended user mutation occurs from viewing the page.

## USER-002 Progress and Bookmarks

Route: `/me/progress`

Steps:

1. Create progress through tutorial detail.
2. Create bookmark through tutorial detail.
3. Load progress page.
4. Resume a tutorial.
5. Remove a bookmark.
6. Refresh the page.
7. Verify empty states after removing all saved items.

Assertions:

- Progress list reflects completed and in-progress tutorials.
- Resume opens correct tutorial and step.
- Bookmark removal updates UI and persists after refresh.
- Empty states are styled and actionable.

Database verification:

- `TutorialProgress` contains expected completion state and step position.
- `Bookmarks` row is deleted after removal.

## USER-003 Notifications

Route: `/notifications`

Steps:

1. Load notification gallery.
2. Verify every notification tone.
3. Trigger close/dismiss controls.
4. Trigger any action link or CTA.

Assertions:

- Banner and snackbar variants render with correct icons and colors.
- Dismiss removes only the intended item.
- Actions navigate or execute expected behavior.

Database verification:

- If notification dismissal is persisted, verify the persistence table.
- If not persisted, document as UI-only behavior in the test evidence.

## PUB-007 Error Page

Route: unknown path such as `/not-a-real-page`

Steps:

1. Navigate to an unknown path.
2. Verify 404/error content.
3. Click home recovery action.
4. Click catalog recovery action if present.

Assertions:

- Error page is styled, not a blank router state.
- Recovery actions navigate correctly.
- No unhandled exception appears in console.

