import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class ProgressBookmarksPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.progressBookmarks, /progress|bookmarks/i);
  }

  inProgressTutorials(): Locator {
    return this.byTestId('in-progress-tutorials').getByTestId('tutorial-card');
  }

  bookmarks(): Locator {
    return this.byTestId('bookmarked-tutorials').getByTestId('tutorial-card');
  }

  async resumeTutorial(title: string | RegExp): Promise<void> {
    await this.inProgressTutorials().filter({ hasText: title }).first().getByRole('link', { name: /resume|continue/i }).click();
  }

  async removeBookmark(title: string | RegExp): Promise<void> {
    await this.bookmarks().filter({ hasText: title }).first().getByRole('button', { name: /remove bookmark/i }).click();
  }

  async expectSavedLearningState(): Promise<void> {
    await expect(this.inProgressTutorials().first()).toBeVisible();
    await expect(this.bookmarks().first()).toBeVisible();
  }
}
