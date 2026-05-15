// Flesh out smart route-ready pages with real data fetching + state.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'C:/projects/prompt-sharp/frontend/projects/domain/src/lib';

function write(rel, content) {
  writeFileSync(join(ROOT, rel), content);
}

const stateHtml = `      @if (loading()) {
        <p class="state state--loading">Loading…</p>
      } @else if (error(); as message) {
        <div class="state state--error">
          <p>{{ message }}</p>
          <button type="button" (click)="load()">Retry</button>
        </div>
      }`;

// catalog-page
write(
  'catalog/catalog-page/catalog-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  Category,
  PagedResult,
  PromptSharpCategoriesApi,
  PromptSharpTutorialsApi,
  TutorialListItem,
} from 'api';

@Component({
  selector: 'ps-catalog-page',
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPage implements OnInit {
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);
  private readonly categoriesApi = inject(PromptSharpCategoriesApi);

  protected readonly tutorials = signal<PagedResult<TutorialListItem> | null>(null);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.list({ page: 1, pageSize: 24 }).subscribe({
      next: (page) => {
        this.tutorials.set(page);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
    this.categoriesApi.list().subscribe({ next: (c) => this.categories.set(c) });
  }
}
`,
);
write(
  'catalog/catalog-page/catalog-page.html',
  `<div class="catalog-page">
${stateHtml}
  @if (tutorials(); as page) {
    <p class="catalog-page__count">{{ page.totalCount }} tutorials</p>
  }
</div>
`,
);

// category-page
write(
  'catalog/category-page/category-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Category,
  PagedResult,
  PromptSharpCategoriesApi,
  PromptSharpTutorialsApi,
  TutorialListItem,
} from 'api';

@Component({
  selector: 'ps-category-page',
  templateUrl: './category-page.html',
  styleUrl: './category-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly categoriesApi = inject(PromptSharpCategoriesApi);
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);

  protected readonly slug = signal<string | null>(null);
  protected readonly category = signal<Category | null>(null);
  protected readonly tutorials = signal<PagedResult<TutorialListItem> | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.slug.set(slug);
    this.load();
  }

  protected load(): void {
    const slug = this.slug();
    if (!slug) return;
    this.loading.set(true);
    this.error.set(null);
    this.categoriesApi.list().subscribe({
      next: (categories) => {
        const match = categories.find((c) => c.slug === slug) ?? null;
        this.category.set(match);
      },
    });
    this.tutorialsApi.list({ category: slug, page: 1, pageSize: 24 }).subscribe({
      next: (page) => {
        this.tutorials.set(page);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
`,
);
write(
  'catalog/category-page/category-page.html',
  `<div class="category-page">
${stateHtml}
  @if (category(); as cat) {
    <h1 class="category-page__title">{{ cat.name }}</h1>
  }
  @if (tutorials(); as page) {
    <p class="category-page__count">{{ page.totalCount }} tutorials</p>
  }
</div>
`,
);

// search-page
write(
  'catalog/search-page/search-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagedResult, PromptSharpTutorialsApi, TutorialListItem } from 'api';

@Component({
  selector: 'ps-search-page',
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);

  protected readonly query = signal<string>('');
  protected readonly results = signal<PagedResult<TutorialListItem> | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.query.set(this.route.snapshot.queryParamMap.get('q') ?? '');
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.list({ page: 1, pageSize: 24 }).subscribe({
      next: (page) => {
        this.results.set(page);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
`,
);
write(
  'catalog/search-page/search-page.html',
  `<div class="search-page">
  <h1 class="search-page__title">Results for "{{ query() }}"</h1>
${stateHtml}
  @if (results(); as page) {
    <p class="search-page__count">{{ page.totalCount }} matches</p>
  }
</div>
`,
);

// tutorial-detail-page
write(
  'tutorial/tutorial-detail-page/tutorial-detail-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromptSharpMeApi, PromptSharpTutorialsApi, TutorialDetail, TutorialProgress } from 'api';

@Component({
  selector: 'ps-tutorial-detail-page',
  templateUrl: './tutorial-detail-page.html',
  styleUrl: './tutorial-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly tutorial = signal<TutorialDetail | null>(null);
  protected readonly progress = signal<TutorialProgress | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error.set('Missing tutorial slug.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.bySlug(slug).subscribe({
      next: (detail) => {
        this.tutorial.set(detail);
        this.loading.set(false);
        this.meApi.progress(detail.id).subscribe({
          next: (p) => this.progress.set(p),
          error: () => this.progress.set(null),
        });
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
`,
);
write(
  'tutorial/tutorial-detail-page/tutorial-detail-page.html',
  `<div class="tutorial-detail-page">
${stateHtml}
  @if (tutorial(); as t) {
    <header class="tutorial-detail-page__hero">
      <h1>{{ t.title }}</h1>
      <p>{{ t.summary }}</p>
    </header>
  }
</div>
`,
);

// profile-page
write(
  'profile/profile-page/profile-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Bookmark, PromptSharpMeApi, User } from 'api';

@Component({
  selector: 'ps-profile-page',
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly user = signal<User | null>(null);
  protected readonly bookmarks = signal<readonly Bookmark[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.meApi.get().subscribe({
      next: (u) => {
        this.user.set(u);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
    this.meApi.bookmarks().subscribe({ next: (b) => this.bookmarks.set(b) });
  }
}
`,
);
write(
  'profile/profile-page/profile-page.html',
  `<div class="profile-page">
${stateHtml}
  @if (user(); as u) {
    <h1>{{ u.email }}</h1>
    <p>{{ bookmarks().length }} bookmarks</p>
  }
</div>
`,
);

// progress-page
write(
  'progress/progress-page/progress-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Bookmark, PromptSharpMeApi } from 'api';

@Component({
  selector: 'ps-progress-page',
  templateUrl: './progress-page.html',
  styleUrl: './progress-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressPage implements OnInit {
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly bookmarks = signal<readonly Bookmark[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.meApi.bookmarks().subscribe({
      next: (b) => {
        this.bookmarks.set(b);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
`,
);
write(
  'progress/progress-page/progress-page.html',
  `<div class="progress-page">
${stateHtml}
  <ul class="progress-page__list">
    @for (b of bookmarks(); track b.tutorial.id) {
      <li>{{ b.tutorial.title }}</li>
    }
  </ul>
</div>
`,
);

// admin-tutorial-list-page
write(
  'admin/tutorials/admin-tutorial-list-page/admin-tutorial-list-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PagedResult, PromptSharpAdminTutorialsApi, TutorialListItem } from 'api';

@Component({
  selector: 'ps-admin-tutorial-list-page',
  templateUrl: './admin-tutorial-list-page.html',
  styleUrl: './admin-tutorial-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTutorialListPage implements OnInit {
  private readonly tutorialsApi = inject(PromptSharpAdminTutorialsApi);

  protected readonly tutorials = signal<PagedResult<TutorialListItem> | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.list({ page: 1, pageSize: 50 }).subscribe({
      next: (page) => {
        this.tutorials.set(page);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
`,
);
write(
  'admin/tutorials/admin-tutorial-list-page/admin-tutorial-list-page.html',
  `<div class="admin-tutorial-list-page">
${stateHtml}
  @if (tutorials(); as page) {
    <table>
      <thead><tr><th>Title</th><th>Status</th></tr></thead>
      <tbody>
        @for (t of page.items; track t.id) {
          <tr><td>{{ t.title }}</td><td>{{ t.isPublished ? 'Published' : 'Draft' }}</td></tr>
        }
      </tbody>
    </table>
  }
</div>
`,
);

// admin-tutorial-editor-page
write(
  'admin/tutorials/admin-tutorial-editor-page/admin-tutorial-editor-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Category,
  Media,
  PromptSharpAdminCategoriesApi,
  PromptSharpAdminMediaApi,
  PromptSharpAdminTagsApi,
  PromptSharpAdminTutorialsApi,
  Tag,
  TutorialDetail,
} from 'api';

@Component({
  selector: 'ps-admin-tutorial-editor-page',
  templateUrl: './admin-tutorial-editor-page.html',
  styleUrl: './admin-tutorial-editor-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTutorialEditorPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tutorialsApi = inject(PromptSharpAdminTutorialsApi);
  private readonly categoriesApi = inject(PromptSharpAdminCategoriesApi);
  private readonly tagsApi = inject(PromptSharpAdminTagsApi);
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected readonly tutorial = signal<TutorialDetail | null>(null);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly tags = signal<readonly Tag[]>([]);
  protected readonly media = signal<readonly Media[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing tutorial id.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.get(id).subscribe({
      next: (t) => {
        this.tutorial.set(t);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
    this.categoriesApi.list().subscribe({ next: (c) => this.categories.set(c) });
    this.tagsApi.list().subscribe({ next: (t) => this.tags.set(t) });
    this.mediaApi.list().subscribe({ next: (m) => this.media.set(m) });
  }
}
`,
);
write(
  'admin/tutorials/admin-tutorial-editor-page/admin-tutorial-editor-page.html',
  `<div class="admin-tutorial-editor-page">
${stateHtml}
  @if (tutorial(); as t) {
    <h1>{{ t.title }}</h1>
  }
</div>
`,
);

// admin-taxonomy-page
write(
  'admin/taxonomy/admin-taxonomy-page/admin-taxonomy-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Category, PromptSharpAdminCategoriesApi, PromptSharpAdminTagsApi, Tag } from 'api';

@Component({
  selector: 'ps-admin-taxonomy-page',
  templateUrl: './admin-taxonomy-page.html',
  styleUrl: './admin-taxonomy-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTaxonomyPage implements OnInit {
  private readonly categoriesApi = inject(PromptSharpAdminCategoriesApi);
  private readonly tagsApi = inject(PromptSharpAdminTagsApi);

  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly tags = signal<readonly Tag[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    let inflight = 2;
    const done = () => {
      inflight -= 1;
      if (inflight === 0) this.loading.set(false);
    };
    this.categoriesApi.list().subscribe({
      next: (c) => {
        this.categories.set(c);
        done();
      },
      error: (e: Error) => {
        this.error.set(e.message);
        done();
      },
    });
    this.tagsApi.list().subscribe({
      next: (t) => {
        this.tags.set(t);
        done();
      },
      error: (e: Error) => {
        this.error.set(e.message);
        done();
      },
    });
  }
}
`,
);
write(
  'admin/taxonomy/admin-taxonomy-page/admin-taxonomy-page.html',
  `<div class="admin-taxonomy-page">
${stateHtml}
  <section class="admin-taxonomy-page__categories">
    <h2>Categories</h2>
    <ul>
      @for (c of categories(); track c.id) {
        <li>{{ c.name }}</li>
      }
    </ul>
  </section>
  <section class="admin-taxonomy-page__tags">
    <h2>Tags</h2>
    <ul>
      @for (t of tags(); track t.id) {
        <li>{{ t.name }}</li>
      }
    </ul>
  </section>
</div>
`,
);

// admin-media-page
write(
  'admin/media/admin-media-page/admin-media-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Media, PromptSharpAdminMediaApi } from 'api';

@Component({
  selector: 'ps-admin-media-page',
  templateUrl: './admin-media-page.html',
  styleUrl: './admin-media-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMediaPage implements OnInit {
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected readonly media = signal<readonly Media[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.mediaApi.list().subscribe({
      next: (m) => {
        this.media.set(m);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
`,
);
write(
  'admin/media/admin-media-page/admin-media-page.html',
  `<div class="admin-media-page">
${stateHtml}
  <ul class="admin-media-page__grid">
    @for (m of media(); track m.id) {
      <li>{{ m.fileName }}</li>
    }
  </ul>
</div>
`,
);

// admin-users-page
write(
  'admin/users/admin-users-page/admin-users-page.ts',
  `import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PromptSharpAdminUsersApi, User } from 'api';

@Component({
  selector: 'ps-admin-users-page',
  templateUrl: './admin-users-page.html',
  styleUrl: './admin-users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPage implements OnInit {
  private readonly usersApi = inject(PromptSharpAdminUsersApi);

  protected readonly users = signal<readonly User[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usersApi.list().subscribe({
      next: (u) => {
        this.users.set(u);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
`,
);
write(
  'admin/users/admin-users-page/admin-users-page.html',
  `<div class="admin-users-page">
${stateHtml}
  <table>
    <thead><tr><th>Email</th><th>Roles</th></tr></thead>
    <tbody>
      @for (u of users(); track u.id) {
        <tr><td>{{ u.email }}</td><td>{{ u.roles.join(', ') }}</td></tr>
      }
    </tbody>
  </table>
</div>
`,
);

console.log('Smart pages fleshed out.');
