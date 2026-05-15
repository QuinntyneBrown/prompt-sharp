import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class AuditLogPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.auditLog, /audit log/i);
  }

  auditTable(): Locator {
    return this.table(/audit log/i);
  }

  async filterByAction(action: string): Promise<void> {
    await this.combobox(/action/i).selectOption({ label: action });
  }

  async filterByActor(actor: string): Promise<void> {
    await this.searchbox(/actor|user/i).fill(actor);
    await this.searchbox(/actor|user/i).press('Enter');
  }

  async openFirstEntry(): Promise<void> {
    await this.auditTable().getByRole('row').nth(1).getByRole('button', { name: /details|view/i }).click();
  }

  async expectEntries(): Promise<void> {
    await expect(this.auditTable()).toBeVisible();
    await expect(this.auditTable().getByRole('row').nth(1)).toBeVisible({ timeout: 15_000 });
  }
}
