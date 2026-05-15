import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class NotificationsPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.notifications, /notifications/i);
  }

  async expectNotificationVariants(): Promise<void> {
    await expect(this.page.getByRole('region', { name: /banner variants/i })).toContainText(/tutorial saved/i);
    await expect(this.page.getByRole('region', { name: /snackbar variants/i })).toContainText(
      /action could not be completed/i,
    );
  }

  async showSuccess(): Promise<void> {
    await this.button(/show success/i).click();
  }

  async expectSuccessSnackbar(): Promise<void> {
    await expect(this.page.locator('ps-notification-snackbar-host').getByRole('status')).toContainText(
      /tutorial saved/i,
    );
  }
}
