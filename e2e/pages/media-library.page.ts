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
    await this.page.getByLabel(/upload media|upload file|file/i).setInputFiles(filePath);
    await this.button(/upload/i).click();
  }

  async searchFor(query: string): Promise<void> {
    await this.textbox(/search media/i).fill(query);
  }

  async copyUrl(fileName: string | RegExp): Promise<void> {
    await this.mediaItems().filter({ hasText: fileName }).first().getByRole('button', { name: /copy url/i }).click();
  }

  async delete(fileName: string | RegExp): Promise<void> {
    await this.mediaItems().filter({ hasText: fileName }).first().getByRole('button', { name: /delete/i }).click();
    await this.button(/confirm|delete/i).click();
  }

  async expectLibraryReady(): Promise<void> {
    await expect(this.mediaItems().first()).toBeVisible();
  }
}
