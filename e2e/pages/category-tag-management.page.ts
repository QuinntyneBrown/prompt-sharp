import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class CategoryTagManagementPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.taxonomy, /category|tag|taxonomy/i);
  }

  categoriesTable(): Locator {
    return this.table(/categories/i);
  }

  tagsTable(): Locator {
    return this.table(/tags/i);
  }

  async createCategory(name: string, slug: string): Promise<void> {
    await this.button(/new category|add category/i).click();
    await this.textbox(/category name|name/i).fill(name);
    await this.textbox(/slug/i).fill(slug);
    await this.button(/save category|save/i).click();
  }

  async createTag(name: string, slug: string): Promise<void> {
    await this.button(/new tag|add tag/i).click();
    await this.textbox(/tag name|name/i).fill(name);
    await this.textbox(/slug/i).fill(slug);
    await this.button(/save tag|save/i).click();
  }

  async expectTaxonomyTables(): Promise<void> {
    await expect(this.categoriesTable()).toBeVisible();
    await expect(this.tagsTable()).toBeVisible();
  }
}
