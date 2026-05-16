import { Project } from '../models/project';

export const PROJECT_FIXTURE: Project = {
  id: '0142',
  idea: 'A markdown note-taking app with realtime sync, end-to-end encryption, and OAuth.',
  createdLabel: '4m ago',
  promptCount: 14,
  phaseCount: 5,
  estimate: '~3 days',
  status: 'in progress',
  phases: [
    {
      ix: '01',
      title: 'Foundation',
      prompts: [
        {
          n: '01',
          title: 'Write the product spec',
          body: 'Draft a one-page spec for the app. Cover: target user, top 3 user stories, must-have features, explicit non-goals, success metric. Keep it under 300 words.',
          tags: ['spec', '30 min']
        },
        {
          n: '02',
          title: 'Choose the stack',
          body: 'Pick a stack that fits the spec. Justify each choice in one sentence: language, framework, database, hosting, auth provider. Avoid trendy choices without reason.',
          tags: ['architecture', '15 min']
        },
        {
          n: '03',
          title: 'Initialize the repo',
          body: 'Create a new repo, set up the project skeleton, configure linting, formatting, and a CI pipeline that runs lint and typecheck on every push.',
          tags: ['setup', '45 min']
        }
      ]
    },
    {
      ix: '02',
      title: 'Data & Auth',
      prompts: [
        {
          n: '04',
          title: 'Design the data model',
          body: 'Define the database schema for users, notes, and sync events. Write the migration file. Include indexes for the most common queries.',
          tags: ['schema', '1 hr']
        },
        {
          n: '05',
          title: 'Implement OAuth sign-in',
          body: 'Add OAuth with Google and GitHub. Store the user record on first sign-in. Add a /me endpoint that returns the current user. Cover both happy path and error states.',
          tags: ['auth', '2 hr']
        },
        {
          n: '06',
          title: 'Set up end-to-end encryption keys',
          body: 'On first sign-in, generate a per-user keypair in the browser. Store the public key server-side. Persist the private key in IndexedDB. Document the key rotation story.',
          tags: ['security', '3 hr']
        }
      ]
    },
    {
      ix: '03',
      title: 'Core features',
      prompts: [
        {
          n: '07',
          title: 'Build note CRUD',
          body: 'Implement create, read, update, and delete for notes. Encrypt the body client-side before sending. The server should never see plaintext.',
          tags: ['feature', '4 hr']
        },
        {
          n: '08',
          title: 'Markdown editor with live preview',
          body: 'Build a markdown editor with a side-by-side preview. Support common shortcuts. Persist changes locally first, then sync.',
          tags: ['ui', '1 day']
        },
        {
          n: '09',
          title: 'Realtime sync with CRDT',
          body: 'Add realtime sync using a CRDT library. Reconcile changes from multiple devices. Test offline → online transitions explicitly.',
          tags: ['sync', '1.5 days']
        }
      ]
    },
    {
      ix: '04',
      title: 'Quality',
      prompts: [
        {
          n: '10',
          title: 'Write integration tests for the auth + sync flows',
          body: 'Cover sign-in, key generation, note create, edit on a second device, conflict resolution. Tests should hit a real test database, not mocks.',
          tags: ['tests', '4 hr']
        },
        {
          n: '11',
          title: 'Add error tracking and logging',
          body: 'Wire up error tracking on both client and server. Redact note content from logs. Add a basic dashboard for error rates.',
          tags: ['observability', '2 hr']
        },
        {
          n: '12',
          title: 'Security review',
          body: 'Audit the encryption flow, OAuth handling, and any place user content touches the server. Document the threat model.',
          tags: ['security', '3 hr']
        }
      ]
    },
    {
      ix: '05',
      title: 'Ship',
      prompts: [
        {
          n: '13',
          title: 'Set up production deployment',
          body: 'Configure the hosting environment, environment variables, and database migrations. Add a one-command deploy. Set up a staging environment that mirrors prod.',
          tags: ['deploy', '3 hr']
        },
        {
          n: '14',
          title: 'Write the landing page and launch',
          body: "Draft a one-page landing site. Include the value prop, a short demo, and a sign-up CTA. Announce on one channel. Watch the error tracker.",
          tags: ['launch', '1 day']
        }
      ]
    }
  ]
};
