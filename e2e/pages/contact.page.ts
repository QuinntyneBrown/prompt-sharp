import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.contact, /contact/i);
  }

  async submitMessage(name: string, email: string, message: string): Promise<void> {
    await this.textbox(/name/i).fill(name);
    await this.textbox(/email/i).fill(email);
    await this.textbox(/message/i).fill(message);
    await this.button(/send|submit/i).click();
  }

  async expectConfirmation(): Promise<void> {
    await expect(this.page.getByText(/message sent|thanks|we will follow up/i)).toBeVisible();
  }
}
