import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Category, PromptSharpAdminCategoriesApi, PromptSharpAdminTagsApi, Tag } from 'api';
import { Button, DialogShell, SpinnerDot, Tabs, TextField } from 'components';
import { ConfirmDeleteDialog } from '../../../dialogs/confirm-delete-dialog/confirm-delete-dialog';

type TaxonomyKind = 'category' | 'tag';
type TaxonomyTab = 'categories' | 'tags';

type TaxonomyForm = {
  kind: TaxonomyKind;
  id: string | null;
  name: string;
  slug: string;
  order: number | null;
};

type DeleteTarget = {
  kind: TaxonomyKind;
  id: string;
  name: string;
};

@Component({
  selector: 'ps-admin-taxonomy-page',
  templateUrl: './admin-taxonomy-page.html',
  styleUrl: './admin-taxonomy-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ConfirmDeleteDialog, DialogShell, SpinnerDot, Tabs, TextField],
})
export class AdminTaxonomyPage implements OnInit {
  private readonly categoriesApi = inject(PromptSharpAdminCategoriesApi);
  private readonly tagsApi = inject(PromptSharpAdminTagsApi);

  protected readonly tabs = [
    { label: 'Categories', value: 'categories' },
    { label: 'Tags', value: 'tags' },
  ];
  protected readonly selectedTab = signal<TaxonomyTab>('categories');
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly tags = signal<readonly Tag[]>([]);
  protected readonly form = signal<TaxonomyForm | null>(null);
  protected readonly formError = signal<string | null>(null);
  protected readonly pendingDelete = signal<DeleteTarget | null>(null);
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

  protected selectTab(tab: string): void {
    if (tab === 'categories' || tab === 'tags') {
      this.selectedTab.set(tab);
    }
  }

  protected openCategoryForm(category: Category | null = null): void {
    this.formError.set(null);
    this.form.set({
      kind: 'category',
      id: category?.id ?? null,
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      order: category?.order ?? this.categories().length + 1,
    });
  }

  protected openTagForm(tag: Tag | null = null): void {
    this.formError.set(null);
    this.form.set({
      kind: 'tag',
      id: tag?.id ?? null,
      name: tag?.name ?? '',
      slug: tag?.slug ?? '',
      order: null,
    });
  }

  protected updateFormName(name: string): void {
    this.form.update((form) => (form ? { ...form, name } : form));
  }

  protected updateFormSlug(slug: string): void {
    this.form.update((form) => (form ? { ...form, slug } : form));
  }

  protected closeForm(): void {
    this.form.set(null);
    this.formError.set(null);
  }

  protected saveForm(): void {
    const form = this.form();
    if (!form) {
      return;
    }

    const name = form.name.trim();
    const slug = form.slug.trim();
    if (!name || !slug) {
      this.formError.set('Name and slug are required.');
      return;
    }

    if (form.kind === 'category') {
      this.saveCategory({ ...form, name, slug, order: form.order ?? this.categories().length + 1 });
      return;
    }

    this.saveTag({ ...form, name, slug });
  }

  protected requestDeleteCategory(category: Category): void {
    this.pendingDelete.set({ kind: 'category', id: category.id, name: category.name });
  }

  protected requestDeleteTag(tag: Tag): void {
    this.pendingDelete.set({ kind: 'tag', id: tag.id, name: tag.name });
  }

  protected cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  protected confirmDelete(): void {
    const target = this.pendingDelete();
    if (!target) {
      return;
    }

    if (target.kind === 'category') {
      this.categoriesApi.delete(target.id).subscribe({
        next: () => {
          this.categories.update((items) => items.filter((item) => item.id !== target.id));
          this.pendingDelete.set(null);
          this.status.set('Category deleted');
        },
        error: (e: Error) => this.error.set(e.message),
      });
      return;
    }

    this.tagsApi.delete(target.id).subscribe({
      next: () => {
        this.tags.update((items) => items.filter((item) => item.id !== target.id));
        this.pendingDelete.set(null);
        this.status.set('Tag deleted');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  private saveCategory(form: TaxonomyForm & { order: number }): void {
    const request = form.id
      ? this.categoriesApi.update(form.id, { name: form.name, slug: form.slug, order: form.order })
      : this.categoriesApi.create({ name: form.name, slug: form.slug, order: form.order });

    request.subscribe({
      next: (category) => {
        this.categories.update((items) =>
          form.id ? items.map((item) => (item.id === category.id ? category : item)) : [...items, category],
        );
        this.closeForm();
        this.status.set('Category saved');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  private saveTag(form: TaxonomyForm): void {
    const request = form.id
      ? this.tagsApi.update(form.id, { name: form.name, slug: form.slug })
      : this.tagsApi.create({ name: form.name, slug: form.slug });

    request.subscribe({
      next: (tag) => {
        this.tags.update((items) =>
          form.id ? items.map((item) => (item.id === tag.id ? tag : item)) : [...items, tag],
        );
        this.closeForm();
        this.status.set('Tag saved');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }
}
