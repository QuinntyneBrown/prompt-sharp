import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
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
  protected readonly categoryFormOpen = signal<boolean>(false);
  protected readonly tagFormOpen = signal<boolean>(false);
  protected readonly status = signal<string | null>(null);
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

  protected openCategoryForm(): void {
    this.categoryFormOpen.set(true);
  }

  protected openTagForm(): void {
    this.tagFormOpen.set(true);
  }

  protected createCategory(name: string, slug: string): void {
    this.categoryFormOpen.set(false);
    this.categoriesApi.create({ name, slug, order: this.categories().length + 1 }).subscribe({
      next: (category) => {
        this.categories.update((items) => [...items, category]);
        this.status.set('Category saved');
      },
      error: (e: Error) => {
        this.error.set(e.message);
      },
    });
  }

  protected createTag(name: string, slug: string): void {
    this.tagFormOpen.set(false);
    this.tagsApi.create({ name, slug }).subscribe({
      next: (tag) => {
        this.tags.update((items) => [...items, tag]);
        this.status.set('Tag saved');
      },
      error: (e: Error) => {
        this.error.set(e.message);
      },
    });
  }
}
