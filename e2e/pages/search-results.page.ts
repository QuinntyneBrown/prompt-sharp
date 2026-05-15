import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.search(), /search results/i);
  }

  searchInput(): Locator {
    return this.searchbox(/search/i);
  }

  results(): Locator {
    return this.byTestId('search-results').getByTestId('tutorial-card');
  }

  emptyState(): Locator {
    return this.byTestId('search-empty-state');
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput().fill(query);
    await this.searchInput().press('Enter');
  }

  async expectResultsFor(query: string): Promise<void> {
    await expect(this.searchInput()).toHaveValue(query);
    await expect(this.results().first()).toBeVisible();
  }
}
