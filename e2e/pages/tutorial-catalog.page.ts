import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class TutorialCatalogPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.catalog, /tutorial catalog|tutorials/i);
  }

  searchInput(): Locator {
    return this.textbox(/search tutorials/i);
  }

  categoryFilter(): Locator {
    return this.combobox(/category/i);
  }

  tagFilter(): Locator {
    return this.combobox(/tag/i);
  }

  difficultyFilter(): Locator {
    return this.combobox(/difficulty/i);
  }

  sortSelect(): Locator {
    return this.combobox(/sort/i);
  }

  resultCards(): Locator {
    return this.byTestId('tutorial-results').getByTestId('tutorial-card');
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput().fill(query);
    await this.searchInput().press('Enter');
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter().selectOption({ label: category });
  }

  async filterByDifficulty(difficulty: string): Promise<void> {
    await this.difficultyFilter().selectOption({ label: difficulty });
  }

  async useListView(): Promise<void> {
    await this.button(/list view/i).click();
  }

  async resetFilters(): Promise<void> {
    await this.button(/reset filters/i).click();
  }

  async openTutorial(title: string | RegExp): Promise<void> {
    await this.resultCards().filter({ hasText: title }).first().getByRole('link').click();
  }

  async expectResults(): Promise<void> {
    await expect(this.resultCards().first()).toBeVisible();
  }
}
