import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class AdminTutorialListPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.adminTutorialList, /tutorials/i);
  }

  tutorialTable(): Locator {
    return this.table(/tutorials/i);
  }

  tutorialRows(): Locator {
    return this.tutorialTable().getByRole('row').filter({ has: this.page.getByRole('cell') });
  }

  async searchFor(query: string): Promise<void> {
    await this.textbox(/search tutorials/i).fill(query);
    await this.textbox(/search tutorials/i).press('Enter');
  }

  async filterByStatus(status: string): Promise<void> {
    await this.combobox(/status/i).selectOption({ label: status });
  }

  async createTutorial(): Promise<void> {
    await this.button(/new tutorial|create tutorial/i).click();
  }

  async publishTutorial(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/publish/i).click();
  }

  async featureTutorial(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/feature/i).click();
  }

  async setEditorsPick(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/editor'?s pick/i).click();
  }

  async deleteTutorial(title: string | RegExp): Promise<void> {
    await this.openRowActions(title);
    await this.button(/delete/i).click();
    await this.button(/confirm|delete/i).click();
  }

  async expectTableReady(): Promise<void> {
    await expect(this.tutorialTable()).toBeVisible();
    await expect(this.tutorialRows().first()).toBeVisible();
  }

  private async openRowActions(title: string | RegExp): Promise<void> {
    await this.tutorialRows().filter({ hasText: title }).first().getByRole('button', { name: /actions|more/i }).click();
  }
}
