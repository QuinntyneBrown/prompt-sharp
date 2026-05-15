import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class AdminTutorialListPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.adminTutorialList, /tutorials/i);
  }

  tutorialTable(): Locator {
    return this.table(/tutorials/i);
  }

  tutorialRows(): Locator {
    return this.tutorialTable().getByRole('row').filter({ has: this.page.getByRole('cell') });
  }

  async searchFor(query: string): Promise<void> {
    await this.searchbox(/search tutorials/i).fill(query);
    await this.searchbox(/search tutorials/i).press('Enter');
  }

  async filterByStatus(status: string): Promise<void> {
    await this.combobox(/status/i).selectOption({ label: status });
  }

  async createDraftFromDialog(input: {
    title: string;
    slug: string;
    summary: string;
    category: string;
    difficulty: string;
    estimatedMinutes: string;
  }): Promise<void> {
    await this.button(/new tutorial/i).click();
    const dialog = this.page.getByRole('dialog', { name: /new tutorial/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox', { name: /^title$/i }).fill(input.title);
    await dialog.getByRole('textbox', { name: /^slug$/i }).fill(input.slug);
    await dialog.getByRole('textbox', { name: /summary/i }).fill(input.summary);
    await dialog.getByRole('combobox', { name: /category/i }).selectOption({ label: input.category });
    await dialog.getByRole('combobox', { name: /difficulty/i }).selectOption({ label: input.difficulty });
    await dialog.getByLabel(/estimated minutes/i).fill(input.estimatedMinutes);
    const createResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/v1/admin/tutorials'),
    );
    await dialog.getByRole('button', { name: /create draft/i }).click();
    expect((await createResponse).status()).toBe(201);
  }

  async createTutorial(): Promise<void> {
    await this.button(/new tutorial|create tutorial/i).click();
  }

  async publishTutorial(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/publish/i).click();
    await this.expectPublishDialog();
    const publishResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/api/v1/admin/tutorials/') &&
        response.url().includes('/publish'),
    );
    await this.page.getByRole('dialog', { name: /publish/i }).getByRole('button', { name: /^publish$/i }).click();
    expect((await publishResponse).ok()).toBe(true);
  }

  async cancelPublishTutorial(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/publish/i).click();
    await this.expectPublishDialog();
    await this.page.getByRole('dialog', { name: /publish/i }).getByRole('button', { name: /cancel/i }).click();
    await expect(this.page.getByRole('dialog', { name: /publish/i })).toBeHidden();
  }

  async featureTutorial(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/feature/i).click();
  }

  async setEditorsPick(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/editor'?s pick/i).click();
  }

  async deleteTutorial(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/delete/i).click();
    const deleteResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' &&
        response.url().includes('/api/v1/admin/tutorials/'),
    );
    await this.page.getByRole('dialog', { name: /delete/i }).getByRole('button', { name: /^delete$/i }).click();
    expect((await deleteResponse).status()).toBe(204);
  }

  async expectTableReady(): Promise<void> {
    await expect(this.tutorialTable()).toBeVisible();
    await expect(this.tutorialRows().first()).toBeVisible();
  }

  async expectPublishDialog(): Promise<void> {
    await expect(this.page.getByRole('dialog', { name: /publish/i })).toBeVisible();
  }

  private async openRowActions(title: string | RegExp): Promise<void> {
    await this.tutorialRows().filter({ hasText: title }).first().getByRole('button', { name: /actions|more/i }).click();
  }
}
