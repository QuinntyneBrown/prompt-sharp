import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4201';
const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
const frontendPort = new URL(baseURL).port || '4201';
const sqlExpressConnection =
  'Server=.\\SQLEXPRESS;Database=PromptSharp;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL,
    storageState: '.auth/learner.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer:
    process.env.PLAYWRIGHT_SKIP_WEB_SERVER === '1'
      ? undefined
      : [
          {
            command:
              `powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:ASPNETCORE_ENVIRONMENT='Development'; ` +
              `$env:ConnectionStrings__PromptSharpDb='${sqlExpressConnection}'; ` +
              `$env:RateLimiting__WritePermitLimit='600'; ` +
              `dotnet run --project src\\PromptSharp.Api --urls ${apiURL}"`,
            cwd: '../backend',
            url: `${apiURL}/health/ready`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
          {
            command: `npm run start -- --host 127.0.0.1 --port ${frontendPort}`,
            cwd: '../frontend',
            url: baseURL,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
        ],
});
