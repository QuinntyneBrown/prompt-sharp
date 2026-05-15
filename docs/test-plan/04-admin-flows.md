# 04 - Admin Flows

## Objective

Verify every admin workflow end to end, including navigation, dialogs, validation, persistence, destructive confirmations, and audit visibility.

## Admin Baseline

Run on every admin route:

- Admin shell renders nav rail and topbar.
- Current route is highlighted.
- Admin nav links work.
- Topbar actions work.
- Browser back and forward navigation work.
- Direct route load works.
- Unauthorized users cannot access the screen.
- Every screen passes icon, font, style, and visual checks.
- Every mutation is verified directly in SQL Server.

## ADM-001 Dashboard

Route: `/admin`

Steps:

1. Load dashboard as admin.
2. Verify KPI cards.
3. Verify recent activity.
4. Verify tutorial list mini or workflow shortcuts.
5. Click each core workflow link.
6. Return to dashboard between links.

Assertions:

- Metrics match database counts.
- Recent activity matches latest `AuditEvents`.
- Workflow links open tutorials, media, taxonomy, users, and audit log.
- Visual layout matches `docs/skeletons/admin-dashboard.html`.

Database verification:

- Count `Tutorials`, `Users`, `Media`, `Categories`, `Tags`, and `AuditEvents` as needed for displayed metrics.

## ADM-002 Tutorial List

Route: `/admin/tutorials`

Steps:

1. Load tutorial list as admin.
2. Search by title.
3. Filter by status.
4. Filter by category.
5. Filter by featured/editor pick if supported.
6. Sort table columns if supported.
7. Open create tutorial.
8. Open edit for an existing tutorial.
9. Open publish dialog for draft.
10. Confirm publish.
11. Toggle featured.
12. Toggle editor pick.
13. Open delete dialog.
14. Cancel delete.
15. Open delete dialog again.
16. Confirm delete on isolated test record.

Assertions:

- Search and filters update the visible list and URL/state where expected.
- Create and edit routes open.
- Publish, feature, editor pick, and delete actions update the row.
- Destructive delete requires confirmation.
- Cancel actions do not mutate data.
- Visual layout matches `docs/skeletons/admin-tutorial-list.html`.

Database verification:

- `Tutorials.PublishedUtc` or published status changes after publish.
- Featured flag changes after feature action.
- Editor pick flag changes after editor-pick action.
- Deleted tutorial is removed or marked deleted according to domain behavior.
- `AuditEvents` records each mutation.

## ADM-003 Tutorial Create and Edit

Routes:

- `/admin/tutorials/new`
- `/admin/tutorials/:id/edit`

Steps:

1. Open new tutorial editor.
2. Try to save empty form.
3. Enter title, slug, summary, category, tags, difficulty, estimated minutes, and hero/media values.
4. Save draft.
5. Refresh page.
6. Reopen saved draft from tutorial list.
7. Edit metadata.
8. Add step.
9. Edit step title, body, code block, and media reference.
10. Reorder steps.
11. Preview tutorial.
12. Attempt to leave with unsaved changes.
13. Cancel unsaved-changes dialog.
14. Attempt to leave again.
15. Confirm discard.
16. Reopen and verify persisted version.
17. Publish.

Assertions:

- Required validation blocks save.
- Draft save creates tutorial.
- Refresh and reopen show saved data.
- Metadata edits persist.
- Step add/edit/reorder persists.
- Preview reflects unsaved current editor content where expected.
- Unsaved changes dialog opens, traps focus, cancels, and confirms.
- Publish blocks incomplete required data and succeeds after completion.
- Visual layout matches `docs/skeletons/admin-tutorial-editor.html`.

Database verification:

- `Tutorials` row contains saved metadata.
- `TutorialSteps` rows contain saved titles, bodies, code, media references, and order.
- `TutorialTags` rows match selected tags.
- `AuditEvents` contains create, update, step update, and publish events.

## ADM-004 Specific Step Route

Route: `/admin/tutorials/:id/steps/:stepId`

Steps:

1. Open a tutorial with multiple steps.
2. Navigate directly to a specific step route.
3. Verify the requested step is selected.
4. Edit only that step.
5. Save.
6. Navigate to another step.
7. Return to edited step.

Assertions:

- Route selects correct step.
- Save changes only the intended step.
- Step selection updates URL where expected.

Database verification:

- Only the edited `TutorialSteps` row changes.
- Step order remains unchanged unless explicitly reordered.

## ADM-005 Publish Dialog

Dialog skeleton: `docs/skeletons/admin-publish-dialog.html`

Steps:

1. Open publish dialog from tutorial list and editor.
2. Verify title and tutorial metadata.
3. Confirm publish.
4. Repeat with an invalid/incomplete tutorial.
5. Cancel dialog.

Assertions:

- Dialog focus starts in dialog.
- Escape or cancel closes without mutation.
- Confirm publishes complete tutorial.
- Incomplete tutorial shows validation or API error.

Database verification:

- Publish changes only after confirm.
- No mutation occurs after cancel.
- `AuditEvents` records successful publish.

## ADM-006 Taxonomy

Route: `/admin/taxonomy`

Steps:

1. Load taxonomy page.
2. Switch between categories and tags if controls exist.
3. Search taxonomy records.
4. Open create category dialog.
5. Submit empty category.
6. Submit valid category.
7. Edit category name, slug, and description.
8. Cancel an edit.
9. Delete isolated category.
10. Create tag.
11. Edit tag.
12. Delete isolated tag.

Assertions:

- Search filters category/tag lists.
- Create/edit validation works.
- Slug behavior is correct.
- Cancel does not mutate data.
- Delete requires confirmation where applicable.
- Visual layout matches `docs/skeletons/admin-categories.html`.

Database verification:

- `Categories` and `Tags` contain created and edited values.
- Deleted records are removed or soft-deleted according to domain behavior.
- `AuditEvents` records create, update, and delete events.

## ADM-007 Media Library

Route: `/admin/media`

Steps:

1. Load media page.
2. Search existing media.
3. Filter by media type if supported.
4. Open upload dialog.
5. Attempt invalid file upload.
6. Upload valid image file.
7. Upload valid SVG file.
8. Verify thumbnail renders.
9. Copy media URL.
10. Select media item.
11. Delete isolated media item.
12. Attempt to delete media currently referenced by a tutorial.

Assertions:

- Upload dialog opens and validates file type/size.
- Successful upload creates visible media card.
- Thumbnail is not broken.
- Copy URL writes expected URL to clipboard.
- Delete requires confirmation.
- Referenced media delete is blocked or handled according to domain rules.
- Visual layout matches `docs/skeletons/admin-media.html`.

Database verification:

- `Media` row is created with file name, content type, URL/path, size, and timestamp.
- Uploaded file exists in configured media storage.
- Deleted media row is removed or marked deleted.
- Referenced media constraints are enforced.
- `AuditEvents` records upload and delete.

## ADM-008 Users and Roles

Route: `/admin/users`

Steps:

1. Load users page.
2. Search by user email.
3. Open user invite dialog.
4. Submit invalid email.
5. Submit valid invite.
6. Change a user's roles.
7. Remove a role.
8. Attempt to remove the last admin role from the only admin.
9. Cancel role changes if the UI supports staged edits.

Assertions:

- Search narrows users.
- Invite validates email and persists pending invite state if implemented.
- Role chips update after save.
- Admin self-lockout is blocked.
- Cancel does not mutate data.
- Visual layout matches `docs/skeletons/admin-users.html`.

Database verification:

- `Users`, `Roles`, and `UserRoles` reflect saved role changes.
- Invite persistence table or pending user state is updated if implemented.
- No mutation occurs after canceled operations.
- `AuditEvents` records role updates and invitations if implemented.

## ADM-009 Audit Log

Route: `/admin/audit-log`

Steps:

1. Load audit log.
2. Filter by actor.
3. Filter by action.
4. Filter by date or entity if supported.
5. Open event details.
6. Clear filters.
7. Navigate pages if paginated.

Assertions:

- Filters match database query results.
- Event details include actor, action, entity, timestamp, and payload summary.
- Clearing filters restores full result set.
- Visual layout matches `docs/skeletons/admin-audit-log.html`.

Database verification:

- Query `AuditEvents` for filtered values and compare with UI rows.

## ADM-010 Admin Navigation and Authorization

Steps:

1. Visit every admin route as admin.
2. Visit every admin route as learner.
3. Visit every admin route anonymously.
4. Click every nav rail item.
5. Use browser back and forward across admin routes.

Assertions:

- Admin can access every admin route.
- Learner and anonymous users are blocked and routed to sign-in or access-denied.
- Nav selected state follows route.
- No admin data is visible before authorization completes.

Database verification:

- Unauthorized attempts do not mutate data.

## ADM-011 Dialog Inventory

Exercise all dialogs from the UI path that opens them:

- Confirm delete dialog.
- Category dialog.
- Media upload dialog.
- Publish dialog.
- Tutorial dialog.
- Unsaved changes dialog.
- User invite dialog.
- Session expired dialog.
- Sign out dialog.

For every dialog:

- Opens from the expected trigger.
- Has accessible title.
- Focus moves inside.
- Escape/cancel behavior works.
- Primary action works.
- Invalid state blocks primary action.
- Overlay click behavior is intentional.
- Closing returns focus to trigger.
- Mobile viewport remains usable.

