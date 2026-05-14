import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class AccessDeniedPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.accessDenied, /access denied|permission/i);
  }

  async requestAccess(): Promise<void> {
    await this.button(/request access/i).click();
  }

  async expectRoleGuidance(): Promise<void> {
    await expect(this.page.getByText(/role|permission|administrator/i)).toBeVisible();
    await expect(this.link(/home|dashboard/i)).toBeVisible();
  }
}
