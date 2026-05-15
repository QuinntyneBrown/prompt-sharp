import { expect, type Page } from '@playwright/test';
import { routes } from './routes';

export class RuntimePage {
  constructor(
    private readonly page: Page,
    private readonly apiBaseUrl: string,
  ) {}

  async expectBackendReady(): Promise<void> {
    const response = await this.page.request.get(`${this.apiBaseUrl}/health/ready`);
    expect(response.ok()).toBe(true);
  }

  async gotoHomeAndWaitForPublicData(): Promise<void> {
    const featuredResponse = this.page.waitForResponse((response) =>
      this.isOkApiResponse(response.url(), response.status(), '/api/v1/tutorials/featured'),
    );
    const categoriesResponse = this.page.waitForResponse((response) =>
      this.isOkApiResponse(response.url(), response.status(), '/api/v1/categories'),
    );

    await this.page.goto(routes.home);
    await featuredResponse;
    await categoriesResponse;
  }

  async expectAngularRendered(): Promise<void> {
    await expect(this.page.locator('app-root[ng-version]')).toBeAttached();
  }

  private isOkApiResponse(url: string, status: number, path: string): boolean {
    return url.startsWith(this.apiBaseUrl) && url.includes(path) && status >= 200 && status < 300;
  }
}
