import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class TutorialEditorPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.tutorialEditorNew, /tutorial editor|new tutorial|edit tutorial/i);
  }

  stepRows(): Locator {
    return this.byTestId('tutorial-steps-editor').getByRole('listitem');
  }

  async fillBasics(input: {
    title: string;
    slug: string;
    summary: string;
    category: string;
    difficulty: string;
    estimatedMinutes: string;
  }): Promise<void> {
    await this.textbox(/title/i).fill(input.title);
    await this.textbox(/slug/i).fill(input.slug);
    await this.textbox(/summary/i).fill(input.summary);
    await this.combobox(/category/i).selectOption({ label: input.category });
    await this.combobox(/difficulty/i).selectOption({ label: input.difficulty });
    await this.page.getByLabel(/estimated minutes/i).fill(input.estimatedMinutes);
  }

  async changeTitle(title: string): Promise<void> {
    await this.textbox(/title/i).fill(title);
  }

  async addStep(): Promise<void> {
    await this.button(/add step/i).click();
  }

  async saveDraft(): Promise<void> {
    const createResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/v1/admin/tutorials'),
    );
    const stepsResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' &&
        response.url().includes('/api/v1/admin/tutorials/') &&
        response.url().endsWith('/steps'),
    );
    await this.button(/save draft|save/i).click();
    expect((await createResponse).status()).toBe(201);
    expect((await stepsResponse).ok()).toBe(true);
  }

  async openPublishDialog(): Promise<void> {
    await this.button(/publish/i).click();
  }

  async confirmPublish(): Promise<void> {
    const publishResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/api/v1/admin/tutorials/') &&
        response.url().endsWith('/publish'),
    );
    await this.page.getByRole('dialog', { name: /publish/i }).getByRole('button', { name: /^publish$/i }).click();
    expect((await publishResponse).ok()).toBe(true);
  }

  async expectPublishDialog(): Promise<void> {
    await expect(this.page.getByRole('dialog', { name: /publish/i })).toBeVisible();
  }

  async preview(): Promise<void> {
    await this.button(/preview/i).click();
  }

  async leaveViaTutorialsNav(): Promise<void> {
    await this.page.getByRole('link', { name: /^tutorials$/i }).click();
  }

  async expectUnsavedChangesDialog(): Promise<void> {
    await expect(this.page.getByRole('dialog', { name: /unsaved changes/i })).toBeVisible();
  }

  async keepEditing(): Promise<void> {
    await this.page.getByRole('dialog', { name: /unsaved changes/i }).getByRole('button', { name: /keep editing/i }).click();
    await expect(this.page.getByRole('dialog', { name: /unsaved changes/i })).toBeHidden();
  }

  async discardChanges(): Promise<void> {
    await this.page.getByRole('dialog', { name: /unsaved changes/i }).getByRole('button', { name: /discard/i }).click();
  }

  async expectValidationSummary(): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(/required|validation/i);
  }
}
