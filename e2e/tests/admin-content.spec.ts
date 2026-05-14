import { test, expect } from '../fixtures/page-fixtures';
import { alternateTutorial, mediaAsset, tutorial } from '../fixtures/test-data';
import { routes } from '../pages/routes';

test.describe('admin content management', () => {
  test('dashboard summarizes publishing operations and links to core admin workflows', async ({
    adminDashboardPage,
    page,
  }) => {
    await adminDashboardPage.goto();
    await adminDashboardPage.expectLoaded();
    await adminDashboardPage.expectOperationalSummary();

    await adminDashboardPage.createTutorial();
    await expect(page).toHaveURL(/\/admin\/tutorials\/new$/);

    await adminDashboardPage.goto();
    await adminDashboardPage.openTutorials();
    await expect(page).toHaveURL(/\/admin\/tutorials$/);

    await adminDashboardPage.goto();
    await adminDashboardPage.openAuditLog();
    await expect(page).toHaveURL(/\/admin\/audit-log$/);
  });

  test('tutorial list searches, filters, and supports publish, feature, editor-pick, and delete actions', async ({
    adminTutorialListPage,
  }) => {
    await adminTutorialListPage.goto();
    await adminTutorialListPage.expectLoaded();
    await adminTutorialListPage.expectTableReady();

    await adminTutorialListPage.searchFor('clean architecture');
    await adminTutorialListPage.filterByStatus('Draft');
    await adminTutorialListPage.publishTutorial(/clean architecture/i);
    await adminTutorialListPage.featureTutorial(/clean architecture/i);
    await adminTutorialListPage.setEditorsPick(/clean architecture/i);
    await adminTutorialListPage.deleteTutorial(/clean architecture/i);
  });

  test('tutorial editor validates required data, saves drafts, previews, adds steps, and publishes', async ({
    tutorialEditorPage,
    page,
  }) => {
    await tutorialEditorPage.goto(routes.tutorialEditorNew);
    await tutorialEditorPage.expectLoaded();

    await tutorialEditorPage.publish();
    await tutorialEditorPage.expectValidationSummary();

    await tutorialEditorPage.fillBasics({
      title: alternateTutorial.title,
      slug: alternateTutorial.slug,
      summary: tutorial.summary,
      category: alternateTutorial.category,
      difficulty: alternateTutorial.difficulty,
      estimatedMinutes: tutorial.estimatedMinutes,
    });
    await tutorialEditorPage.addStep();
    await expect(tutorialEditorPage.stepRows().first()).toBeVisible();
    await tutorialEditorPage.saveDraft();
    await expect(page.getByRole('status')).toContainText(/saved/i);

    await tutorialEditorPage.preview();
    await expect(page).toHaveURL(/preview=true|\/preview/);

    await tutorialEditorPage.publish();
    await expect(page.getByRole('status')).toContainText(/published/i);
  });

  test('step editor edits markdown, code, media, ordering, and preview', async ({ stepEditorPage, page }) => {
    await stepEditorPage.goto(routes.stepEditor());
    await stepEditorPage.expectLoaded();

    await stepEditorPage.fillStep(tutorial.step);
    await stepEditorPage.attachImage(mediaAsset.path);
    await stepEditorPage.moveUp();
    await stepEditorPage.expectPreview();
    await stepEditorPage.save();
    await expect(page.getByRole('status')).toContainText(/step saved|saved/i);
  });

  test('taxonomy management creates and lists categories and tags', async ({ categoryTagManagementPage }) => {
    await categoryTagManagementPage.goto();
    await categoryTagManagementPage.expectLoaded();
    await categoryTagManagementPage.expectTaxonomyTables();

    await categoryTagManagementPage.createCategory('Azure', 'azure');
    await categoryTagManagementPage.createTag('Clean Architecture', 'clean-architecture');
  });

  test('media library uploads, searches, copies URLs, and deletes assets', async ({ mediaLibraryPage, page }) => {
    await mediaLibraryPage.goto();
    await mediaLibraryPage.expectLoaded();
    await mediaLibraryPage.expectLibraryReady();

    await mediaLibraryPage.upload(mediaAsset.path);
    await expect(page.getByRole('status')).toContainText(/uploaded/i);

    await mediaLibraryPage.searchFor(mediaAsset.fileName);
    await mediaLibraryPage.copyUrl(mediaAsset.fileName);
    await expect(page.getByRole('status')).toContainText(/copied/i);

    await mediaLibraryPage.delete(mediaAsset.fileName);
    await expect(page.getByRole('status')).toContainText(/deleted/i);
  });
});
