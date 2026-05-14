import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class NotFoundPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.notFound, /not found|404/i);
  }

  async returnHome(): Promise<void> {
    await this.link(/home|prompt sharp/i).click();
  }

  async expectRecoveryActions(): Promise<void> {
    await expect(this.link(/home/i)).toBeVisible();
    await expect(this.link(/browse tutorials|tutorial catalog/i)).toBeVisible();
  }
}
