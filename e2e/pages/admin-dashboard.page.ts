import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class AdminDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.adminDashboard, /admin dashboard|dashboard/i);
  }

  statCards(): Locator {
    return this.byTestId('admin-stats').getByTestId('stat-card');
  }

  recentActivity(): Locator {
    return this.byTestId('recent-activity');
  }

  recentEdits(): Locator {
    return this.byTestId('recent-edits').getByRole('listitem');
  }

  async createTutorial(): Promise<void> {
    await this.button(/new tutorial|create tutorial/i).click();
  }

  async openTutorials(): Promise<void> {
    await this.link(/tutorials/i).click();
  }

  async openAuditLog(): Promise<void> {
    await this.link(/audit log/i).click();
  }

  async expectOperationalSummary(): Promise<void> {
    await expect(this.statCards().first()).toBeVisible();
    await expect(this.recentActivity()).toBeVisible();
    await expect(this.recentEdits().first()).toBeVisible();
  }
}
