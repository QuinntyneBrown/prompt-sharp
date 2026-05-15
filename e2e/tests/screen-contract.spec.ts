import crypto from 'node:crypto';
import type { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/page-fixtures';
import { routes } from '../pages/routes';

test.describe('screen contract', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('public screens expose their primary headings', async ({
    homePage,
    tutorialCatalogPage,
    tutorialDetailPage,
    categoryPage,
    tagPage,
    searchResultsPage,
    aboutPage,
    contactPage,
    notFoundPage,
  }) => {
    await homePage.goto();
    await homePage.expectLoaded();

    await tutorialCatalogPage.goto();
    await tutorialCatalogPage.expectLoaded();

    await tutorialDetailPage.goto(routes.tutorialDetail());
    await tutorialDetailPage.expectLoaded();

    await categoryPage.goto(routes.category());
    await categoryPage.expectLoaded();

    await tagPage.goto(routes.tag());
    await tagPage.expectLoaded();

    await searchResultsPage.goto(routes.search());
    await searchResultsPage.expectLoaded();

    await aboutPage.goto();
    await aboutPage.expectLoaded();

    await contactPage.goto();
    await contactPage.expectLoaded();

    await notFoundPage.goto();
    await notFoundPage.expectLoaded();
  });

  test('auth and user screens expose their primary headings', async ({
    signInPage,
    oauthCallbackPage,
    accessDeniedPage,
    profilePage,
    progressBookmarksPage,
    page,
  }) => {
    await signInPage.goto();
    await signInPage.expectLoaded();

    await oauthCallbackPage.goto(routes.oauthCallback);
    await oauthCallbackPage.expectLoaded();

    await page.goto('/auth/consent');
    await expect(page.getByRole('heading', { name: /wants to access/i, level: 1 })).toBeVisible();

    await accessDeniedPage.goto();
    await accessDeniedPage.expectLoaded();

    await profilePage.goto();
    await profilePage.expectLoaded();

    await progressBookmarksPage.goto();
    await progressBookmarksPage.expectLoaded();
  });

  test('admin screens expose their primary headings', async ({
    adminDashboardPage,
    adminTutorialListPage,
    tutorialEditorPage,
    stepEditorPage,
    categoryTagManagementPage,
    mediaLibraryPage,
    userRoleManagementPage,
    auditLogPage,
    notificationsPage,
    request,
  }) => {
    const seededTutorial = await resolveSeededTutorial(request);

    await adminDashboardPage.goto();
    await adminDashboardPage.expectLoaded();

    await adminTutorialListPage.goto();
    await adminTutorialListPage.expectLoaded();

    await tutorialEditorPage.goto();
    await tutorialEditorPage.expectLoaded();

    await tutorialEditorPage.goto(routes.tutorialEditorEdit(seededTutorial.id));
    await tutorialEditorPage.expectLoaded();

    await stepEditorPage.goto(routes.stepEditor(seededTutorial.id, seededTutorial.stepId));
    await stepEditorPage.expectLoaded();

    await categoryTagManagementPage.goto();
    await categoryTagManagementPage.expectLoaded();

    await mediaLibraryPage.goto();
    await mediaLibraryPage.expectLoaded();

    await userRoleManagementPage.goto();
    await userRoleManagementPage.expectLoaded();

    await auditLogPage.goto();
    await auditLogPage.expectLoaded();

    await notificationsPage.goto();
    await notificationsPage.expectLoaded();
  });
});

async function resolveSeededTutorial(
  request: APIRequestContext,
): Promise<{ id: string; stepId: string }> {
  const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
  const headers = { Authorization: `Bearer ${signJwt()}` };
  const listResponse = await request.get(`${apiURL}/api/v1/admin/tutorials?page=1&pageSize=50`, { headers });
  expect(listResponse.ok()).toBeTruthy();
  const list = (await listResponse.json()) as { items: Array<{ id: string; stepCount: number }> };
  const tutorial = list.items.find((item) => item.stepCount > 0) ?? list.items[0];
  expect(tutorial).toBeTruthy();

  const detailResponse = await request.get(`${apiURL}/api/v1/admin/tutorials/${tutorial.id}`, { headers });
  expect(detailResponse.ok()).toBeTruthy();
  const detail = (await detailResponse.json()) as { steps: Array<{ id: string }> };
  const step = detail.steps[0];
  expect(step).toBeTruthy();
  return { id: tutorial.id, stepId: step.id };
}

function signJwt(): string {
  const signingKey = 'development-only-signing-key-change-with-user-secrets';
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: 'prompt-sharp-dev',
      aud: 'prompt-sharp-api',
      sub: 'seed:admin',
      email: 'ada.admin@example.com',
      name: 'Ada Admin',
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
