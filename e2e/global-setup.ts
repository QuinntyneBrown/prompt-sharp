import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { FullConfig } from '@playwright/test';

const signingKey = 'development-only-signing-key-change-with-user-secrets';

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL ?? 'http://127.0.0.1:4200';
  const authDir = path.resolve(process.cwd(), '.auth');
  await fs.mkdir(authDir, { recursive: true });

  const token = signJwt({
    iss: 'prompt-sharp-dev',
    aud: 'prompt-sharp-api',
    sub: 'seed:learner',
    email: 'alex.learner@example.com',
    name: 'Alex Learner',
    role: ['User', 'Editor', 'Admin'],
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6,
  });

  await fs.writeFile(
    path.join(authDir, 'learner.json'),
    JSON.stringify(
      {
        cookies: [],
        origins: [
          {
            origin: new URL(baseURL).origin,
            localStorage: [
              {
                name: 'prompt-sharp.access-token',
                value: token,
              },
            ],
          },
        ],
      },
      null,
      2,
    ),
  );
}

function signJwt(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function base64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}
