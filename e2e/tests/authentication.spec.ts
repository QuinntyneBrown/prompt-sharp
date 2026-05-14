import { test, expect } from '../fixtures/page-fixtures';
import { users } from '../fixtures/test-data';

test.describe('authentication and authorization', () => {
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
