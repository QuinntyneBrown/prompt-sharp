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

  async signOut(): Promise<void> {
    await this.button(/sign out/i).click();
  }
}
