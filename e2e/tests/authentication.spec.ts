import crypto from 'node:crypto';
import { test, expect } from '../fixtures/page-fixtures';
import { users } from '../fixtures/test-data';
import { routes } from '../pages/routes';

test.describe('authentication and authorization', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('sign-in screen offers OAuth providers and starts provider redirects', async ({ signInPage, page }) => {
    await signInPage.goto();
    await signInPage.expectLoaded();
    await signInPage.expectAuthOptions();

    await signInPage.signInWithProvider('Microsoft');
    await expect(page).toHaveURL(/login\.microsoftonline\.com|\/auth\/callback|\/sign-in/);
  });

  test('sign-in screen supports remember-me and credential validation fallback', async ({ signInPage, page }) => {
    await signInPage.goto();
    await signInPage.expectLoaded();

    await signInPage.toggleRememberMe();
    await signInPage.signInWithCredentials(users.learner.email, 'not-a-real-password');
    await expect(page.getByRole('alert')).toContainText(/invalid|failed|required/i);
  });

  test('OAuth callback shows processing and handles provider errors', async ({ oauthCallbackPage }) => {
    await oauthCallbackPage.goto();
    await oauthCallbackPage.expectLoaded();
    await oauthCallbackPage.expectProcessingState();

    await oauthCallbackPage.goto('/auth/callback?error=access_denied&error_description=Denied');
    await oauthCallbackPage.expectCallbackError();
  });

  test('access-denied explains missing roles and lets the user request access', async ({ accessDeniedPage, page }) => {
    await accessDeniedPage.goto();
    await accessDeniedPage.expectLoaded();
    await accessDeniedPage.expectRoleGuidance();

    await accessDeniedPage.requestAccess();
    await expect(page.getByRole('status')).toContainText(/request sent|administrator notified/i);
  });
});

test.describe('protected route guards', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('anonymous learner and admin routes redirect to sign-in', async ({ page }) => {
    await page.goto(routes.profile);
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page).toHaveURL(/returnUrl=%2Fme%2Fprofile/);

    await page.goto(routes.adminDashboard);
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page).toHaveURL(/returnUrl=%2Fadmin/);
  });

  test('non-admin users are sent to access denied for admin routes', async ({ page }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('prompt-sharp.access-token', token);
    }, unsignedToken(['User']));

    await page.goto(routes.adminDashboard);
    await expect(page).toHaveURL(/\/access-denied/);
  });

  test('expired tokens show the session expired dialog on sign-in', async ({ page, signInPage }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('prompt-sharp.access-token', token);
    }, unsignedToken(['Admin'], -60));

    await page.goto(routes.adminDashboard);
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page).toHaveURL(/reason=expired/);
    await signInPage.expectSessionExpiredDialog();
    await signInPage.acknowledgeSessionExpired();
    await expect(page.getByRole('dialog', { name: /session expired/i })).toBeHidden();
  });

  test('server-rejected tokens redirect through the session expired flow', async ({ page, signInPage }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('prompt-sharp.access-token', token);
    }, unsignedToken(['Admin']));

    await page.goto(routes.adminDashboard);
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page).toHaveURL(/returnUrl=%2Fadmin/);
    await expect(page).toHaveURL(/reason=expired/);
    await signInPage.expectSessionExpiredDialog();
  });
});

test.describe('role-specific auth states', () => {
  test.use({ storageState: '.auth/editor.json' });

  test('editor storage state is signed but does not satisfy admin-only routes', async ({ page }) => {
    await page.goto(routes.adminDashboard);
    await expect(page).toHaveURL(/\/access-denied/);
  });

  test('learner bearer token is forbidden by backend admin endpoints', async ({ request }) => {
    const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
    const response = await request.get(`${apiURL}/api/v1/admin/users`, {
      headers: {
        Authorization: `Bearer ${signJwt({
          sub: 'seed:learner',
          email: users.learner.email,
          name: users.learner.displayName,
          role: ['User'],
        })}`,
      },
    });

    expect(response.status()).toBe(403);
  });
});

function signJwt(payload: Record<string, unknown>): string {
  const signingKey = 'development-only-signing-key-change-with-user-secrets';
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64Url(
    JSON.stringify({
      iss: 'prompt-sharp-dev',
      aud: 'prompt-sharp-api',
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }),
  );
  const signature = crypto.createHmac('sha256', signingKey).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function unsignedToken(roles: string[], expiresInSeconds = 60 * 60): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: 'e2e:user-only',
      email: users.learner.email,
      name: users.learner.displayName,
      role: roles,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    }),
  ).toString('base64url');

  return `${header}.${payload}.signature`;
}

function base64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}
