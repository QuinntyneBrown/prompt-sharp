import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Category,
  PagedResult,
  PromptSharpCategoriesApi,
  PromptSharpTagsApi,
  TutorialListItem,
} from 'api';
import { Button, SelectField, SelectFieldOption } from 'components';

@Component({
  selector: 'ps-category-page',
  templateUrl: './category-page.html',
  styleUrl: './category-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, SelectField],
})
export class CategoryPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly categoriesApi = inject(PromptSharpCategoriesApi);
  private readonly tagsApi = inject(PromptSharpTagsApi);

  protected readonly slug = signal<string | null>(null);
  protected readonly routeKind = signal<'category' | 'tag'>('category');
  protected readonly category = signal<Category | null>(null);
  protected readonly tutorials = signal<PagedResult<TutorialListItem> | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly sortOptions: SelectFieldOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'title', label: 'Title' },
  ];
  protected readonly difficultyOptions: SelectFieldOption[] = [
    { value: '', label: 'Any difficulty' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.slug.set(slug);
    this.routeKind.set(this.route.snapshot.routeConfig?.path?.startsWith('tags') ? 'tag' : 'category');
    this.load();
  }

  protected load(): void {
    const slug = this.slug();
    if (!slug) return;
    this.loading.set(true);
    this.error.set(null);
    if (this.routeKind() === 'tag') {
      this.tagsApi.tutorials(slug, { page: 1, pageSize: 24 }).subscribe({
        next: (page) => {
          this.tutorials.set(page);
          this.loading.set(false);
        },
        error: (e: Error) => {
          this.error.set(e.message);
          this.loading.set(false);
        },
      });
      return;
    } else {
      this.categoriesApi.list().subscribe({
        next: (categories) => {
          const match = categories.find((category) => category.slug === slug) ?? null;
          this.category.set(match);
        },
      });
    }
    this.categoriesApi.tutorials(slug, { page: 1, pageSize: 24 }).subscribe({
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
