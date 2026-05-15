import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class MediaLibraryPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.mediaLibrary, /media library|media/i);
  }

  mediaItems(): Locator {
    return this.byTestId('media-library').getByTestId('media-item');
  }

  async upload(filePath: string): Promise<void> {
    await this.button(/upload media/i).click();
    await expect(this.page.getByRole('dialog', { name: /upload media/i })).toBeVisible();
    const uploadResponse = this.page.waitForResponse(
      (response) => response.request().method() === 'POST' && response.url().includes('/api/v1/admin/media'),
    );
    await this.page.getByLabel(/upload file/i).setInputFiles(filePath);
    expect((await uploadResponse).ok()).toBe(true);
  }

  async searchFor(query: string): Promise<void> {
    await this.textbox(/search media/i).fill(query);
  }

  async copyUrl(fileName: string | RegExp): Promise<void> {
    await this.mediaItems().filter({ hasText: fileName }).first().getByRole('button', { name: /copy url/i }).click();
  }

  async delete(fileName: string | RegExp): Promise<void> {
    await this.mediaItems().filter({ hasText: fileName }).first().getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByRole('dialog', { name: /delete/i })).toBeVisible();
    const deleteResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' && response.url().includes('/api/v1/admin/media/'),
    );
    await this.page.getByRole('dialog', { name: /delete/i }).getByRole('button', { name: /^delete$/i }).click();
    expect((await deleteResponse).status()).toBe(204);
  }

  async expectLibraryReady(): Promise<void> {
    await expect(this.mediaItems().first()).toBeVisible();
  }
}
