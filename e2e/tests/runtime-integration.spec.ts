import { test, expect } from '../fixtures/page-fixtures';
import { RuntimePage } from '../pages/runtime.page';

const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';

test.describe('runtime integration', () => {
  test('Angular shell renders with SQL-backed public API data', async ({ page }) => {
    const runtimePage = new RuntimePage(page, apiBaseUrl);

    await runtimePage.expectBackendReady();
    await runtimePage.gotoHomeAndWaitForPublicData();
    await runtimePage.expectAngularRendered();

    await expect(page.getByTestId('featured-tutorials').getByTestId('tutorial-card').first()).toBeVisible();
    await expect(page.getByTestId('category-list').getByRole('link').first()).toBeVisible();
  });
});
