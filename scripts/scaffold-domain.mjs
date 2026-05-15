// Scaffolds Angular component files for domain library per docs/domain-components-plan.md.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = 'C:/projects/prompt-sharp/frontend/projects/domain/src/lib';

function pascal(name) {
  return name
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function toSelector(name) {
  return `ps-${name}`;
}

// type: 'leaf' | 'smart'
// componentImports: array of class names from components lib
// apiServices: array from api lib (for smart pages)
function writeComponent(dir, name, options = {}) {
  const className = pascal(name);
  const selector = toSelector(name);
  const folder = join(ROOT, dir, name);
  mkdirSync(folder, { recursive: true });

  const inputs = options.inputs ?? [];
  const outputs = options.outputs ?? [];
  const apiServices = options.apiServices ?? [];
  const isSmart = options.smart === true;

  const angularImports = ['ChangeDetectionStrategy', 'Component'];
  if (inputs.length) angularImports.push('input');
  if (outputs.length) angularImports.push('output');
  if (isSmart && apiServices.length) angularImports.push('inject', 'signal');

  const lines = [];
  lines.push(`import { ${[...new Set(angularImports)].join(', ')} } from '@angular/core';`);
  if (isSmart && apiServices.length) {
    lines.push(`import { ${apiServices.join(', ')} } from 'api';`);
  }
  lines.push('');
  lines.push(`@Component({`);
  lines.push(`  selector: '${selector}',`);
  lines.push(`  templateUrl: './${name}.html',`);
  lines.push(`  styleUrl: './${name}.scss',`);
  lines.push(`  changeDetection: ChangeDetectionStrategy.OnPush,`);
  lines.push(`})`);
  lines.push(`export class ${className} {`);
  for (const i of inputs) {
    if (i.required) {
      lines.push(`  readonly ${i.name} = input.required<${i.type}>();`);
    } else {
      const { type, init } = defaultForOptional(i);
      lines.push(`  readonly ${i.name} = input<${type}>(${init});`);
    }
  }
  for (const o of outputs) {
    lines.push(`  readonly ${o.name} = output<${o.type}>();`);
  }
  if (isSmart) {
    for (const s of apiServices) {
      const propName = s.charAt(0).toLowerCase() + s.slice(1).replace(/Api$/, 'Api');
      lines.push(`  protected readonly ${propName} = inject(${s});`);
    }
    lines.push(`  protected readonly loading = signal<boolean>(false);`);
    lines.push(`  protected readonly error = signal<string | null>(null);`);
  }
  lines.push(`}`);
  lines.push('');

  writeFileSync(join(folder, `${name}.ts`), lines.join('\n'));

  // HTML
  const htmlLines = [`<div class="${name}">`];
  htmlLines.push(`  <!-- ${className} scaffold -->`);
  for (const i of inputs) {
    if (i.type === 'string' || i.type === 'string | null') {
      htmlLines.push(`  <span class="${i.name}">{{ ${i.name}() }}</span>`);
    }
  }
  htmlLines.push(`  <ng-content></ng-content>`);
  htmlLines.push(`</div>`);
  htmlLines.push('');
  writeFileSync(join(folder, `${name}.html`), htmlLines.join('\n'));

  // SCSS
  writeFileSync(
    join(folder, `${name}.scss`),
    `:host {\n  display: block;\n}\n\n.${name} {\n  display: block;\n}\n`,
  );

  // Spec
  const spec = `import { TestBed } from '@angular/core/testing';
import { ${className} } from './${name}';

describe('${className}', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(${className});
${inputs
  .filter((i) => i.required)
  .map(
    (i) =>
      `    fixture.componentRef.setInput('${i.name}', ${defaultLiteral(i.type)});`,
  )
  .join('\n')}
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
`;
  writeFileSync(join(folder, `${name}.spec.ts`), spec);
}

function defaultForOptional(i) {
  if (i.default !== undefined) return { type: i.type, init: i.default };
  const t = i.type;
  if (t === 'boolean') return { type: 'boolean', init: 'false' };
  if (t === 'number') return { type: 'number', init: '0' };
  if (t.endsWith('[]')) return { type: t, init: '[]' };
  // string, string | null, union literals, complex types - widen with null
  const widened = t.includes('| null') ? t : `${t} | null`;
  return { type: widened, init: 'null' };
}

function defaultLiteral(type) {
  if (type.includes('string')) return `'sample'`;
  if (type.includes('number')) return `0`;
  if (type.includes('boolean')) return `false`;
  if (type.includes('[]')) return `[]`;
  return `null as never`;
}

// Component definitions per plan
const COMPONENTS = [
  // Layout organisms
  { dir: 'layout', name: 'public-shell' },
  {
    dir: 'layout',
    name: 'public-nav',
    inputs: [
      { name: 'activeRoute', type: 'string | null' },
      { name: 'signedIn', type: 'boolean' },
    ],
    outputs: [
      { name: 'signIn', type: 'void' },
      { name: 'signOut', type: 'void' },
    ],
  },
  { dir: 'layout', name: 'public-footer' },
  { dir: 'layout', name: 'admin-shell' },
  {
    dir: 'layout',
    name: 'admin-nav-rail',
    inputs: [
      { name: 'collapsed', type: 'boolean' },
      { name: 'activeRoute', type: 'string | null' },
    ],
    outputs: [{ name: 'collapseToggled', type: 'void' }],
  },
  {
    dir: 'layout',
    name: 'admin-topbar',
    inputs: [{ name: 'currentUserName', type: 'string | null' }],
    outputs: [{ name: 'signOut', type: 'void' }],
  },
  { dir: 'layout', name: 'public-dialog-backdrop' },

  // Public pages
  {
    dir: 'public',
    name: 'home-page',
    smart: true,
    apiServices: ['PromptSharpTutorialsApi'],
  },
  { dir: 'public', name: 'home-hero' },
  { dir: 'public', name: 'tutorial-tracks' },
  { dir: 'public', name: 'marquee-strip' },
  { dir: 'public', name: 'about-page' },
  { dir: 'public', name: 'about-hero' },
  { dir: 'public', name: 'about-body' },
  { dir: 'public', name: 'contact-card' },
  { dir: 'public', name: 'error-page' },

  // Auth
  { dir: 'auth', name: 'access-denied-page' },
  {
    dir: 'auth',
    name: 'sign-in-page',
    outputs: [{ name: 'submitted', type: '{ email: string; password: string }' }],
  },
  { dir: 'auth', name: 'sign-in-card' },
  {
    dir: 'auth',
    name: 'sign-in-field-row',
    inputs: [
      { name: 'label', type: 'string', required: true },
      { name: 'kind', type: "'text' | 'password'" },
    ],
  },
  { dir: 'auth', name: 'sign-in-footer' },
  {
    dir: 'auth',
    name: 'oauth-callback-page',
    outputs: [{ name: 'completed', type: 'void' }],
  },
  {
    dir: 'auth',
    name: 'oauth-consent-page',
    outputs: [
      { name: 'approved', type: 'void' },
      { name: 'denied', type: 'void' },
    ],
  },
  { dir: 'auth', name: 'oauth-consent-card' },

  // Tutorial
  { dir: 'tutorial', name: 'featured-tutorials' },
  { dir: 'tutorial', name: 'latest-tutorials' },
  {
    dir: 'tutorial',
    name: 'tutorial-card',
    inputs: [
      { name: 'title', type: 'string', required: true },
      { name: 'slug', type: 'string', required: true },
      { name: 'summary', type: 'string | null' },
    ],
    outputs: [{ name: 'selected', type: 'void' }],
  },
  {
    dir: 'tutorial',
    name: 'tutorial-detail-page',
    smart: true,
    apiServices: ['PromptSharpTutorialsApi', 'PromptSharpMeApi'],
  },
  {
    dir: 'tutorial',
    name: 'tutorial-breadcrumbs',
    inputs: [{ name: 'crumbs', type: '{ label: string; href: string | null }[]' }],
  },
  { dir: 'tutorial', name: 'tutorial-hero' },
  { dir: 'tutorial', name: 'tutorial-toc' },
  { dir: 'tutorial', name: 'tutorial-body' },
  {
    dir: 'tutorial',
    name: 'tutorial-code-block',
    inputs: [
      { name: 'language', type: 'string | null' },
      { name: 'code', type: 'string', required: true },
    ],
  },
  {
    dir: 'tutorial',
    name: 'tutorial-step-nav',
    outputs: [
      { name: 'next', type: 'void' },
      { name: 'previous', type: 'void' },
    ],
  },
  { dir: 'tutorial', name: 'related-tutorials' },

  // Catalog
  {
    dir: 'catalog',
    name: 'catalog-page',
    smart: true,
    apiServices: [
      'PromptSharpTutorialsApi',
      'PromptSharpCategoriesApi',
      'PromptSharpTagsApi',
    ],
  },
  { dir: 'catalog', name: 'catalog-header' },
  {
    dir: 'catalog',
    name: 'catalog-toolbar',
    outputs: [
      { name: 'sortChanged', type: 'string' },
      { name: 'viewChanged', type: 'string' },
    ],
  },
  { dir: 'catalog', name: 'catalog-body' },
  { dir: 'catalog', name: 'catalog-grid' },
  {
    dir: 'catalog',
    name: 'filter-rail',
    outputs: [{ name: 'filtersChanged', type: 'Record<string, unknown>' }],
  },
  {
    dir: 'catalog',
    name: 'pagination',
    inputs: [
      { name: 'page', type: 'number' },
      { name: 'pageCount', type: 'number' },
    ],
    outputs: [{ name: 'pageChanged', type: 'number' }],
  },
  {
    dir: 'catalog',
    name: 'category-page',
    smart: true,
    apiServices: [
      'PromptSharpCategoriesApi',
      'PromptSharpTagsApi',
      'PromptSharpTutorialsApi',
    ],
  },
  { dir: 'catalog', name: 'category-hero' },
  {
    dir: 'catalog',
    name: 'search-page',
    smart: true,
    apiServices: ['PromptSharpTutorialsApi'],
  },
  {
    dir: 'catalog',
    name: 'search-bar',
    outputs: [{ name: 'queryChanged', type: 'string' }],
  },
  { dir: 'catalog', name: 'search-meta' },
  { dir: 'catalog', name: 'results-list' },

  // Profile
  {
    dir: 'profile',
    name: 'profile-page',
    smart: true,
    apiServices: ['PromptSharpMeApi'],
  },
  { dir: 'profile', name: 'profile-hero' },
  {
    dir: 'profile',
    name: 'profile-section',
    inputs: [{ name: 'heading', type: 'string', required: true }],
  },

  // Progress
  {
    dir: 'progress',
    name: 'progress-page',
    smart: true,
    apiServices: ['PromptSharpMeApi'],
  },
  { dir: 'progress', name: 'progress-list' },
  {
    dir: 'progress',
    name: 'progress-row',
    inputs: [
      { name: 'title', type: 'string', required: true },
      { name: 'percent', type: 'number' },
    ],
  },

  // Admin shared
  {
    dir: 'admin/shared',
    name: 'admin-kpi-card',
    inputs: [
      { name: 'label', type: 'string', required: true },
      { name: 'value', type: 'string', required: true },
    ],
  },
  { dir: 'admin/shared', name: 'admin-activity-list' },
  { dir: 'admin/shared', name: 'admin-table-shell' },
  {
    dir: 'admin/shared',
    name: 'admin-row-actions',
    outputs: [
      { name: 'edit', type: 'void' },
      { name: 'remove', type: 'void' },
    ],
  },
  {
    dir: 'admin/shared',
    name: 'admin-filter-chips',
    outputs: [{ name: 'filtersChanged', type: 'string[]' }],
  },

  // Admin dashboard
  { dir: 'admin/dashboard', name: 'admin-dashboard-page' },

  // Admin tutorials
  {
    dir: 'admin/tutorials',
    name: 'admin-tutorial-list-page',
    smart: true,
    apiServices: ['PromptSharpAdminTutorialsApi'],
  },
  { dir: 'admin/tutorials', name: 'admin-tutorial-table' },
  {
    dir: 'admin/tutorials',
    name: 'admin-tutorial-row',
    outputs: [
      { name: 'edit', type: 'void' },
      { name: 'remove', type: 'void' },
    ],
  },
  {
    dir: 'admin/tutorials',
    name: 'admin-tutorial-dialog',
    outputs: [
      { name: 'submitted', type: 'unknown' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  { dir: 'admin/tutorials', name: 'admin-tutorial-list-mini' },
  {
    dir: 'admin/tutorials',
    name: 'admin-tutorial-editor-page',
    smart: true,
    apiServices: [
      'PromptSharpAdminTutorialsApi',
      'PromptSharpAdminCategoriesApi',
      'PromptSharpAdminTagsApi',
      'PromptSharpAdminMediaApi',
    ],
  },
  { dir: 'admin/tutorials', name: 'tutorial-editor-layout' },
  { dir: 'admin/tutorials', name: 'step-outline' },
  {
    dir: 'admin/tutorials',
    name: 'step-outline-item',
    inputs: [{ name: 'title', type: 'string', required: true }],
  },
  { dir: 'admin/tutorials', name: 'step-block-editor' },
  {
    dir: 'admin/tutorials',
    name: 'step-block-row',
    inputs: [{ name: 'kind', type: "'prose' | 'code' | 'image' | 'callout'" }],
  },
  { dir: 'admin/tutorials', name: 'tutorial-metadata-panel' },

  // Admin taxonomy
  {
    dir: 'admin/taxonomy',
    name: 'admin-taxonomy-page',
    smart: true,
    apiServices: ['PromptSharpAdminCategoriesApi', 'PromptSharpAdminTagsApi'],
  },
  { dir: 'admin/taxonomy', name: 'admin-taxonomy-table' },
  {
    dir: 'admin/taxonomy',
    name: 'admin-taxonomy-row',
    outputs: [
      { name: 'edit', type: 'void' },
      { name: 'remove', type: 'void' },
    ],
  },

  // Admin media
  {
    dir: 'admin/media',
    name: 'admin-media-page',
    smart: true,
    apiServices: ['PromptSharpAdminMediaApi'],
  },
  { dir: 'admin/media', name: 'media-filter-rail' },
  { dir: 'admin/media', name: 'media-grid' },
  {
    dir: 'admin/media',
    name: 'media-card',
    inputs: [
      { name: 'filename', type: 'string', required: true },
      { name: 'thumbnailUrl', type: 'string | null' },
    ],
    outputs: [{ name: 'selectedChanged', type: 'boolean' }],
  },
  {
    dir: 'admin/media',
    name: 'media-selection-bar',
    outputs: [{ name: 'bulkActioned', type: 'string' }],
  },

  // Admin users
  {
    dir: 'admin/users',
    name: 'admin-users-page',
    smart: true,
    apiServices: ['PromptSharpAdminUsersApi'],
  },
  { dir: 'admin/users', name: 'admin-users-table' },
  {
    dir: 'admin/users',
    name: 'admin-user-row',
    outputs: [
      { name: 'edit', type: 'void' },
      { name: 'remove', type: 'void' },
    ],
  },
  {
    dir: 'admin/users',
    name: 'user-role-chips',
    outputs: [{ name: 'rolesChanged', type: 'string[]' }],
  },

  // Admin audit
  { dir: 'admin/audit', name: 'admin-audit-log-page' },
  { dir: 'admin/audit', name: 'audit-log-table' },
  { dir: 'admin/audit', name: 'audit-log-row' },
  { dir: 'admin/audit', name: 'audit-filter-rail' },

  // Dialogs
  {
    dir: 'dialogs',
    name: 'tutorial-dialog',
    outputs: [
      { name: 'submitted', type: 'unknown' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  {
    dir: 'dialogs',
    name: 'confirm-delete-dialog',
    inputs: [{ name: 'itemName', type: 'string | null' }],
    outputs: [
      { name: 'confirmed', type: 'void' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  {
    dir: 'dialogs',
    name: 'publish-dialog',
    outputs: [
      { name: 'submitted', type: 'unknown' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  {
    dir: 'dialogs',
    name: 'category-dialog',
    outputs: [
      { name: 'submitted', type: 'unknown' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  {
    dir: 'dialogs',
    name: 'media-upload-dialog',
    outputs: [
      { name: 'uploaded', type: 'unknown' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  {
    dir: 'dialogs',
    name: 'user-invite-dialog',
    outputs: [
      { name: 'submitted', type: '{ email: string; roles: string[] }' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  {
    dir: 'dialogs',
    name: 'unsaved-changes-dialog',
    outputs: [
      { name: 'discarded', type: 'void' },
      { name: 'cancelled', type: 'void' },
    ],
  },
  {
    dir: 'dialogs',
    name: 'session-expired-dialog',
    outputs: [{ name: 'reauthenticate', type: 'void' }],
  },
  {
    dir: 'dialogs',
    name: 'sign-out-dialog',
    outputs: [
      { name: 'confirmed', type: 'void' },
      { name: 'cancelled', type: 'void' },
    ],
  },

  // Notifications
  { dir: 'notifications', name: 'notifications-gallery-page' },
  {
    dir: 'notifications',
    name: 'notification-banner',
    inputs: [
      { name: 'message', type: 'string', required: true },
      { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'" },
    ],
    outputs: [{ name: 'dismissed', type: 'void' }],
  },
  { dir: 'notifications', name: 'notification-snackbar-host' },
];

for (const c of COMPONENTS) {
  writeComponent(c.dir, c.name, c);
}

// Notification center service
const svcDir = join(ROOT, 'notifications', 'notification-center');
mkdirSync(svcDir, { recursive: true });
writeFileSync(
  join(svcDir, 'notification-center.ts'),
  `import { Injectable, signal } from '@angular/core';

export interface NotificationMessage {
  readonly id: string;
  readonly tone: 'info' | 'success' | 'warning' | 'danger';
  readonly text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationCenter {
  private readonly _messages = signal<readonly NotificationMessage[]>([]);
  readonly messages = this._messages.asReadonly();

  push(message: NotificationMessage): void {
    this._messages.update((m) => [...m, message]);
  }

  dismiss(id: string): void {
    this._messages.update((m) => m.filter((x) => x.id !== id));
  }

  clear(): void {
    this._messages.set([]);
  }
}
`,
);
writeFileSync(
  join(svcDir, 'notification-center.spec.ts'),
  `import { TestBed } from '@angular/core/testing';
import { NotificationCenter } from './notification-center';

describe('NotificationCenter', () => {
  it('pushes and dismisses messages', () => {
    const center = TestBed.inject(NotificationCenter);
    center.push({ id: '1', tone: 'info', text: 'hello' });
    expect(center.messages().length).toBe(1);
    center.dismiss('1');
    expect(center.messages().length).toBe(0);
  });
});
`,
);

console.log(`Scaffolded ${COMPONENTS.length} components + notification-center service.`);
