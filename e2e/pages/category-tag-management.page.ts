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
    await this.selectCategories();
    await this.button(/new category|add category/i).click();
    await expect(this.page.getByRole('dialog', { name: /new category/i })).toBeVisible();
    await this.textbox(/category name|name/i).fill(name);
    await this.textbox(/slug/i).fill(slug);
    const response = this.page.waitForResponse(
      (candidate) => candidate.request().method() === 'POST' && candidate.url().includes('/api/v1/admin/categories'),
    );
    await this.button(/save category|save/i).click();
    expect((await response).ok()).toBe(true);
  }

  async createTag(name: string, slug: string): Promise<void> {
    await this.selectTags();
    await this.button(/new tag|add tag/i).click();
    await expect(this.page.getByRole('dialog', { name: /new tag/i })).toBeVisible();
    await this.textbox(/tag name|name/i).fill(name);
    await this.textbox(/slug/i).fill(slug);
    const response = this.page.waitForResponse(
      (candidate) => candidate.request().method() === 'POST' && candidate.url().includes('/api/v1/admin/tags'),
    );
    await this.button(/save tag|save/i).click();
    expect((await response).ok()).toBe(true);
  }

  async editCategory(currentName: string | RegExp, name: string, slug: string): Promise<void> {
    await this.selectCategories();
    await this.categoriesTable().getByRole('row').filter({ hasText: currentName }).first().getByRole('button', { name: /edit/i }).click();
    await expect(this.page.getByRole('dialog', { name: /edit category/i })).toBeVisible();
    await this.textbox(/category name|name/i).fill(name);
    await this.textbox(/slug/i).fill(slug);
    const response = this.page.waitForResponse(
      (candidate) => candidate.request().method() === 'PUT' && candidate.url().includes('/api/v1/admin/categories/'),
    );
    await this.button(/save category|save/i).click();
    expect((await response).ok()).toBe(true);
  }

  async editTag(currentName: string | RegExp, name: string, slug: string): Promise<void> {
    await this.selectTags();
    await this.tagsTable().getByRole('row').filter({ hasText: currentName }).first().getByRole('button', { name: /edit/i }).click();
    await expect(this.page.getByRole('dialog', { name: /edit tag/i })).toBeVisible();
    await this.textbox(/tag name|name/i).fill(name);
    await this.textbox(/slug/i).fill(slug);
    const response = this.page.waitForResponse(
      (candidate) => candidate.request().method() === 'PUT' && candidate.url().includes('/api/v1/admin/tags/'),
    );
    await this.button(/save tag|save/i).click();
    expect((await response).ok()).toBe(true);
  }

  async deleteCategory(name: string | RegExp): Promise<void> {
    await this.selectCategories();
    await this.categoriesTable().getByRole('row').filter({ hasText: name }).first().getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByRole('dialog', { name: /delete/i })).toBeVisible();
    const response = this.page.waitForResponse(
      (candidate) => candidate.request().method() === 'DELETE' && candidate.url().includes('/api/v1/admin/categories/'),
    );
    await this.page.getByRole('dialog', { name: /delete/i }).getByRole('button', { name: /^delete$/i }).click();
    expect((await response).status()).toBe(204);
  }

  async deleteTag(name: string | RegExp): Promise<void> {
    await this.selectTags();
    await this.tagsTable().getByRole('row').filter({ hasText: name }).first().getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByRole('dialog', { name: /delete/i })).toBeVisible();
    const response = this.page.waitForResponse(
      (candidate) => candidate.request().method() === 'DELETE' && candidate.url().includes('/api/v1/admin/tags/'),
    );
    await this.page.getByRole('dialog', { name: /delete/i }).getByRole('button', { name: /^delete$/i }).click();
    expect((await response).status()).toBe(204);
  }

  async expectTaxonomyTables(): Promise<void> {
    await this.selectCategories();
    await expect(this.categoriesTable()).toBeVisible();
    await this.selectTags();
    await expect(this.tagsTable()).toBeVisible();
    await this.selectCategories();
  }

  async selectCategories(): Promise<void> {
    await this.page.getByRole('tab', { name: /categories/i }).click();
  }

  async selectTags(): Promise<void> {
    await this.page.getByRole('tab', { name: /^tags$/i }).click();
  }
}
