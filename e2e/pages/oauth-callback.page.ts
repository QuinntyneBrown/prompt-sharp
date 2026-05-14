import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class OAuthCallbackPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.oauthCallback, /signing you in|authenticating|oauth/i);
  }

  async expectProcessingState(): Promise<void> {
    await expect(this.page.getByText(/signing you in|authenticating|finishing sign in/i)).toBeVisible();
  }

  async expectCallbackError(): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(/sign in failed|access denied|invalid/i);
  }
}
