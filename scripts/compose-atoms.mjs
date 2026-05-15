// Update key organisms/molecules to compose atoms from the components library.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'C:/projects/prompt-sharp/frontend/projects/domain/src/lib';
const writes = [];

function set(rel, content) {
  writes.push(rel);
  writeFileSync(join(ROOT, rel), content);
}

// ---------- Layout: public-nav ----------
set(
  'layout/public-nav/public-nav.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, NavItem, Wordmark } from 'components';

@Component({
  selector: 'ps-public-nav',
  templateUrl: './public-nav.html',
  styleUrl: './public-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, NavItem, Wordmark],
})
export class PublicNav {
  readonly activeRoute = input<string | null>(null);
  readonly signedIn = input<boolean>(false);
  readonly signIn = output<void>();
  readonly signOut = output<void>();
}
`,
);
set(
  'layout/public-nav/public-nav.html',
  `<nav class="public-nav" aria-label="Primary">
  <a class="public-nav__brand" href="/" aria-label="PromptSharp home">
    <lib-wordmark size="md" variant="inline"></lib-wordmark>
  </a>
  <ul class="public-nav__links">
    <li>
      <lib-nav-item label="Catalog" href="/catalog" [active]="activeRoute() === 'catalog'"></lib-nav-item>
    </li>
    <li>
      <lib-nav-item label="About" href="/about" [active]="activeRoute() === 'about'"></lib-nav-item>
    </li>
  </ul>
  <div class="public-nav__actions">
    @if (signedIn()) {
      <lib-button variant="ghost" (click)="signOut.emit()">Sign out</lib-button>
    } @else {
      <lib-button variant="solid" (click)="signIn.emit()">Sign in</lib-button>
    }
  </div>
</nav>
`,
);

// ---------- Layout: public-footer ----------
set(
  'layout/public-footer/public-footer.ts',
  `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Mono, Wordmark } from 'components';

@Component({
  selector: 'ps-public-footer',
  templateUrl: './public-footer.html',
  styleUrl: './public-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Mono, Wordmark],
})
export class PublicFooter {}
`,
);
set(
  'layout/public-footer/public-footer.html',
  `<footer class="public-footer">
  <lib-wordmark size="sm" variant="inline"></lib-wordmark>
  <lib-mono>© PromptSharp</lib-mono>
</footer>
`,
);

// ---------- Layout: admin-nav-rail ----------
set(
  'layout/admin-nav-rail/admin-nav-rail.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconButton, NavItem, Wordmark } from 'components';

@Component({
  selector: 'ps-admin-nav-rail',
  templateUrl: './admin-nav-rail.html',
  styleUrl: './admin-nav-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton, NavItem, Wordmark],
})
export class AdminNavRail {
  readonly collapsed = input<boolean>(false);
  readonly activeRoute = input<string | null>(null);
  readonly collapseToggled = output<void>();
}
`,
);
set(
  'layout/admin-nav-rail/admin-nav-rail.html',
  `<aside class="admin-nav-rail" [attr.data-collapsed]="collapsed() || null">
  <div class="admin-nav-rail__brand">
    <lib-wordmark size="sm" variant="inline"></lib-wordmark>
    <lib-icon-button
      icon="menu"
      label="Toggle navigation"
      size="sm"
      (clicked)="collapseToggled.emit()"
    ></lib-icon-button>
  </div>
  <nav>
    <ul>
      <li>
        <lib-nav-item
          icon="dashboard"
          label="Dashboard"
          href="/admin"
          [collapsed]="collapsed()"
          [active]="activeRoute() === 'dashboard'"
        ></lib-nav-item>
      </li>
      <li>
        <lib-nav-item
          icon="article"
          label="Tutorials"
          href="/admin/tutorials"
          [collapsed]="collapsed()"
          [active]="activeRoute() === 'tutorials'"
        ></lib-nav-item>
      </li>
      <li>
        <lib-nav-item
          icon="label"
          label="Taxonomy"
          href="/admin/taxonomy"
          [collapsed]="collapsed()"
          [active]="activeRoute() === 'taxonomy'"
        ></lib-nav-item>
      </li>
      <li>
        <lib-nav-item
          icon="image"
          label="Media"
          href="/admin/media"
          [collapsed]="collapsed()"
          [active]="activeRoute() === 'media'"
        ></lib-nav-item>
      </li>
      <li>
        <lib-nav-item
          icon="group"
          label="Users"
          href="/admin/users"
          [collapsed]="collapsed()"
          [active]="activeRoute() === 'users'"
        ></lib-nav-item>
      </li>
      <li>
        <lib-nav-item
          icon="history"
          label="Audit log"
          href="/admin/audit"
          [collapsed]="collapsed()"
          [active]="activeRoute() === 'audit'"
        ></lib-nav-item>
      </li>
    </ul>
  </nav>
</aside>
`,
);

// ---------- Layout: admin-topbar ----------
set(
  'layout/admin-topbar/admin-topbar.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar, Button, IconButton, StatusDot } from 'components';

@Component({
  selector: 'ps-admin-topbar',
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Button, IconButton, StatusDot],
})
export class AdminTopbar {
  readonly currentUserName = input<string | null>(null);
  readonly signOut = output<void>();
}
`,
);
set(
  'layout/admin-topbar/admin-topbar.html',
  `<header class="admin-topbar">
  <div class="admin-topbar__status">
    <lib-status-dot tone="success"></lib-status-dot>
    <span>Live</span>
  </div>
  <div class="admin-topbar__actions">
    <lib-icon-button icon="notifications" label="Notifications" size="sm"></lib-icon-button>
    @if (currentUserName(); as name) {
      <lib-avatar [name]="name" size="sm"></lib-avatar>
    }
    <lib-button variant="ghost" (click)="signOut.emit()">Sign out</lib-button>
  </div>
</header>
`,
);

// ---------- Tutorial card ----------
set(
  'tutorial/tutorial-card/tutorial-card.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DifficultyLevel } from 'api';
import { DifficultyBadge, Eyebrow, Mono } from 'components';

@Component({
  selector: 'ps-tutorial-card',
  templateUrl: './tutorial-card.html',
  styleUrl: './tutorial-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DifficultyBadge, Eyebrow, Mono],
})
export class TutorialCard {
  readonly title = input.required<string>();
  readonly slug = input.required<string>();
  readonly summary = input<string | null>(null);
  readonly categoryName = input<string | null>(null);
  readonly difficulty = input<DifficultyLevel | null>(null);
  readonly estimatedMinutes = input<number | null>(null);

  readonly selected = output<void>();
}
`,
);
set(
  'tutorial/tutorial-card/tutorial-card.html',
  `<article class="tutorial-card" (click)="selected.emit()">
  @if (categoryName(); as cat) {
    <lib-eyebrow [showDot]="true">{{ cat }}</lib-eyebrow>
  }
  <h3 class="tutorial-card__title">{{ title() }}</h3>
  @if (summary(); as text) {
    <p class="tutorial-card__summary">{{ text }}</p>
  }
  <footer class="tutorial-card__meta">
    @if (difficulty(); as d) {
      <lib-difficulty-badge [level]="d"></lib-difficulty-badge>
    }
    @if (estimatedMinutes(); as mins) {
      <lib-mono>{{ mins }} min</lib-mono>
    }
  </footer>
</article>
`,
);

// ---------- Sign-in card ----------
set(
  'auth/sign-in-card/sign-in-card.ts',
  `import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button, DisplayText } from 'components';

@Component({
  selector: 'ps-sign-in-card',
  templateUrl: './sign-in-card.html',
  styleUrl: './sign-in-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DisplayText],
})
export class SignInCard {
  readonly submitted = output<void>();
}
`,
);
set(
  'auth/sign-in-card/sign-in-card.html',
  `<section class="sign-in-card">
  <lib-display-text level="2">Sign in</lib-display-text>
  <div class="sign-in-card__body">
    <ng-content></ng-content>
  </div>
  <div class="sign-in-card__actions">
    <lib-button variant="solid" [fullWidth]="true" (click)="submitted.emit()">Sign in</lib-button>
  </div>
</section>
`,
);

// ---------- Sign-in field row ----------
set(
  'auth/sign-in-field-row/sign-in-field-row.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TextField } from 'components';

@Component({
  selector: 'ps-sign-in-field-row',
  templateUrl: './sign-in-field-row.html',
  styleUrl: './sign-in-field-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextField],
})
export class SignInFieldRow {
  readonly label = input.required<string>();
  readonly kind = input<'text' | 'password' | null>(null);
  readonly value = input<string>('');
  readonly valueChange = output<string>();
}
`,
);
set(
  'auth/sign-in-field-row/sign-in-field-row.html',
  `<div class="sign-in-field-row">
  <lib-text-field
    [label]="label()"
    [type]="kind() === 'password' ? 'password' : 'text'"
    [value]="value()"
    (valueChange)="valueChange.emit($event)"
  ></lib-text-field>
</div>
`,
);

// ---------- Admin KPI card ----------
set(
  'admin/shared/admin-kpi-card/admin-kpi-card.ts',
  `import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Stat } from 'components';

@Component({
  selector: 'ps-admin-kpi-card',
  templateUrl: './admin-kpi-card.html',
  styleUrl: './admin-kpi-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Stat],
})
export class AdminKpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly supportingLabel = input<string | null>(null);
}
`,
);
set(
  'admin/shared/admin-kpi-card/admin-kpi-card.html',
  `<lib-stat [label]="label()" [value]="value()" [supportingLabel]="supportingLabel()"></lib-stat>
`,
);

// ---------- Pagination ----------
set(
  'catalog/pagination/pagination.ts',
  `import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PaginationButton } from 'components';

@Component({
  selector: 'ps-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginationButton],
})
export class Pagination {
  readonly page = input<number>(1);
  readonly pageCount = input<number>(1);
  readonly pageChanged = output<number>();

  protected readonly pages = computed(() => {
    const count = this.pageCount();
    return Array.from({ length: Math.max(count, 1) }, (_, i) => i + 1);
  });

  protected select(p: number): void {
    this.pageChanged.emit(p);
  }
}
`,
);
set(
  'catalog/pagination/pagination.html',
  `<nav class="pagination" aria-label="Pagination">
  <lib-pagination-button
    label="Prev"
    ariaLabel="Previous page"
    [disabled]="page() <= 1"
    (selected)="select(page() - 1)"
  ></lib-pagination-button>
  @for (p of pages(); track p) {
    <lib-pagination-button
      [label]="p"
      [active]="p === page()"
      (selected)="select(p)"
    ></lib-pagination-button>
  }
  <lib-pagination-button
    label="Next"
    ariaLabel="Next page"
    [disabled]="page() >= pageCount()"
    (selected)="select(page() + 1)"
  ></lib-pagination-button>
</nav>
`,
);

// ---------- Search bar ----------
set(
  'catalog/search-bar/search-bar.ts',
  `import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SearchField } from 'components';

@Component({
  selector: 'ps-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchField],
})
export class SearchBar {
  readonly queryChanged = output<string>();
}
`,
);
set(
  'catalog/search-bar/search-bar.html',
  `<div class="search-bar">
  <lib-search-field
    placeholder="Search tutorials"
    (valueChange)="queryChanged.emit($event)"
    (searched)="queryChanged.emit($event)"
  ></lib-search-field>
</div>
`,
);

// ---------- Filter rail ----------
set(
  'catalog/filter-rail/filter-rail.ts',
  `import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Chip, Rule } from 'components';

export interface FilterRailOption {
  readonly slug: string;
  readonly label: string;
}

@Component({
  selector: 'ps-filter-rail',
  templateUrl: './filter-rail.html',
  styleUrl: './filter-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Rule],
})
export class FilterRail {
  readonly categories = input<readonly FilterRailOption[]>([]);
  readonly tags = input<readonly FilterRailOption[]>([]);
  readonly filtersChanged = output<Record<string, unknown>>();

  private readonly selectedCategories = signal<readonly string[]>([]);
  private readonly selectedTags = signal<readonly string[]>([]);

  protected isCategorySelected(slug: string): boolean {
    return this.selectedCategories().includes(slug);
  }
  protected isTagSelected(slug: string): boolean {
    return this.selectedTags().includes(slug);
  }

  protected toggleCategory(slug: string): void {
    this.selectedCategories.update((s) =>
      s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug],
    );
    this.emit();
  }
  protected toggleTag(slug: string): void {
    this.selectedTags.update((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
    this.emit();
  }

  private emit(): void {
    this.filtersChanged.emit({
      categories: this.selectedCategories(),
      tags: this.selectedTags(),
    });
  }
}
`,
);
set(
  'catalog/filter-rail/filter-rail.html',
  `<aside class="filter-rail">
  <section class="filter-rail__group">
    <h3 class="filter-rail__heading">Categories</h3>
    <div class="filter-rail__chips">
      @for (c of categories(); track c.slug) {
        <lib-chip [selected]="isCategorySelected(c.slug)" (click)="toggleCategory(c.slug)">
          {{ c.label }}
        </lib-chip>
      }
    </div>
  </section>
  <lib-rule></lib-rule>
  <section class="filter-rail__group">
    <h3 class="filter-rail__heading">Tags</h3>
    <div class="filter-rail__chips">
      @for (t of tags(); track t.slug) {
        <lib-chip [selected]="isTagSelected(t.slug)" (click)="toggleTag(t.slug)">
          {{ t.label }}
        </lib-chip>
      }
    </div>
  </section>
</aside>
`,
);

// ---------- Admin row actions ----------
set(
  'admin/shared/admin-row-actions/admin-row-actions.ts',
  `import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { IconButton } from 'components';

@Component({
  selector: 'ps-admin-row-actions',
  templateUrl: './admin-row-actions.html',
  styleUrl: './admin-row-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton],
})
export class AdminRowActions {
  readonly edit = output<void>();
  readonly remove = output<void>();
}
`,
);
set(
  'admin/shared/admin-row-actions/admin-row-actions.html',
  `<div class="admin-row-actions">
  <lib-icon-button icon="edit" label="Edit" size="sm" (clicked)="edit.emit()"></lib-icon-button>
  <lib-icon-button icon="delete" label="Delete" size="sm" (clicked)="remove.emit()"></lib-icon-button>
</div>
`,
);

// ---------- Admin filter chips ----------
set(
  'admin/shared/admin-filter-chips/admin-filter-chips.ts',
  `import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Chip } from 'components';

@Component({
  selector: 'ps-admin-filter-chips',
  templateUrl: './admin-filter-chips.html',
  styleUrl: './admin-filter-chips.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip],
})
export class AdminFilterChips {
  readonly options = input<readonly string[]>([]);
  readonly filtersChanged = output<string[]>();
  private readonly selection = signal<readonly string[]>([]);

  protected isSelected(option: string): boolean {
    return this.selection().includes(option);
  }
  protected toggle(option: string): void {
    this.selection.update((s) =>
      s.includes(option) ? s.filter((x) => x !== option) : [...s, option],
    );
    this.filtersChanged.emit([...this.selection()]);
  }
}
`,
);
set(
  'admin/shared/admin-filter-chips/admin-filter-chips.html',
  `<div class="admin-filter-chips">
  @for (option of options(); track option) {
    <lib-chip [selected]="isSelected(option)" (click)="toggle(option)">{{ option }}</lib-chip>
  }
</div>
`,
);

// ---------- Error page / Access denied ----------
set(
  'public/error-page/error-page.ts',
  `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, EmptyState } from 'components';

@Component({
  selector: 'ps-error-page',
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, EmptyState],
})
export class ErrorPage {}
`,
);
set(
  'public/error-page/error-page.html',
  `<lib-empty-state icon="error" display="Page not found" description="The page you were looking for doesn't exist.">
  <div empty-state-actions>
    <lib-button variant="solid"><a href="/">Back home</a></lib-button>
  </div>
</lib-empty-state>
`,
);

set(
  'auth/access-denied-page/access-denied-page.ts',
  `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, EmptyState } from 'components';

@Component({
  selector: 'ps-access-denied-page',
  templateUrl: './access-denied-page.html',
  styleUrl: './access-denied-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, EmptyState],
})
export class AccessDeniedPage {}
`,
);
set(
  'auth/access-denied-page/access-denied-page.html',
  `<lib-empty-state icon="block" display="Access denied" description="You don't have permission to view this page.">
  <div empty-state-actions>
    <lib-button variant="solid"><a href="/">Back home</a></lib-button>
  </div>
</lib-empty-state>
`,
);

// ---------- Notification banner / snackbar host ----------
set(
  'notifications/notification-banner/notification-banner.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Banner, BannerTone, IconButton } from 'components';

@Component({
  selector: 'ps-notification-banner',
  templateUrl: './notification-banner.html',
  styleUrl: './notification-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Banner, IconButton],
})
export class NotificationBanner {
  readonly message = input.required<string>();
  readonly tone = input<BannerTone>('default');
  readonly dismissed = output<void>();
}
`,
);
set(
  'notifications/notification-banner/notification-banner.html',
  `<lib-banner [tone]="tone()">
  {{ message() }}
  <div banner-actions>
    <lib-icon-button icon="close" label="Dismiss" size="sm" (clicked)="dismissed.emit()"></lib-icon-button>
  </div>
</lib-banner>
`,
);

set(
  'notifications/notification-snackbar-host/notification-snackbar-host.ts',
  `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Snackbar } from 'components';
import { NotificationCenter } from '../notification-center/notification-center';

@Component({
  selector: 'ps-notification-snackbar-host',
  templateUrl: './notification-snackbar-host.html',
  styleUrl: './notification-snackbar-host.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Snackbar],
})
export class NotificationSnackbarHost {
  protected readonly center = inject(NotificationCenter);

  protected dismiss(id: string): void {
    this.center.dismiss(id);
  }
}
`,
);
set(
  'notifications/notification-snackbar-host/notification-snackbar-host.html',
  `<div class="notification-snackbar-host" aria-live="polite">
  @for (m of center.messages(); track m.id) {
    <lib-snackbar
      [message]="m.text"
      [tone]="m.tone"
      [open]="true"
      (dismissed)="dismiss(m.id)"
    ></lib-snackbar>
  }
</div>
`,
);

// ---------- Breadcrumbs ----------
set(
  'tutorial/tutorial-breadcrumbs/tutorial-breadcrumbs.ts',
  `import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Breadcrumb } from 'components';

@Component({
  selector: 'ps-tutorial-breadcrumbs',
  templateUrl: './tutorial-breadcrumbs.html',
  styleUrl: './tutorial-breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumb],
})
export class TutorialBreadcrumbs {
  readonly crumbs = input<{ label: string; href: string | null }[] | null>(null);
}
`,
);
set(
  'tutorial/tutorial-breadcrumbs/tutorial-breadcrumbs.html',
  `<nav class="tutorial-breadcrumbs" aria-label="Breadcrumb">
  @for (c of crumbs() ?? []; track c.label; let last = $last) {
    <lib-breadcrumb [label]="c.label" [href]="c.href" [current]="last"></lib-breadcrumb>
  }
</nav>
`,
);

// ---------- Tutorial code block ----------
set(
  'tutorial/tutorial-code-block/tutorial-code-block.ts',
  `import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeCaption } from 'components';

@Component({
  selector: 'ps-tutorial-code-block',
  templateUrl: './tutorial-code-block.html',
  styleUrl: './tutorial-code-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeCaption],
})
export class TutorialCodeBlock {
  readonly language = input<string | null>(null);
  readonly code = input.required<string>();
}
`,
);
set(
  'tutorial/tutorial-code-block/tutorial-code-block.html',
  `<figure class="tutorial-code-block">
  <pre><code [attr.data-language]="language()">{{ code() }}</code></pre>
  @if (language(); as lang) {
    <lib-code-caption>{{ lang }}</lib-code-caption>
  }
</figure>
`,
);

// ---------- Tutorial step nav ----------
set(
  'tutorial/tutorial-step-nav/tutorial-step-nav.ts',
  `import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button } from 'components';

@Component({
  selector: 'ps-tutorial-step-nav',
  templateUrl: './tutorial-step-nav.html',
  styleUrl: './tutorial-step-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
})
export class TutorialStepNav {
  readonly next = output<void>();
  readonly previous = output<void>();
}
`,
);
set(
  'tutorial/tutorial-step-nav/tutorial-step-nav.html',
  `<nav class="tutorial-step-nav" aria-label="Steps">
  <lib-button variant="ghost" (click)="previous.emit()">Previous</lib-button>
  <lib-button variant="solid" (click)="next.emit()">Next</lib-button>
</nav>
`,
);

// ---------- Media card ----------
set(
  'admin/media/media-card/media-card.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Checkbox, Thumbnail } from 'components';

@Component({
  selector: 'ps-media-card',
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, Thumbnail],
})
export class MediaCard {
  readonly filename = input.required<string>();
  readonly thumbnailUrl = input<string | null>(null);
  readonly selectedChanged = output<boolean>();
}
`,
);
set(
  'admin/media/media-card/media-card.html',
  `<article class="media-card">
  <lib-thumbnail [src]="thumbnailUrl()" [alt]="filename()"></lib-thumbnail>
  <div class="media-card__footer">
    <span class="media-card__name">{{ filename() }}</span>
    <lib-checkbox (checkedChange)="selectedChanged.emit($event)"></lib-checkbox>
  </div>
</article>
`,
);

// ---------- Dialogs: confirm-delete ----------
function dialog({ rel, className, selector, headline, bodyMarkup, primaryLabel, primaryEvent, primaryArg, secondaryLabel, secondaryEvent, extraOutputs = [] }) {
  const outputs = [
    secondaryEvent && `  readonly ${secondaryEvent} = output<void>();`,
    `  readonly ${primaryEvent} = output<${primaryArg ?? 'void'}>();`,
    ...extraOutputs.map((o) => `  readonly ${o.name} = output<${o.type}>();`),
  ]
    .filter(Boolean)
    .join('\n');
  const inputs = (headline.inputs ?? []).map((i) => `  readonly ${i.name} = input<${i.type}>(${i.default});`).join('\n');
  set(
    `dialogs/${rel}/${rel}.ts`,
    `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: '${selector}',
  templateUrl: './${rel}.html',
  styleUrl: './${rel}.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class ${className} {
  readonly open = input<boolean>(false);
${inputs}
${outputs}
}
`,
  );
}

// Confirm delete
set(
  'dialogs/confirm-delete-dialog/confirm-delete-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class ConfirmDeleteDialog {
  readonly open = input<boolean>(false);
  readonly itemName = input<string | null>(null);

  readonly cancelled = output<void>();
  readonly confirmed = output<void>();
}
`,
);
set(
  'dialogs/confirm-delete-dialog/confirm-delete-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Delete?"
  [supportingText]="itemName() ? 'This will permanently remove ' + itemName() + '.' : 'This action cannot be undone.'"
  (closed)="cancelled.emit()"
>
  <ng-content></ng-content>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Cancel</lib-button>
    <lib-button variant="solid" (click)="confirmed.emit()">Delete</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// Publish dialog
set(
  'dialogs/publish-dialog/publish-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-publish-dialog',
  templateUrl: './publish-dialog.html',
  styleUrl: './publish-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class PublishDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly submitted = output<unknown>();
}
`,
);
set(
  'dialogs/publish-dialog/publish-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Publish?"
  supportingText="Make this tutorial visible to all readers."
  (closed)="cancelled.emit()"
>
  <ng-content></ng-content>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Cancel</lib-button>
    <lib-button variant="solid" (click)="submitted.emit({})">Publish</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// Category dialog
set(
  'dialogs/category-dialog/category-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-category-dialog',
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class CategoryDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly submitted = output<unknown>();
}
`,
);
set(
  'dialogs/category-dialog/category-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Category"
  (closed)="cancelled.emit()"
>
  <ng-content></ng-content>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Cancel</lib-button>
    <lib-button variant="solid" (click)="submitted.emit({})">Save</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// Media upload
set(
  'dialogs/media-upload-dialog/media-upload-dialog.ts',
  `import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Button, DialogShell, DropZone } from 'components';
import { PromptSharpAdminMediaApi } from 'api';

@Component({
  selector: 'ps-media-upload-dialog',
  templateUrl: './media-upload-dialog.html',
  styleUrl: './media-upload-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell, DropZone],
})
export class MediaUploadDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly uploaded = output<unknown>();
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected onFiles(files: FileList | null): void {
    if (!files || files.length === 0) return;
    const file = files[0];
    this.mediaApi.upload(file, file.name).subscribe({
      next: (media) => this.uploaded.emit(media),
    });
  }
}
`,
);
set(
  'dialogs/media-upload-dialog/media-upload-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Upload media"
  (closed)="cancelled.emit()"
>
  <lib-drop-zone (filesSelected)="onFiles($event)"></lib-drop-zone>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Cancel</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// User invite
set(
  'dialogs/user-invite-dialog/user-invite-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell, TextField } from 'components';

@Component({
  selector: 'ps-user-invite-dialog',
  templateUrl: './user-invite-dialog.html',
  styleUrl: './user-invite-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell, TextField],
})
export class UserInviteDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly submitted = output<{ email: string; roles: string[] }>();

  protected emailValue = '';

  protected onEmail(value: string): void {
    this.emailValue = value;
  }

  protected submit(): void {
    this.submitted.emit({ email: this.emailValue, roles: [] });
  }
}
`,
);
set(
  'dialogs/user-invite-dialog/user-invite-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Invite user"
  (closed)="cancelled.emit()"
>
  <lib-text-field label="Email" type="email" (valueChange)="onEmail($event)"></lib-text-field>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Cancel</lib-button>
    <lib-button variant="solid" (click)="submit()">Send invite</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// Unsaved changes
set(
  'dialogs/unsaved-changes-dialog/unsaved-changes-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-unsaved-changes-dialog',
  templateUrl: './unsaved-changes-dialog.html',
  styleUrl: './unsaved-changes-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class UnsavedChangesDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly discarded = output<void>();
}
`,
);
set(
  'dialogs/unsaved-changes-dialog/unsaved-changes-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Unsaved changes"
  supportingText="Discard your edits and leave?"
  (closed)="cancelled.emit()"
>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Keep editing</lib-button>
    <lib-button variant="solid" (click)="discarded.emit()">Discard</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// Session expired
set(
  'dialogs/session-expired-dialog/session-expired-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-session-expired-dialog',
  templateUrl: './session-expired-dialog.html',
  styleUrl: './session-expired-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class SessionExpiredDialog {
  readonly open = input<boolean>(false);
  readonly reauthenticate = output<void>();
}
`,
);
set(
  'dialogs/session-expired-dialog/session-expired-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Session expired"
  supportingText="Sign in again to continue."
  [modal]="true"
>
  <div dialog-actions>
    <lib-button variant="solid" (click)="reauthenticate.emit()">Sign in</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// Sign-out
set(
  'dialogs/sign-out-dialog/sign-out-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-sign-out-dialog',
  templateUrl: './sign-out-dialog.html',
  styleUrl: './sign-out-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class SignOutDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly confirmed = output<void>();
}
`,
);
set(
  'dialogs/sign-out-dialog/sign-out-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Sign out?"
  (closed)="cancelled.emit()"
>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Stay signed in</lib-button>
    <lib-button variant="solid" (click)="confirmed.emit()">Sign out</lib-button>
  </div>
</lib-dialog-shell>
`,
);

// Tutorial dialog
set(
  'dialogs/tutorial-dialog/tutorial-dialog.ts',
  `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-tutorial-dialog',
  templateUrl: './tutorial-dialog.html',
  styleUrl: './tutorial-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class TutorialDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly submitted = output<unknown>();
}
`,
);
set(
  'dialogs/tutorial-dialog/tutorial-dialog.html',
  `<lib-dialog-shell
  [open]="open()"
  headline="Tutorial"
  (closed)="cancelled.emit()"
>
  <ng-content></ng-content>
  <div dialog-actions>
    <lib-button variant="ghost" (click)="cancelled.emit()">Cancel</lib-button>
    <lib-button variant="solid" (click)="submitted.emit({})">Save</lib-button>
  </div>
</lib-dialog-shell>
`,
);

console.log(`Updated ${writes.length} files with atom composition.`);
