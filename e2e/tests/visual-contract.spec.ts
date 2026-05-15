import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import crypto from 'node:crypto';
import type { APIRequestContext, Page } from '@playwright/test';
import { test, expect } from '../fixtures/page-fixtures';
import { routes } from '../pages/routes';

test.use({ storageState: '.auth/admin.json' });

type VisualCase = {
  name: string;
  skeleton: string;
  path: string;
  dialogName?: RegExp;
  openDialog?: (page: Page) => Promise<void>;
};

const routeCases: VisualCase[] = [
  { name: 'home', skeleton: 'home.html', path: routes.home },
  { name: 'catalog', skeleton: 'catalog.html', path: routes.catalog },
  { name: 'tutorial-detail', skeleton: 'tutorial-detail.html', path: routes.tutorialDetail() },
  { name: 'category', skeleton: 'category.html', path: routes.category() },
  { name: 'tag', skeleton: 'category.html', path: routes.tag() },
  { name: 'search-results', skeleton: 'search-results.html', path: routes.search() },
  { name: 'about', skeleton: 'about.html', path: routes.about },
  { name: 'contact', skeleton: 'about.html', path: routes.contact },
  { name: 'not-found', skeleton: 'error-404.html', path: routes.notFound },
  { name: 'sign-in', skeleton: 'signin.html', path: routes.signIn },
  { name: 'oauth-callback', skeleton: 'oauth-callback.html', path: routes.oauthCallback },
  { name: 'oauth-consent', skeleton: 'oauth-consent-dialog.html', path: '/auth/consent' },
  { name: 'access-denied', skeleton: 'access-denied.html', path: routes.accessDenied },
  { name: 'profile', skeleton: 'profile.html', path: routes.profile },
  { name: 'progress', skeleton: 'progress.html', path: routes.progressBookmarks },
  { name: 'notifications', skeleton: 'notifications.html', path: '/notifications' },
  { name: 'admin-dashboard', skeleton: 'admin-dashboard.html', path: routes.adminDashboard },
  { name: 'admin-tutorial-list', skeleton: 'admin-tutorial-list.html', path: routes.adminTutorialList },
  { name: 'admin-tutorial-editor-new', skeleton: 'admin-tutorial-editor.html', path: routes.tutorialEditorNew },
  { name: 'admin-taxonomy', skeleton: 'admin-categories.html', path: routes.taxonomy },
  { name: 'admin-media', skeleton: 'admin-media.html', path: routes.mediaLibrary },
  { name: 'admin-users', skeleton: 'admin-users.html', path: routes.userRoles },
  { name: 'admin-audit-log', skeleton: 'admin-audit-log.html', path: routes.auditLog },
  { name: 'admin-notifications', skeleton: 'notifications.html', path: routes.notifications },
];

const dialogCases: VisualCase[] = [
  {
    name: 'admin-tutorial-dialog',
    skeleton: 'admin-tutorial-dialog.html',
    path: routes.adminTutorialList,
    dialogName: /new tutorial/i,
    openDialog: async (page) => page.getByRole('button', { name: /new tutorial/i }).click(),
  },
  {
    name: 'admin-publish-dialog',
    skeleton: 'admin-publish-dialog.html',
    path: routes.adminTutorialList,
    dialogName: /publish/i,
    openDialog: async (page) => {
      await openFirstTutorialActions(page);
      await page.getByRole('button', { name: /^publish$/i }).click();
    },
  },
  {
    name: 'admin-confirm-delete-dialog',
    skeleton: 'admin-confirm-delete-dialog.html',
    path: routes.adminTutorialList,
    dialogName: /delete/i,
    openDialog: async (page) => {
      await openFirstTutorialActions(page);
      await page.getByRole('button', { name: /^delete$/i }).click();
    },
  },
  {
    name: 'admin-category-dialog',
    skeleton: 'admin-category-dialog.html',
    path: routes.taxonomy,
    dialogName: /new category/i,
    openDialog: async (page) => page.getByRole('button', { name: /new category/i }).click(),
  },
  {
    name: 'admin-media-upload-dialog',
    skeleton: 'admin-media-upload-dialog.html',
    path: routes.mediaLibrary,
    dialogName: /upload media/i,
    openDialog: async (page) => page.getByRole('button', { name: /upload media/i }).click(),
  },
  {
    name: 'admin-user-invite-dialog',
    skeleton: 'admin-user-invite-dialog.html',
    path: routes.userRoles,
    dialogName: /invite user/i,
    openDialog: async (page) => page.getByRole('button', { name: /invite user/i }).click(),
  },
  {
    name: 'admin-unsaved-changes-dialog',
    skeleton: 'admin-unsaved-changes-dialog.html',
    path: routes.tutorialEditorNew,
    dialogName: /unsaved changes/i,
    openDialog: async (page) => {
      await page.getByRole('textbox', { name: /^title$/i }).fill(`Visual draft ${Date.now().toString(36)}`);
      await page.getByRole('link', { name: /^tutorials$/i }).click();
    },
  },
  {
    name: 'signout-dialog',
    skeleton: 'signout-dialog.html',
    path: routes.profile,
    dialogName: /sign out/i,
    openDialog: async (page) => page.getByRole('button', { name: /^sign out$/i }).first().click(),
  },
  {
    name: 'session-expired-dialog',
    skeleton: 'session-expired-dialog.html',
    path: `${routes.signIn}?reason=expired`,
    dialogName: /session expired/i,
  },
];

test.describe('visual contract screenshots', () => {
  test('captures skeleton and app screenshots for every mapped route and dialog', async ({ page, request }, testInfo) => {
    test.setTimeout(240_000);
    const repoRoot = path.resolve(process.cwd(), '..');
    const outputDir = path.join(repoRoot, 'docs', 'review', 'visual', testInfo.project.name);
    await fs.mkdir(outputDir, { recursive: true });
    const seededTutorial = await resolveSeededTutorial(request);
    const cases = [
      ...routeCases,
      {
        name: 'admin-tutorial-editor-edit',
        skeleton: 'admin-tutorial-editor.html',
        path: routes.tutorialEditorEdit(seededTutorial.id),
      },
      {
        name: 'admin-step-editor',
        skeleton: 'admin-tutorial-editor.html',
        path: routes.stepEditor(seededTutorial.id, seededTutorial.stepId),
      },
      ...dialogCases,
    ];
    const skeletonFiles = (await fs.readdir(path.join(repoRoot, 'docs', 'skeletons')))
      .filter((file) => file.endsWith('.html'))
      .sort();
    const coveredSkeletons = new Set(cases.map((visualCase) => visualCase.skeleton));
    expect(skeletonFiles.filter((file) => !coveredSkeletons.has(file))).toEqual([]);

    const appErrors: string[] = [];
    let currentCase: VisualCase | null = null;
    page.on('pageerror', (error) => {
      if (currentCase) appErrors.push(`${currentCase.name}: ${error.message}`);
    });
    page.on('console', (message) => {
      if (currentCase && message.type() === 'error') {
        appErrors.push(`${currentCase.name}: console ${message.text()}`);
      }
    });
    page.on('response', (response) => {
      if (!currentCase) return;
      const url = response.url();
      const isAppResponse = url.startsWith(testInfo.config.projects[0]?.use.baseURL as string) ||
        url.startsWith(process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000');
      if (isAppResponse && response.status() >= 400) {
        appErrors.push(`${currentCase.name}: ${response.status()} ${url}`);
      }
    });

    const manifest: Array<{ name: string; skeleton: string; path: string; app: string; mock: string }> = [];
    for (const visualCase of cases) {
      const mockPath = path.join(outputDir, `${visualCase.name}-mock.png`);
      const appPath = path.join(outputDir, `${visualCase.name}-app.png`);

      await captureSkeleton(page, repoRoot, visualCase.skeleton, mockPath);

      currentCase = visualCase;
      await page.goto(visualCase.path);
      await waitForStableRoute(page);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      if (visualCase.openDialog) {
        await visualCase.openDialog(page);
      }
      if (visualCase.dialogName) {
        await expect(page.getByRole('dialog', { name: visualCase.dialogName })).toBeVisible();
      }
      await expectMaterialSymbolsReady(page);
      await expectNoPageHorizontalOverflow(page);
      await expectNoEmptyVisibleImages(page);
      await page.screenshot({ path: appPath, fullPage: true });
      currentCase = null;

      manifest.push({
        name: visualCase.name,
        skeleton: visualCase.skeleton,
        path: visualCase.path,
        mock: path.relative(repoRoot, mockPath),
        app: path.relative(repoRoot, appPath),
      });
    }

    await fs.writeFile(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify({ project: testInfo.project.name, cases: manifest }, null, 2),
    );
    expect(appErrors).toEqual([]);
  });
});

async function captureSkeleton(page: Page, repoRoot: string, skeleton: string, outputPath: string): Promise<void> {
  const skeletonPath = path.join(repoRoot, 'docs', 'skeletons', skeleton);
  await page.goto(pathToFileURL(skeletonPath).href, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  await page.screenshot({ path: outputPath, fullPage: true });
}

async function waitForStableRoute(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
}

async function expectNoPageHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const documentElement = document.documentElement;
    return {
      clientWidth: documentElement.clientWidth,
      scrollWidth: Math.max(documentElement.scrollWidth, document.body.scrollWidth),
    };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
}

async function expectNoEmptyVisibleImages(page: Page): Promise<void> {
  const brokenImages = await page.locator('img:visible').evaluateAll((images) =>
    images
      .filter((image) => {
        const element = image as HTMLImageElement;
        return !element.complete || element.naturalWidth === 0 || element.naturalHeight === 0;
      })
      .map((image) => (image as HTMLImageElement).src),
  );
  expect(brokenImages).toEqual([]);
}

async function expectMaterialSymbolsReady(page: Page): Promise<void> {
  const result = await page.evaluate(async () => {
    if (!document.querySelector('.material-symbols-outlined')) {
      return true;
    }

    await document.fonts.ready;
    return document.fonts.check('24px "Material Symbols Outlined"');
  });
  expect(result).toBe(true);
}

async function openFirstTutorialActions(page: Page): Promise<void> {
  await page
    .getByRole('table', { name: /tutorials/i })
    .getByRole('row')
    .filter({ has: page.getByRole('cell') })
    .first()
    .getByRole('button', { name: /actions/i })
    .click();
}

async function resolveSeededTutorial(
  request: APIRequestContext,
): Promise<{ id: string; stepId: string }> {
  const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
  const headers = { Authorization: `Bearer ${signJwt()}` };
  const listResponse = await request.get(`${apiURL}/api/v1/admin/tutorials?page=1&pageSize=50`, { headers });
  expect(listResponse.ok()).toBeTruthy();
  const list = (await listResponse.json()) as { items: Array<{ id: string; stepCount: number }> };
  const tutorial = list.items.find((item) => item.stepCount > 0) ?? list.items[0];
  expect(tutorial).toBeTruthy();

  const detailResponse = await request.get(`${apiURL}/api/v1/admin/tutorials/${tutorial.id}`, { headers });
  expect(detailResponse.ok()).toBeTruthy();
  const detail = (await detailResponse.json()) as { steps: Array<{ id: string }> };
  const step = detail.steps[0];
  expect(step).toBeTruthy();
  return { id: tutorial.id, stepId: step.id };
}

function signJwt(): string {
  const signingKey = 'development-only-signing-key-change-with-user-secrets';
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: 'prompt-sharp-dev',
      aud: 'prompt-sharp-api',
      sub: 'seed:admin',
      email: 'ada.admin@example.com',
      name: 'Ada Admin',
      role: ['User', 'Editor', 'Admin'],
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }),
  );
  const signature = crypto.createHmac('sha256', signingKey).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function base64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}
