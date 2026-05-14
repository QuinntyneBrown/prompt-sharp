import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class TutorialEditorPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.tutorialEditorNew, /tutorial editor|new tutorial|edit tutorial/i);
  }

  stepRows(): Locator {
    return this.byTestId('tutorial-steps-editor').getByRole('listitem');
  }

  async fillBasics(input: {
    title: string;
    slug: string;
    summary: string;
    category: string;
    difficulty: string;
    estimatedMinutes: string;
  }): Promise<void> {
    await this.textbox(/title/i).fill(input.title);
    await this.textbox(/slug/i).fill(input.slug);
    await this.textbox(/summary/i).fill(input.summary);
    await this.combobox(/category/i).selectOption({ label: input.category });
    await this.combobox(/difficulty/i).selectOption({ label: input.difficulty });
    await this.textbox(/estimated minutes/i).fill(input.estimatedMinutes);
  }

  async addStep(): Promise<void> {
    await this.button(/add step/i).click();
  }

  async saveDraft(): Promise<void> {
    await this.button(/save draft|save/i).click();
  }

  async publish(): Promise<void> {
    await this.button(/publish/i).click();
  }

  async preview(): Promise<void> {
    await this.button(/preview/i).click();
  }

  async expectValidationSummary(): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(/required|validation/i);
  }
}
