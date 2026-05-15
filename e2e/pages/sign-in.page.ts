import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.signIn, /sign in/i);
  }

  providerButton(provider: 'Microsoft' | 'Google'): Locator {
    return this.button(new RegExp(`continue with ${provider}|sign in with ${provider}`, 'i'));
  }

  emailInput(): Locator {
    return this.textbox(/email|username/i);
  }

  passwordInput(): Locator {
    return this.textbox(/password/i);
  }

  async signInWithProvider(provider: 'Microsoft' | 'Google'): Promise<void> {
    await this.providerButton(provider).click();
  }

  async signInWithCredentials(email: string, password: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.button(/sign in/i).click();
  }

  async toggleRememberMe(): Promise<void> {
    await this.checkbox(/remember/i).check();
  }

  async expectSessionExpiredDialog(): Promise<void> {
    await expect(this.page.getByRole('dialog', { name: /session expired/i })).toBeVisible();
  }

  async acknowledgeSessionExpired(): Promise<void> {
    await this.page.getByRole('dialog', { name: /session expired/i }).getByRole('button', { name: /sign in/i }).click();
  }

  async expectAuthOptions(): Promise<void> {
    await expect(this.providerButton('Microsoft')).toBeVisible();
    await expect(this.providerButton('Google')).toBeVisible();
  }
}
