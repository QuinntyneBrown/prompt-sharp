import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class CategoryPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.category(), /category|\.net|azure|blazor/i);
  }

  tutorialCards(): Locator {
    return this.byTestId('category-tutorials').getByTestId('tutorial-card');
  }

  async sortBy(sortLabel: string): Promise<void> {
    await this.combobox(/sort/i).selectOption({ label: sortLabel });
  }

  async openTutorial(title: string | RegExp): Promise<void> {
    await this.tutorialCards().filter({ hasText: title }).first().getByRole('link').click();
  }

  async expectCategoryResults(): Promise<void> {
    await expect(this.tutorialCards().first()).toBeVisible();
  }
}
