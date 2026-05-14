import { test, expect } from '../fixtures/page-fixtures';
import { tutorial, users } from '../fixtures/test-data';

test.describe('authenticated learner workspace', () => {
  test('profile displays OAuth identity and links to saved learning state', async ({
    profilePage,
    progressBookmarksPage,
    page,
  }) => {
    await profilePage.goto();
    await profilePage.expectLoaded();
    await profilePage.expectProfileIdentity(users.learner.displayName, users.learner.email);

    await profilePage.openProgress();
    await expect(page).toHaveURL(/\/me\/progress$/);
    await progressBookmarksPage.expectLoaded();
  });

  test('progress and bookmarks resume work and remove saved tutorials', async ({ progressBookmarksPage, page }) => {
    await progressBookmarksPage.goto();
    await progressBookmarksPage.expectLoaded();
    await progressBookmarksPage.expectSavedLearningState();

    await progressBookmarksPage.resumeTutorial(new RegExp(tutorial.title, 'i'));
    await expect(page).toHaveURL(/\/tutorials\/.+/);

    await progressBookmarksPage.goto();
    await progressBookmarksPage.removeBookmark(new RegExp(tutorial.title, 'i'));
    await expect(page.getByRole('status')).toContainText(/bookmark removed|removed/i);
  });

  test('profile sign-out returns the learner to the sign-in screen', async ({ profilePage, page }) => {
    await profilePage.goto();
    await profilePage.expectLoaded();
    await profilePage.signOut();
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});
