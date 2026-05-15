import crypto from 'node:crypto';
import type { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/page-fixtures';
import { alternateTutorial, mediaAsset, tutorial } from '../fixtures/test-data';
import { routes } from '../pages/routes';

test.describe('admin content management', () => {
  test('dashboard summarizes publishing operations and links to core admin workflows', async ({
    adminDashboardPage,
    page,
  }) => {
    await adminDashboardPage.gotoAndWaitForSummary();
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
    request,
  }) => {
    await adminTutorialListPage.goto();
    await adminTutorialListPage.expectLoaded();
    await adminTutorialListPage.expectTableReady();

    await adminTutorialListPage.searchFor('clean architecture');
    await adminTutorialListPage.filterByStatus('Draft');
    await adminTutorialListPage.cancelPublishTutorial(/clean architecture/i);
    await adminTutorialListPage.publishTutorial(/clean architecture/i);
    await adminTutorialListPage.featureTutorial(/clean architecture/i);
    await adminTutorialListPage.setEditorsPick(/clean architecture/i);

    const disposable = await createDisposableTutorial(request);
    await adminTutorialListPage.goto();
    await adminTutorialListPage.searchFor(disposable.title);
    await adminTutorialListPage.deleteTutorial(new RegExp(disposable.title, 'i'));
  });

  test('tutorial editor validates required data, saves drafts, previews, adds steps, and publishes', async ({
    tutorialEditorPage,
    page,
  }) => {
    await tutorialEditorPage.goto(routes.tutorialEditorNew);
    await tutorialEditorPage.expectLoaded();

    await tutorialEditorPage.openPublishDialog();
    await tutorialEditorPage.expectValidationSummary();

    const suffix = Date.now().toString(36);
    await tutorialEditorPage.fillBasics({
      title: `${alternateTutorial.title} ${suffix}`,
      slug: `${alternateTutorial.slug}-${suffix}`,
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

    await tutorialEditorPage.openPublishDialog();
    await tutorialEditorPage.expectPublishDialog();
    await tutorialEditorPage.confirmPublish();
    await expect(page.getByRole('status')).toContainText(/published/i);
  });

  test('tutorial editor protects unsaved changes before leaving', async ({ tutorialEditorPage, page }) => {
    await tutorialEditorPage.goto(routes.tutorialEditorNew);
    await tutorialEditorPage.expectLoaded();

    await tutorialEditorPage.changeTitle(`Unsaved ${Date.now().toString(36)}`);
    await tutorialEditorPage.leaveViaTutorialsNav();
    await tutorialEditorPage.expectUnsavedChangesDialog();
    await expect(page).toHaveURL(/\/admin\/tutorials\/new$/);

    await tutorialEditorPage.keepEditing();
    await tutorialEditorPage.leaveViaTutorialsNav();
    await tutorialEditorPage.discardChanges();
    await expect(page).toHaveURL(/\/admin\/tutorials$/);
  });

  test('step editor edits markdown, code, media, ordering, and preview', async ({
    stepEditorPage,
    page,
    request,
  }) => {
    const editable = await createDisposableTutorialWithSteps(request);
    await stepEditorPage.goto(routes.stepEditor(editable.id, editable.stepId));
    await stepEditorPage.expectLoaded();

    await stepEditorPage.fillStep(tutorial.step);
    await stepEditorPage.attachImage(mediaAsset.path);
    await stepEditorPage.moveUp();
    await stepEditorPage.expectPreview();
    await stepEditorPage.save();
    await expect(page.getByRole('status')).toContainText(/step saved|saved/i);
    await deleteTutorialById(request, editable.id);
  });

  test('taxonomy management creates, edits, and deletes categories and tags', async ({
    categoryTagManagementPage,
    page,
  }) => {
    await categoryTagManagementPage.goto();
    await categoryTagManagementPage.expectLoaded();
    await categoryTagManagementPage.expectTaxonomyTables();

    const suffix = Date.now().toString(36);
    const categoryName = `Playwright Category ${suffix}`;
    const editedCategoryName = `Playwright Category Edited ${suffix}`;
    const tagName = `Playwright Tag ${suffix}`;
    const editedTagName = `Playwright Tag Edited ${suffix}`;

    await categoryTagManagementPage.createCategory(categoryName, `playwright-category-${suffix}`);
    await expect(page.getByRole('status')).toContainText(/category saved/i);
    await categoryTagManagementPage.editCategory(categoryName, editedCategoryName, `playwright-category-edited-${suffix}`);
    await expect(page.getByRole('status')).toContainText(/category saved/i);
    await categoryTagManagementPage.deleteCategory(editedCategoryName);
    await expect(page.getByRole('status')).toContainText(/category deleted/i);

    await categoryTagManagementPage.createTag(tagName, `playwright-tag-${suffix}`);
    await expect(page.getByRole('status')).toContainText(/tag saved/i);
    await categoryTagManagementPage.editTag(tagName, editedTagName, `playwright-tag-edited-${suffix}`);
    await expect(page.getByRole('status')).toContainText(/tag saved/i);
    await categoryTagManagementPage.deleteTag(editedTagName);
    await expect(page.getByRole('status')).toContainText(/tag deleted/i);
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

async function createDisposableTutorial(request: APIRequestContext): Promise<{ id: string; title: string }> {
  const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
  const headers = { Authorization: `Bearer ${signJwt()}` };
  const categoriesResponse = await request.get(`${apiURL}/api/v1/categories`, { headers });
  expect(categoriesResponse.ok()).toBeTruthy();
  const categories = (await categoriesResponse.json()) as Array<{ id: string }>;
  const suffix = Date.now().toString(36);
  const title = `Delete me ${suffix}`;

  const createResponse = await request.post(`${apiURL}/api/v1/admin/tutorials`, {
    headers,
    data: {
      slug: `delete-me-${suffix}`,
      title,
      summary: 'Disposable tutorial created by e2e to verify real delete.',
      difficultyLevel: 'beginner',
      estimatedMinutes: 5,
      categoryId: categories[0].id,
      tagIds: [],
    },
  });
  expect(createResponse.ok()).toBeTruthy();
  const tutorial = (await createResponse.json()) as { id: string };
  return { id: tutorial.id, title };
}

async function createDisposableTutorialWithSteps(
  request: APIRequestContext,
): Promise<{ id: string; stepId: string }> {
  const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
  const headers = { Authorization: `Bearer ${signJwt()}` };
  const tutorial = await createDisposableTutorial(request);
  const stepsResponse = await request.put(`${apiURL}/api/v1/admin/tutorials/${tutorial.id}/steps`, {
    headers,
    data: [
      {
        title: 'First disposable step',
        bodyMarkdown: 'This step exists so ordering can be tested.',
        codeSnippet: 'echo first',
        codeLanguage: 'Bash',
        imageMediaId: null,
      },
      {
        title: 'Second disposable step',
        bodyMarkdown: 'This step will be edited by e2e.',
        codeSnippet: 'echo second',
        codeLanguage: 'Bash',
        imageMediaId: null,
      },
    ],
  });
  expect(stepsResponse.ok()).toBeTruthy();
  const detail = (await stepsResponse.json()) as { steps: Array<{ id: string }> };
  return { id: tutorial.id, stepId: detail.steps[1].id };
}

async function deleteTutorialById(request: APIRequestContext, id: string): Promise<void> {
  const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
  const response = await request.delete(`${apiURL}/api/v1/admin/tutorials/${id}`, {
    headers: { Authorization: `Bearer ${signJwt()}` },
  });
  expect(response.status()).toBe(204);
}

function signJwt(): string {
  const signingKey = 'development-only-signing-key-change-with-user-secrets';
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: 'prompt-sharp-dev',
      aud: 'prompt-sharp-api',
      sub: 'e2e:admin',
      email: 'alex.learner@example.com',
      name: 'Alex Learner',
      role: ['User', 'Editor', 'Admin'],
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }),
  );
  const signature = crypto.createHmac('sha256', signingKey).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function base64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}
