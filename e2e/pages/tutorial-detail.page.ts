import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from './routes';

export class TutorialDetailPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.tutorialDetail(), /build|tutorial|walkthrough/i);
  }

  steps(): Locator {
    return this.byTestId('tutorial-steps').getByRole('listitem');
  }

  currentStep(): Locator {
    return this.byTestId('current-step');
  }

  progressIndicator(): Locator {
    return this.byTestId('tutorial-progress');
  }

  primaryCodeBlock(): Locator {
    return this.byTestId('code-block').first();
  }

  async startTutorial(): Promise<void> {
    await this.button(/start tutorial|resume/i).click();
  }

  async completeCurrentStep(): Promise<void> {
    await this.button(/mark step complete|complete step/i).click();
  }

  async copyPrimaryCodeBlock(): Promise<void> {
    await this.button(/copy code/i).first().click();
  }

  async bookmark(): Promise<void> {
    await this.button(/bookmark|save tutorial/i).click();
  }

  async goToNextStep(): Promise<void> {
    await this.button(/next step/i).click();
  }

  async expectReadableTutorial(): Promise<void> {
    await expect(this.steps().first()).toBeVisible();
    await expect(this.currentStep()).toBeVisible();
    await expect(this.primaryCodeBlock()).toBeVisible();
  }
}
