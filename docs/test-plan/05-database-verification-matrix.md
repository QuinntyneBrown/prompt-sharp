# 05 - Database Verification Matrix

## Objective

Every data-changing flow must be proven at the database layer, not just through UI text or API responses.

Use direct SQL Server queries from the test runner, a verification script, or a controlled admin-only verification endpoint that is disabled outside test environments. Prefer direct SQL queries for final evidence.

## Tables Under Test

| Table or DbSet | Verified by flows |
| --- | --- |
| `Tutorials` | Catalog display, tutorial detail, admin tutorial create/edit/publish/feature/editor-pick/delete |
| `TutorialSteps` | Tutorial reader, admin step create/edit/reorder |
| `Categories` | Catalog/category pages, taxonomy category CRUD |
| `Tags` | Tag pages, taxonomy tag CRUD |
| `TutorialTags` | Tutorial metadata, category/tag filtering, editor tag assignment |
| `Media` | Tutorial media display, media upload/search/delete |
| `Users` | Sign-in callback, profile, users admin |
| `Roles` | Authorization and role management |
| `UserRoles` | Admin user role updates and access checks |
| `Bookmarks` | Bookmark add/remove and progress page |
| `TutorialProgress` | Step completion and resume |
| `ContactSubmissions` | Contact form |
| `AuditEvents` | Admin audit log and mutation traceability |

## Verification Rules

- Query by stable natural keys such as slug, title, email, or generated unique suffix.
- Assert before and after state for every mutation.
- For deletes, verify either hard delete or documented soft-delete state.
- For canceled dialogs, assert the database remains unchanged.
- For validation failures, assert no row is created or updated.
- For audit-required actions, assert corresponding audit row exists.
- For timestamped records, assert timestamp is within the test execution window.
- For user-owned data, assert the correct user ID owns the created row.

## Flow-to-Database Matrix

| Flow ID | Action | Required database assertion |
| --- | --- | --- |
| PUB-001 | Home displays featured/latest content | Displayed tutorial IDs exist in `Tutorials`; category/tag data exists in join tables |
| PUB-002 | Catalog filters/searches | UI result IDs match SQL query for search/filter criteria |
| PUB-003 | Category/tag pages | Result IDs are joined to selected `Categories` or `Tags` |
| PUB-004 | Search | Results match SQL search expectations |
| PUB-005 | Complete step | `TutorialProgress` row exists with expected tutorial, user, step, and completion state |
| PUB-005 | Bookmark tutorial | `Bookmarks` row exists for user and tutorial |
| PUB-006 | Submit contact form | `ContactSubmissions` row contains submitted name, email, subject, message, timestamp |
| AUTH-002 | Successful callback | `Users` row exists or updated for token subject/email |
| AUTH-002 | Failed callback | No new `Users` row is created |
| USER-002 | Remove bookmark | `Bookmarks` row no longer exists |
| ADM-002 | Publish tutorial | `Tutorials` publish state changes and `AuditEvents` records publish |
| ADM-002 | Feature tutorial | `Tutorials` featured state changes and audit is recorded |
| ADM-002 | Editor pick tutorial | `Tutorials` editor-pick state changes and audit is recorded |
| ADM-002 | Delete tutorial | `Tutorials` row is removed or deleted state changes; audit is recorded |
| ADM-003 | Create draft | `Tutorials` row exists with draft state |
| ADM-003 | Edit metadata | `Tutorials` row has updated title, slug, summary, difficulty, category |
| ADM-003 | Edit tags | `TutorialTags` rows match selected tags |
| ADM-003 | Add step | `TutorialSteps` row exists with expected order |
| ADM-003 | Reorder steps | `TutorialSteps` order values match UI order |
| ADM-006 | Create category | `Categories` row exists |
| ADM-006 | Edit category | `Categories` row has updated fields |
| ADM-006 | Delete category | `Categories` row is removed or deleted state changes |
| ADM-006 | Create tag | `Tags` row exists |
| ADM-006 | Edit tag | `Tags` row has updated fields |
| ADM-006 | Delete tag | `Tags` row is removed or deleted state changes |
| ADM-007 | Upload media | `Media` row exists and file exists in media storage |
| ADM-007 | Delete media | `Media` row removed or deleted state changes; file cleanup behavior is verified |
| ADM-008 | Invite user | Pending invite state or user row exists if feature is implemented |
| ADM-008 | Change roles | `UserRoles` rows exactly match selected role set |
| ADM-009 | Filter audit log | UI rows match `AuditEvents` query |

## Example SQL Assertions

Adjust column names to the actual EF migration schema before implementing automated checks.

```sql
SELECT Id, Slug, Title, PublishedUtc, IsFeatured, IsEditorsPick
FROM Tutorials
WHERE Slug = @slug;
```

```sql
SELECT StepNumber, Title
FROM TutorialSteps
WHERE TutorialId = @tutorialId
ORDER BY StepNumber;
```

```sql
SELECT b.Id
FROM Bookmarks b
JOIN Users u ON u.Id = b.UserId
WHERE u.Email = @email
  AND b.TutorialId = @tutorialId;
```

```sql
SELECT CompletedStepIds, CurrentStepId, UpdatedUtc
FROM TutorialProgress
WHERE UserId = @userId
  AND TutorialId = @tutorialId;
```

```sql
SELECT Name, Email, Subject, Message, CreatedUtc
FROM ContactSubmissions
WHERE Email = @email
ORDER BY CreatedUtc DESC;
```

```sql
SELECT ActorUserId, Action, EntityType, EntityId, OccurredUtc
FROM AuditEvents
WHERE EntityId = @entityId
ORDER BY OccurredUtc DESC;
```

## Negative Database Checks

For every validation failure:

- Capture row count before submit.
- Submit invalid UI/API request.
- Capture row count after submit.
- Assert counts and existing row values did not change.

For every canceled dialog:

- Capture target row before opening dialog.
- Open dialog.
- Change form fields where possible.
- Cancel or close.
- Query target row.
- Assert no change.

For every unauthorized request:

- Capture protected table counts.
- Attempt the action as anonymous or learner.
- Assert HTTP unauthorized/forbidden state.
- Query protected table counts.
- Assert no changes.

## Database Evidence Format

Each final test report must include:

- Flow ID.
- Record key used for lookup.
- SQL query or verification helper name.
- Before state.
- After state.
- Pass/fail result.
- Timestamp.
- Test run ID.

