import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page, routes.profile, /my profile|profile/i);
  }

  async expectProfileIdentity(displayName: string, email: string): Promise<void> {
    await expect(this.page.getByText(displayName)).toBeVisible();
    await expect(this.page.getByText(email)).toBeVisible();
  }

  async openProgress(): Promise<void> {
    await this.link(/progress|bookmarks/i).click();
  }

  async openSignOutDialog(): Promise<void> {
    await this.button(/^sign out$/i).first().click();
  }

  async expectSignOutDialog(): Promise<void> {
    await expect(this.page.getByRole('dialog', { name: /sign out/i })).toBeVisible();
  }

  async cancelSignOut(): Promise<void> {
    await this.page.getByRole('dialog', { name: /sign out/i }).getByRole('button', { name: /stay signed in/i }).click();
  }

  async confirmSignOut(): Promise<void> {
    await this.page.getByRole('dialog', { name: /sign out/i }).getByRole('button', { name: /^sign out$/i }).click();
  }
}
