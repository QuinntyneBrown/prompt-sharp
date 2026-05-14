import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class TagPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.tag(), /tag|azure|clean architecture/i);
  }

  tutorialCards(): Locator {
    return this.byTestId('tag-tutorials').getByTestId('tutorial-card');
  }

  async filterByDifficulty(difficulty: string): Promise<void> {
    await this.combobox(/difficulty/i).selectOption({ label: difficulty });
  }

  async expectTagResults(): Promise<void> {
    await expect(this.tutorialCards().first()).toBeVisible();
  }
}
