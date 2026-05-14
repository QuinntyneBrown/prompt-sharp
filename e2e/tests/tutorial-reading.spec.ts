import { test, expect } from '../fixtures/page-fixtures';
import { tutorial } from '../fixtures/test-data';
import { routes } from '../pages/routes';

test.describe('tutorial reading experience', () => {
  test('reader can inspect steps, copy code, complete progress, and continue through the walkthrough', async ({
    tutorialDetailPage,
    page,
  }) => {
    await tutorialDetailPage.goto(routes.tutorialDetail(tutorial.slug));
    await tutorialDetailPage.expectLoaded();
    await tutorialDetailPage.expectReadableTutorial();

    await tutorialDetailPage.startTutorial();
    await tutorialDetailPage.copyPrimaryCodeBlock();
    await expect(page.getByRole('status')).toContainText(/copied/i);

    await tutorialDetailPage.completeCurrentStep();
    await expect(tutorialDetailPage.progressIndicator()).toContainText(/1\s*\/|complete/i);

    await tutorialDetailPage.goToNextStep();
    await expect(tutorialDetailPage.currentStep()).toContainText(/step 2|next/i);
  });

  test('reader can bookmark a tutorial and move through category or tag context', async ({
    tutorialDetailPage,
    page,
  }) => {
    await tutorialDetailPage.goto(routes.tutorialDetail(tutorial.slug));
    await tutorialDetailPage.expectLoaded();

    await tutorialDetailPage.bookmark();
    await expect(page.getByRole('status')).toContainText(/bookmarked|saved/i);

    await page.getByRole('link', { name: new RegExp(tutorial.category, 'i') }).click();
    await expect(page).toHaveURL(/\/categories\/.+/);

    await tutorialDetailPage.goto(routes.tutorialDetail(tutorial.slug));
    await page.getByRole('link', { name: new RegExp(tutorial.tag, 'i') }).click();
    await expect(page).toHaveURL(/\/tags\/.+/);
  });
});
