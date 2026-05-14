import { expect, type Locator, type Page } from '@playwright/test';

export type TextMatch = string | RegExp;

export abstract class BasePage {
  protected constructor(
    protected readonly page: Page,
    private readonly defaultPath: string,
    private readonly headingName: TextMatch,
  ) {}

  async goto(path = this.defaultPath): Promise<void> {
    await this.page.goto(path);
  }

  heading(): Locator {
    return this.page.getByRole('heading', { name: this.headingName });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible();
  }

  protected byTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  protected button(name: TextMatch): Locator {
    return this.page.getByRole('button', { name });
  }

  protected link(name: TextMatch): Locator {
    return this.page.getByRole('link', { name });
  }

  protected textbox(name: TextMatch): Locator {
    return this.page.getByRole('textbox', { name });
  }

  protected combobox(name: TextMatch): Locator {
    return this.page.getByRole('combobox', { name });
  }

  protected checkbox(name: TextMatch): Locator {
    return this.page.getByRole('checkbox', { name });
  }

  protected table(name?: TextMatch): Locator {
    return name ? this.page.getByRole('table', { name }) : this.page.getByRole('table');
  }
}
