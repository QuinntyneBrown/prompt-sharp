import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { FullConfig } from '@playwright/test';

const signingKey = 'development-only-signing-key-change-with-user-secrets';
const apiURL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';

type AuthStateName = 'learner' | 'editor' | 'admin' | 'expired' | 'invalid';
type RuntimeAuthStateName = 'learner' | 'editor' | 'admin';

type AuthPayload = {
  sub: string;
  email: string;
  name: string;
  role: string[];
};

type Category = { id: string; slug: string; name: string };
type Tag = { id: string; slug: string; name: string };
type TutorialListItem = {
  id: string;
  slug: string;
  isPublished: boolean;
  isFeatured: boolean;
  isEditorsPick: boolean;
  stepCount: number;
};
type PagedResult<T> = { items: T[] };
type TutorialDetail = TutorialListItem & { steps: Array<{ id: string }> };
type Media = { id: string; fileName: string };

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL ?? 'http://127.0.0.1:4200';
  const authDir = path.resolve(process.cwd(), '.auth');
  await fs.mkdir(authDir, { recursive: true });

  const identities = {
    learner: {
      sub: 'seed:learner',
      email: 'alex.learner@example.com',
      name: 'Alex Learner',
      role: ['User'],
    },
    editor: {
      sub: 'seed:editor',
      email: 'erin.editor@example.com',
      name: 'Erin Editor',
      role: ['User', 'Editor'],
    },
    admin: {
      sub: 'seed:admin',
      email: 'ada.admin@example.com',
      name: 'Ada Admin',
      role: ['User', 'Editor', 'Admin'],
    },
  } satisfies Record<RuntimeAuthStateName, AuthPayload>;

  const tokens = {} as Record<RuntimeAuthStateName, string>;
  for (const [name, payload] of Object.entries(identities) as Array<[RuntimeAuthStateName, AuthPayload]>) {
    tokens[name] = await writeStorageState(authDir, baseURL, name, payload);
  }
  await writeStorageState(authDir, baseURL, 'expired', {
    sub: 'seed:admin',
    email: 'ada.admin@example.com',
    name: 'Ada Admin',
    role: ['User', 'Editor', 'Admin'],
  }, -60);
  await writeRawStorageState(authDir, baseURL, 'invalid', 'invalid.jwt.signature');

  await ensureE2eData(tokens);
}

async function writeStorageState(
  authDir: string,
  baseURL: string,
  name: AuthStateName,
  payload: AuthPayload,
  expiresInSeconds = 60 * 60 * 6,
): Promise<string> {
  const token = signJwt({
    iss: 'prompt-sharp-dev',
    aud: 'prompt-sharp-api',
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });

  await writeRawStorageState(authDir, baseURL, name, token);
  return token;
}

async function writeRawStorageState(
  authDir: string,
  baseURL: string,
  name: AuthStateName,
  token: string,
): Promise<void> {
  await fs.writeFile(
    path.join(authDir, `${name}.json`),
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

async function ensureE2eData(tokens: Record<RuntimeAuthStateName, string>): Promise<void> {
  await waitForApi();

  await Promise.all([
    apiGet('api/v1/me', tokens.learner),
    apiGet('api/v1/me', tokens.editor),
    apiGet('api/v1/me', tokens.admin),
  ]);

  const dotnet = await ensureCategory(tokens.admin, { slug: 'dotnet', name: '.NET', order: 1 });
  const blazor = await ensureCategory(tokens.admin, { slug: 'blazor', name: 'Blazor', order: 2 });
  const azureCategory = await ensureCategory(tokens.admin, { slug: 'azure', name: 'Azure', order: 3 });
  const ai = await ensureCategory(tokens.admin, { slug: 'ai', name: 'AI', order: 4 });

  const azure = await ensureTag(tokens.admin, { slug: 'azure', name: 'Azure' });
  const cleanArchitecture = await ensureTag(tokens.admin, { slug: 'clean-architecture', name: 'Clean Architecture' });
  const containerApps = await ensureTag(tokens.admin, { slug: 'container-apps', name: 'Container Apps' });
  const csharp = await ensureTag(tokens.admin, { slug: 'csharp', name: 'C#' });
  const aspnetCore = await ensureTag(tokens.admin, { slug: 'aspnet-core', name: 'ASP.NET Core' });
  const sqlServer = await ensureTag(tokens.admin, { slug: 'sql-server', name: 'SQL Server' });
  const openai = await ensureTag(tokens.admin, { slug: 'openai', name: 'OpenAI' });
  const security = await ensureTag(tokens.admin, { slug: 'security', name: 'Security' });
  const svgMedia = await ensureMedia(tokens.admin, 'promptsharp-diagram.svg');
  await ensurePngMedia(tokens.admin);

  const cleanArchitectureTutorial = await ensureTutorial(tokens.admin, {
    slug: 'build-dotnet-api-with-clean-architecture',
    title: 'Build a .NET API with Clean Architecture',
    summary: 'Create a production-ready API using controllers, MediatR, EF Core, and SQL Server.',
    difficultyLevel: 'intermediate',
    estimatedMinutes: 45,
    categoryId: dotnet.id,
    tagIds: [azure.id, cleanArchitecture.id],
    featured: true,
    editorsPick: true,
    steps: [
      {
        title: 'Create the solution structure',
        bodyMarkdown: 'Create separate API, Application, Domain, and Infrastructure projects.',
        codeSnippet: 'dotnet new sln --name PromptSharp',
        codeLanguage: 'Bash',
        imageMediaId: svgMedia.id,
      },
      {
        title: 'Add the first endpoint',
        bodyMarkdown: 'Wire a controller through MediatR and return data from SQL Server.',
        codeSnippet: 'dotnet add package MediatR',
        codeLanguage: 'Bash',
        imageMediaId: null,
      },
    ],
  });

  await ensureTutorial(tokens.admin, {
    slug: 'ship-blazor-dashboard-with-azure-container-apps',
    title: 'Ship a Blazor dashboard with Azure Container Apps',
    summary: 'Deploy a dashboard with containerized hosting, managed identity, and observability.',
    difficultyLevel: 'advanced',
    estimatedMinutes: 60,
    categoryId: blazor.id,
    tagIds: [azure.id, containerApps.id],
    featured: true,
    editorsPick: false,
    steps: [
      {
        title: 'Create the dashboard shell',
        bodyMarkdown: 'Build the first Blazor dashboard page and prepare it for deployment.',
        codeSnippet: 'dotnet new blazor -n PromptSharp.Dashboard',
        codeLanguage: 'Bash',
        imageMediaId: null,
      },
    ],
  });

  await ensureTutorial(tokens.admin, {
    slug: 'publish-observable-apis-on-azure',
    title: 'Publish observable APIs on Azure',
    summary: 'Add structured logs, traces, and deployment settings for Azure-hosted APIs.',
    difficultyLevel: 'beginner',
    estimatedMinutes: 30,
    categoryId: azureCategory.id,
    tagIds: [azure.id],
    featured: false,
    editorsPick: false,
    steps: [
      {
        title: 'Enable health checks',
        bodyMarkdown: 'Expose readiness and liveness checks before deploying.',
        codeSnippet: 'builder.Services.AddHealthChecks();',
        codeLanguage: 'CSharp',
        imageMediaId: null,
      },
    ],
  });

  await ensureTutorial(tokens.admin, {
    slug: 'build-a-dotnet-api',
    title: 'Build a .NET API',
    summary: 'Create a complete ASP.NET Core API backed by SQL Server and clean architecture.',
    difficultyLevel: 'intermediate',
    estimatedMinutes: 50,
    categoryId: dotnet.id,
    tagIds: [csharp.id, aspnetCore.id, sqlServer.id],
    featured: false,
    editorsPick: false,
    steps: [
      {
        title: 'Create the solution',
        bodyMarkdown: 'Start with a layered solution and a test project.',
        codeSnippet: 'dotnet new sln --name PromptSharp.Api',
        codeLanguage: 'Bash',
        imageMediaId: svgMedia.id,
      },
      {
        title: 'Add the API project',
        bodyMarkdown: 'Create an ASP.NET Core Web API and wire dependency injection.',
        codeSnippet: 'dotnet new webapi -n PromptSharp.Api',
        codeLanguage: 'Bash',
        imageMediaId: null,
      },
      {
        title: 'Connect SQL Server',
        bodyMarkdown: 'Add EF Core and configure SQL Server persistence.',
        codeSnippet: 'builder.Services.AddDbContext<AppDbContext>();',
        codeLanguage: 'CSharp',
        imageMediaId: null,
      },
      {
        title: 'Add validation',
        bodyMarkdown: 'Validate commands before they reach persistence.',
        codeSnippet: 'RuleFor(command => command.Title).NotEmpty();',
        codeLanguage: 'CSharp',
        imageMediaId: null,
      },
    ],
  });

  await ensureTutorial(tokens.admin, {
    slug: 'deploy-to-azure',
    title: 'Deploy to Azure',
    summary: 'Publish a monitored application to Azure with managed configuration.',
    difficultyLevel: 'beginner',
    estimatedMinutes: 35,
    categoryId: azureCategory.id,
    tagIds: [azure.id, sqlServer.id],
    featured: true,
    editorsPick: false,
    steps: [
      {
        title: 'Prepare the deployment',
        bodyMarkdown: 'Configure environment variables and health checks.',
        codeSnippet: 'az webapp config appsettings set',
        codeLanguage: 'Bash',
        imageMediaId: null,
      },
      {
        title: 'Deploy the API',
        bodyMarkdown: 'Push the application to the Azure host.',
        codeSnippet: 'az webapp deploy',
        codeLanguage: 'Bash',
        imageMediaId: null,
      },
    ],
  });

  await ensureTutorial(tokens.admin, {
    slug: 'secure-blazor-app',
    title: 'Secure a Blazor App',
    summary: 'Protect a Blazor application with role-aware navigation and API authorization.',
    difficultyLevel: 'advanced',
    estimatedMinutes: 55,
    categoryId: blazor.id,
    tagIds: [security.id, aspnetCore.id],
    featured: false,
    editorsPick: true,
    steps: [
      {
        title: 'Add authentication',
        bodyMarkdown: 'Configure authentication state and protected routes.',
        codeSnippet: 'builder.Services.AddAuthorizationCore();',
        codeLanguage: 'CSharp',
        imageMediaId: null,
      },
      {
        title: 'Protect API calls',
        bodyMarkdown: 'Send bearer tokens and handle forbidden responses.',
        codeSnippet: 'request.Headers.Authorization = authHeader;',
        codeLanguage: 'CSharp',
        imageMediaId: null,
      },
    ],
  });

  await ensureTutorial(tokens.admin, {
    slug: 'draft-openai-workflow',
    title: 'Draft OpenAI Workflow',
    summary: 'Draft an AI-assisted workflow that is intentionally unpublished for admin testing.',
    difficultyLevel: 'beginner',
    estimatedMinutes: 25,
    categoryId: ai.id,
    tagIds: [openai.id, security.id],
    featured: false,
    editorsPick: false,
    published: false,
    steps: [
      {
        title: 'Sketch the workflow',
        bodyMarkdown: 'Document the prompts, safety checks, and persistence points.',
        codeSnippet: 'const workflow = createWorkflow();',
        codeLanguage: 'TypeScript',
        imageMediaId: null,
      },
    ],
  });

  await ensureLearnerState(tokens.learner, cleanArchitectureTutorial);
  await ensureInvitation(tokens.admin, 'casey.pending@example.com');
}

async function waitForApi(): Promise<void> {
  const deadline = Date.now() + 120_000;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${apiURL}/health/ready`);
      if (response.ok) {
        return;
      }
      lastError = new Error(`ready check returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`PromptSharp API was not ready at ${apiURL}: ${String(lastError)}`);
}

async function ensureCategory(token: string, input: { slug: string; name: string; order: number }): Promise<Category> {
  const categories = await apiGet<Category[]>('api/v1/admin/categories', token);
  const existing = categories.find((category) => category.slug === input.slug);
  if (existing) {
    return existing;
  }

  return apiJson<Category>('api/v1/admin/categories', token, 'POST', input);
}

async function ensureTag(token: string, input: { slug: string; name: string }): Promise<Tag> {
  const tags = await apiGet<Tag[]>('api/v1/admin/tags', token);
  const existing = tags.find((tag) => tag.slug === input.slug);
  if (existing) {
    return existing;
  }

  return apiJson<Tag>('api/v1/admin/tags', token, 'POST', input);
}

async function ensureTutorial(
  token: string,
  input: {
    slug: string;
    title: string;
    summary: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    estimatedMinutes: number;
    categoryId: string;
    tagIds: string[];
    featured: boolean;
    editorsPick: boolean;
    published?: boolean;
    steps: Array<{
      title: string;
      bodyMarkdown: string;
      codeSnippet: string;
      codeLanguage: string;
      imageMediaId: string | null;
    }>;
  },
): Promise<TutorialDetail> {
  const list = await apiGet<PagedResult<TutorialListItem>>(
    `api/v1/admin/tutorials?page=1&pageSize=100&search=${encodeURIComponent(input.slug)}`,
    token,
  );
  const existing = list.items.find((tutorial) => tutorial.slug === input.slug);
  let tutorial = existing
    ? await apiGet<TutorialDetail>(`api/v1/admin/tutorials/${existing.id}`, token)
    : await apiJson<TutorialDetail>('api/v1/admin/tutorials', token, 'POST', {
        slug: input.slug,
        title: input.title,
        summary: input.summary,
        difficultyLevel: input.difficultyLevel,
        estimatedMinutes: input.estimatedMinutes,
        categoryId: input.categoryId,
        tagIds: input.tagIds,
      });

  if (tutorial.stepCount !== input.steps.length) {
    tutorial = await apiJson<TutorialDetail>(`api/v1/admin/tutorials/${tutorial.id}/steps`, token, 'PUT', input.steps);
  }
  if (input.published !== false && !tutorial.isPublished) {
    tutorial = await apiJson<TutorialDetail>(`api/v1/admin/tutorials/${tutorial.id}/publish`, token, 'POST', null);
  }
  if (input.featured && !tutorial.isFeatured) {
    tutorial = await apiJson<TutorialDetail>(`api/v1/admin/tutorials/${tutorial.id}/feature`, token, 'POST', null);
  }
  if (input.editorsPick && !tutorial.isEditorsPick) {
    tutorial = await apiJson<TutorialDetail>(`api/v1/admin/tutorials/${tutorial.id}/editors-pick`, token, 'POST', null);
  }

  return tutorial;
}

async function ensureLearnerState(token: string, tutorial: TutorialDetail): Promise<void> {
  await apiJson<void>(`api/v1/me/bookmarks/${tutorial.id}`, token, 'POST', null);
  const step = tutorial.steps[0];
  if (step) {
    await apiJson<void>(`api/v1/me/progress/${tutorial.id}`, token, 'PUT', {
      currentStepId: step.id,
      completedStepIds: [step.id],
    });
  }
}

async function ensureMedia(token: string, fileName = 'promptsharp-diagram.svg'): Promise<Media> {
  const media = await apiGet<Media[]>('api/v1/admin/media', token);
  const existing = media.find((item) => item.fileName === fileName);
  if (existing) {
    return existing;
  }

  const filePath = path.resolve(process.cwd(), 'fixtures', 'files', fileName);
  const content = await fs.readFile(filePath);
  const form = new FormData();
  form.append('file', new Blob([content], { type: 'image/svg+xml' }), fileName);

  return apiFetch<Media>('api/v1/admin/media', token, { method: 'POST', body: form });
}

async function ensurePngMedia(token: string): Promise<Media> {
  const media = await apiGet<Media[]>('api/v1/admin/media', token);
  const existing = media.find((item) => item.fileName === 'promptsharp-pixel.png');
  if (existing) {
    return existing;
  }

  const form = new FormData();
  form.append(
    'file',
    new Blob([Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], { type: 'image/png' }),
    'promptsharp-pixel.png',
  );

  return apiFetch<Media>('api/v1/admin/media', token, { method: 'POST', body: form });
}

async function ensureInvitation(token: string, email: string): Promise<void> {
  await apiJson('api/v1/admin/users/invitations', token, 'POST', { email, roles: ['User'] });
}

async function apiGet<T>(pathAndQuery: string, token: string): Promise<T> {
  return apiFetch<T>(pathAndQuery, token);
}

async function apiJson<T>(
  pathAndQuery: string,
  token: string,
  method: 'POST' | 'PUT',
  body: unknown,
): Promise<T> {
  return apiFetch<T>(pathAndQuery, token, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === null ? undefined : JSON.stringify(body),
  });
}

async function apiFetch<T>(pathAndQuery: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiURL}/${pathAndQuery}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`${init.method ?? 'GET'} ${pathAndQuery} failed with ${response.status}: ${await response.text()}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
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
