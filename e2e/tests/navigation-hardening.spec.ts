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
});
