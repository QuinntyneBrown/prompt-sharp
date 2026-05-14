import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page, routes.home, /prompt sharp|prompt\/sharp|build apps/i);
  }

  featuredTutorials(): Locator {
    return this.byTestId('featured-tutorials').getByTestId('tutorial-card');
  }

  editorsPick(): Locator {
    return this.byTestId('editors-pick');
  }

  categoryLinks(): Locator {
    return this.byTestId('category-list').getByRole('link');
  }

  latestTutorials(): Locator {
    return this.byTestId('latest-tutorials').getByTestId('tutorial-card');
  }

  async browseTutorials(): Promise<void> {
    await this.link(/browse tutorials/i).click();
  }

  async openEditorsPick(): Promise<void> {
    await this.link(/editor'?s pick/i).click();
  }

  async signIn(): Promise<void> {
    await this.link(/sign in/i).click();
  }

  async expectMarketingSections(): Promise<void> {
    await expect(this.featuredTutorials().first()).toBeVisible();
    await expect(this.editorsPick()).toBeVisible();
    await expect(this.categoryLinks().first()).toBeVisible();
    await expect(this.latestTutorials().first()).toBeVisible();
  }
}
