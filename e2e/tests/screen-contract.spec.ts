import { test } from '../fixtures/page-fixtures';
import { routes } from '../pages/routes';

test.describe('screen contract', () => {
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
  }) => {
    await signInPage.goto();
    await signInPage.expectLoaded();

    await oauthCallbackPage.goto(routes.oauthCallback);
    await oauthCallbackPage.expectLoaded();

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
  }) => {
    await adminDashboardPage.goto();
    await adminDashboardPage.expectLoaded();

    await adminTutorialListPage.goto();
    await adminTutorialListPage.expectLoaded();

    await tutorialEditorPage.goto();
    await tutorialEditorPage.expectLoaded();

    await stepEditorPage.goto(routes.stepEditor());
    await stepEditorPage.expectLoaded();

    await categoryTagManagementPage.goto();
    await categoryTagManagementPage.expectLoaded();

    await mediaLibraryPage.goto();
    await mediaLibraryPage.expectLoaded();

    await userRoleManagementPage.goto();
    await userRoleManagementPage.expectLoaded();

    await auditLogPage.goto();
    await auditLogPage.expectLoaded();
  });
});
