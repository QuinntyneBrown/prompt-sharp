import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class StepEditorPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.stepEditor(), /step editor|edit step/i);
  }

  async fillStep(input: {
    title: string;
    bodyMarkdown: string;
    codeSnippet: string;
    codeLanguage: string;
  }): Promise<void> {
    await this.textbox(/step title|title/i).fill(input.title);
    await this.textbox(/body|markdown/i).fill(input.bodyMarkdown);
    await this.textbox(/code snippet|code/i).fill(input.codeSnippet);
    await this.combobox(/code language|language/i).selectOption({ label: input.codeLanguage });
  }

  async attachImage(filePath: string): Promise<void> {
    await this.page.getByLabel(/image|media/i).setInputFiles(filePath);
  }

  async save(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' &&
        response.url().includes('/api/v1/admin/tutorials/') &&
        response.url().endsWith('/steps'),
    );
    await this.button(/save step|save/i).click();
    expect((await saveResponse).ok()).toBe(true);
  }

  async moveUp(): Promise<void> {
    await this.button(/move up/i).click();
  }

  async expectPreview(): Promise<void> {
    await expect(this.byTestId('step-preview')).toBeVisible();
  }
}
