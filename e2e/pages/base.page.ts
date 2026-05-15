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
    return this.page.getByRole('heading', { name: this.headingName, level: 1 });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible();
  }

  async openPrimaryNavLink(name: TextMatch): Promise<void> {
    await this.page.getByRole('navigation', { name: /primary/i }).getByRole('link', { name }).click();
  }

  async openAdminNavLink(name: TextMatch): Promise<void> {
    await this.page.getByRole('complementary').getByRole('link', { name }).click();
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

  protected searchbox(name: TextMatch): Locator {
    return this.page.getByRole('searchbox', { name });
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
