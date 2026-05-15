import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class UserRoleManagementPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.userRoles, /users|roles|user management/i);
  }

  usersTable(): Locator {
    return this.table(/users/i);
  }

  async searchForUser(query: string): Promise<void> {
    await this.textbox(/search users/i).fill(query);
    await this.textbox(/search users/i).press('Enter');
  }

  async setRole(email: string | RegExp, role: 'Admin' | 'Editor' | 'User', enabled: boolean): Promise<void> {
    const row = this.usersTable().getByRole('row').filter({ hasText: email }).first();
    const roleCheckbox = row.getByRole('checkbox', { name: new RegExp(role, 'i') });
    if (enabled) {
      await roleCheckbox.check();
    } else {
      await roleCheckbox.uncheck();
    }
    await row.getByRole('button', { name: /save roles|save/i }).click();
  }

  async openInviteDialog(): Promise<void> {
    await this.button(/invite user|invite/i).click();
    await expect(this.page.getByRole('dialog', { name: /invite user/i })).toBeVisible();
  }

  async submitInvite(): Promise<void> {
    await this.page.getByRole('dialog', { name: /invite user/i }).getByRole('button', { name: /send invite/i }).click();
  }

  async inviteUser(email: string): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: /invite user/i });
    if (!(await dialog.isVisible().catch(() => false))) {
      await this.openInviteDialog();
    }

    await dialog.getByRole('textbox', { name: /email/i }).fill(email);
    await this.submitInvite();
  }

  async expectInviteValidation(): Promise<void> {
    await expect(this.page.getByRole('dialog', { name: /invite user/i })).toContainText(/email.*required|valid email/i);
  }

  async expectPendingInvitation(email: string): Promise<void> {
    await expect(this.page.getByTestId('pending-invitations')).toContainText(email);
  }

  async expectUsersReady(): Promise<void> {
    await expect(this.usersTable()).toBeVisible();
    await expect(this.usersTable().getByRole('row').nth(1)).toBeVisible();
  }
}
