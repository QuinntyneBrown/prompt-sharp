import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class AboutPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.about, /about prompt sharp|about/i);
  }

  async contact(): Promise<void> {
    await this.link(/contact/i).click();
  }

  async expectCompanyContext(): Promise<void> {
    await expect(this.page.getByText(/objectsharp|microsoft technologies|senior architect/i)).toBeVisible();
  }
}
