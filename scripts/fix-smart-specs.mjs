// Update specs for smart pages so DI providers (HttpClient + optional ActivatedRoute) are present.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'C:/projects/prompt-sharp/frontend/projects/domain/src/lib';

function spec({ rel, className, needsRoute }) {
  const lines = [
    `import { provideHttpClient } from '@angular/common/http';`,
    `import { TestBed } from '@angular/core/testing';`,
  ];
  if (needsRoute) {
    lines.push(`import { ActivatedRoute, convertToParamMap } from '@angular/router';`);
  }
  lines.push(`import { ${className} } from './${baseName(rel)}';`);
  lines.push('');
  lines.push(`describe('${className}', () => {`);
  lines.push(`  it('creates the component', () => {`);
  lines.push(`    TestBed.configureTestingModule({`);
  lines.push(`      providers: [`);
  lines.push(`        provideHttpClient(),`);
  if (needsRoute) {
    lines.push(`        {`);
    lines.push(`          provide: ActivatedRoute,`);
    lines.push(`          useValue: {`);
    lines.push(`            snapshot: {`);
    lines.push(`              paramMap: convertToParamMap({}),`);
    lines.push(`              queryParamMap: convertToParamMap({}),`);
    lines.push(`            },`);
    lines.push(`          },`);
    lines.push(`        },`);
  }
  lines.push(`      ],`);
  lines.push(`    });`);
  lines.push(`    const fixture = TestBed.createComponent(${className});`);
  lines.push(`    fixture.detectChanges();`);
  lines.push(`    expect(fixture.componentInstance).toBeTruthy();`);
  lines.push(`  });`);
  lines.push(`});`);
  lines.push('');
  writeFileSync(join(ROOT, rel), lines.join('\n'));
}

function baseName(rel) {
  const segs = rel.split('/');
  return segs[segs.length - 1].replace(/\.spec\.ts$/, '');
}

const items = [
  // HTTP only
  { rel: 'public/home-page/home-page.spec.ts', className: 'HomePage', needsRoute: false },
  {
    rel: 'catalog/catalog-page/catalog-page.spec.ts',
    className: 'CatalogPage',
    needsRoute: false,
  },
  {
    rel: 'catalog/category-page/category-page.spec.ts',
    className: 'CategoryPage',
    needsRoute: true,
  },
  {
    rel: 'catalog/search-page/search-page.spec.ts',
    className: 'SearchPage',
    needsRoute: true,
  },
  {
    rel: 'tutorial/tutorial-detail-page/tutorial-detail-page.spec.ts',
    className: 'TutorialDetailPage',
    needsRoute: true,
  },
  { rel: 'profile/profile-page/profile-page.spec.ts', className: 'ProfilePage', needsRoute: false },
  {
    rel: 'progress/progress-page/progress-page.spec.ts',
    className: 'ProgressPage',
    needsRoute: false,
  },
  {
    rel: 'admin/tutorials/admin-tutorial-list-page/admin-tutorial-list-page.spec.ts',
    className: 'AdminTutorialListPage',
    needsRoute: false,
  },
  {
    rel: 'admin/tutorials/admin-tutorial-editor-page/admin-tutorial-editor-page.spec.ts',
    className: 'AdminTutorialEditorPage',
    needsRoute: true,
  },
  {
    rel: 'admin/taxonomy/admin-taxonomy-page/admin-taxonomy-page.spec.ts',
    className: 'AdminTaxonomyPage',
    needsRoute: false,
  },
  {
    rel: 'admin/media/admin-media-page/admin-media-page.spec.ts',
    className: 'AdminMediaPage',
    needsRoute: false,
  },
  {
    rel: 'admin/users/admin-users-page/admin-users-page.spec.ts',
    className: 'AdminUsersPage',
    needsRoute: false,
  },
];

for (const item of items) spec(item);

// Layout shells with RouterOutlet need router setup
function shellSpec({ rel, className }) {
  const content = `import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ${className} } from './${baseName(rel)}';

describe('${className}', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(${className});
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
`;
  writeFileSync(join(ROOT, rel), content);
}

shellSpec({ rel: 'layout/public-shell/public-shell.spec.ts', className: 'PublicShell' });
shellSpec({ rel: 'layout/admin-shell/admin-shell.spec.ts', className: 'AdminShell' });

console.log('Specs fixed.');
