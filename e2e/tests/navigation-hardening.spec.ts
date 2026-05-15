import crypto from 'node:crypto';
import type { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/page-fixtures';
import { routes } from '../pages/routes';

test.describe('route navigation hardening', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('public nav and recovery links route through public screens', async ({
    homePage,
    tutorialCatalogPage,
    aboutPage,
    contactPage,
    notFoundPage,
    page,
  }) => {
    await homePage.goto();
    await homePage.expectLoaded();

    await homePage.openPrimaryNavLink(/catalog/i);
    await expect(page).toHaveURL(/\/tutorials$/);
    await tutorialCatalogPage.expectLoaded();

    await homePage.goto();
    await homePage.openPrimaryNavLink(/about/i);
    await expect(page).toHaveURL(/\/about$/);
    await aboutPage.expectLoaded();

    await aboutPage.contact();
    await expect(page).toHaveURL(/\/contact$/);
    await contactPage.expectLoaded();

    await notFoundPage.goto();
    await notFoundPage.expectLoaded();
    await notFoundPage.returnHome();
    await expect(page).toHaveURL(/\/$/);
    await homePage.expectLoaded();
  });

  test('profile links and sign-out dialog actions stay navigable', async ({
    profilePage,
    progressBookmarksPage,
    signInPage,
    page,
  }) => {
    await profilePage.goto();
    await profilePage.expectLoaded();

    await profilePage.openProgress();
    await expect(page).toHaveURL(/\/me\/progress$/);
    await progressBookmarksPage.expectLoaded();

    await profilePage.goto();
    await profilePage.openSignOutDialog();
    await profilePage.expectSignOutDialog();
    await profilePage.expectSignOutDialogKeepsFocus();
    await profilePage.dismissSignOutWithEscape();
    await expect(page).toHaveURL(/\/me\/profile$/);

    await profilePage.openSignOutDialog();
    await profilePage.expectSignOutDialog();
    await profilePage.cancelSignOut();
    await expect(page).toHaveURL(/\/me\/profile$/);

    await profilePage.openSignOutDialog();
    await profilePage.confirmSignOut();
    await expect(page).toHaveURL(/\/sign-in$/);
    await signInPage.expectLoaded();
  });

  test('admin rail links and dialog cancellation work across admin screens', async ({
    adminDashboardPage,
    adminTutorialListPage,
    categoryTagManagementPage,
    mediaLibraryPage,
    userRoleManagementPage,
    auditLogPage,
    notificationsPage,
    page,
  }) => {
    await adminDashboardPage.goto();
    await adminDashboardPage.expectLoaded();

    await adminDashboardPage.openAdminNavLink(/tutorials/i);
    await expect(page).toHaveURL(/\/admin\/tutorials$/);
    await adminTutorialListPage.expectLoaded();

    await adminTutorialListPage.openAdminNavLink(/taxonomy/i);
    await expect(page).toHaveURL(/\/admin\/taxonomy$/);
    await categoryTagManagementPage.expectLoaded();

    await categoryTagManagementPage.openAdminNavLink(/media/i);
    await expect(page).toHaveURL(/\/admin\/media$/);
    await mediaLibraryPage.expectLoaded();
    await mediaLibraryPage.openUploadDialog();
    await mediaLibraryPage.cancelUploadDialog();

    await mediaLibraryPage.openAdminNavLink(/users/i);
    await expect(page).toHaveURL(/\/admin\/users$/);
    await userRoleManagementPage.expectLoaded();

    await userRoleManagementPage.openAdminNavLink(/audit log/i);
    await expect(page).toHaveURL(/\/admin\/audit-log$/);
    await auditLogPage.expectLoaded();

    await auditLogPage.openAdminNavLink(/notifications/i);
    await expect(page).toHaveURL(routes.notifications);
    await notificationsPage.expectLoaded();
  });

  test('legacy and shorthand routes redirect to canonical destinations', async ({ page, request }) => {
    await page.goto('/catalog');
    await expect(page).toHaveURL(/\/tutorials$/);

    await page.goto('/category/dotnet');
    await expect(page).toHaveURL(/\/categories\/dotnet$/);

    await page.goto('/signin');
    await expect(page).toHaveURL(/\/sign-in$/);

    await page.goto('/oauth/callback?code=e2e-code&state=e2e-state');
    await expect(page).toHaveURL(/\/auth\/callback/);

    await page.goto('/oauth/consent');
    await expect(page).toHaveURL(/\/auth\/consent$/);

    await page.goto('/profile');
    await expect(page).toHaveURL(/\/me\/profile$/);

    await page.goto('/progress');
    await expect(page).toHaveURL(/\/me\/progress$/);

    await page.goto('/admin/audit');
    await expect(page).toHaveURL(/\/admin\/audit-log$/);

    const tutorialId = await resolveSeededTutorialId(request);
    await page.goto(`/admin/tutorials/${tutorialId}`);
    await expect(page).toHaveURL(new RegExp(`/admin/tutorials/${tutorialId}/edit$`));
  });
});

async function resolveSeededTutorialId(request: APIRequestContext): Promise<string> {
  const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
  const response = await request.get(`${apiURL}/api/v1/admin/tutorials?page=1&pageSize=1`, {
    headers: { Authorization: `Bearer ${signJwt()}` },
  });
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { items: Array<{ id: string }> };
  const tutorial = body.items[0];
  expect(tutorial).toBeTruthy();
  return tutorial.id;
}

function signJwt(): string {
  const signingKey = 'development-only-signing-key-change-with-user-secrets';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: 'prompt-sharp-dev',
      aud: 'prompt-sharp-api',
      sub: 'seed:admin',
      email: 'ada.admin@example.com',
      name: 'Ada Admin',
      role: ['User', 'Editor', 'Admin'],
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }),
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', signingKey).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}
