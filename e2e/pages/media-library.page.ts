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

  async delayNextUpload(milliseconds = 500): Promise<void> {
    await this.page.route(
      '**/api/v1/admin/media',
      async (route) => {
        if (route.request().method() === 'POST') {
          await new Promise((resolve) => setTimeout(resolve, milliseconds));
        }
        await route.continue();
      },
      { times: 1 },
    );
  }

  async upload(filePath: string): Promise<void> {
    await this.openUploadDialog();
    const uploadResponse = this.page.waitForResponse(
      (response) => response.request().method() === 'POST' && response.url().includes('/api/v1/admin/media'),
    );
    await this.page.getByLabel(/upload file/i).setInputFiles(filePath);
    await expect(this.page.getByRole('progressbar', { name: /upload progress/i })).toBeVisible();
    expect((await uploadResponse).ok()).toBe(true);
  }

  async openUploadDialog(): Promise<void> {
    await this.button(/upload media/i).click();
    await expect(this.page.getByRole('dialog', { name: /upload media/i })).toBeVisible();
  }

  async cancelUploadDialog(): Promise<void> {
    await this.page.getByRole('dialog', { name: /upload media/i }).getByRole('button', { name: /cancel/i }).click();
    await expect(this.page.getByRole('dialog', { name: /upload media/i })).toBeHidden();
  }

  async searchFor(query: string): Promise<void> {
    await this.searchbox(/search media/i).fill(query);
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

  async enableSelectionMode(): Promise<void> {
    await this.button(/select media/i).click();
  }

  async selectFirstMedia(): Promise<void> {
    await this.mediaItems().first().getByRole('checkbox', { name: /select/i }).check();
  }

  async expectSelectionMode(): Promise<void> {
    await expect(this.page.getByRole('region', { name: /media selection/i })).toBeVisible();
  }

  async expectSelectedCount(count: number): Promise<void> {
    await expect(this.page.getByRole('region', { name: /media selection/i })).toContainText(
      new RegExp(`${count} selected`, 'i'),
    );
  }
}
