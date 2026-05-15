import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  Category,
  DifficultyLevel,
  PagedResult,
  PromptSharpCategoriesApi,
  PromptSharpTutorialsApi,
  TutorialListItem,
} from 'api';
import { Button, SelectField, SelectFieldOption, TextField } from 'components';

@Component({
  selector: 'ps-catalog-page',
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, SelectField, TextField],
})
export class CatalogPage implements OnInit {
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);
  private readonly categoriesApi = inject(PromptSharpCategoriesApi);

  protected readonly tutorials = signal<PagedResult<TutorialListItem> | null>(null);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly searchQuery = signal<string>('');
  protected readonly categoryFilter = signal<string | null>(null);
  protected readonly difficultyFilter = signal<DifficultyLevel | null>(null);
  protected readonly viewMode = signal<'grid' | 'list'>('grid');
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly categoryOptions = computed<SelectFieldOption[]>(() => [
    { value: '', label: 'All categories' },
    ...this.categories().map((category) => ({ value: category.slug, label: category.name })),
  ]);
  protected readonly difficultyOptions: SelectFieldOption[] = [
    { value: '', label: 'Any difficulty' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];
  protected readonly sortOptions: SelectFieldOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'title', label: 'Title' },
  ];

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.list({
      search: this.searchQuery() || null,
      category: this.categoryFilter(),
      difficulty: this.difficultyFilter(),
      page: 1,
      pageSize: 24,
    }).subscribe({
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

  protected search(query: string): void {
    this.searchQuery.set(query.trim());
    this.load();
  }

  protected setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  protected setCategory(slug: string): void {
    this.categoryFilter.set(slug || null);
    this.load();
  }

  protected setDifficulty(difficulty: string): void {
    this.difficultyFilter.set(difficulty ? (difficulty as DifficultyLevel) : null);
    this.load();
  }

  protected setListView(): void {
    this.viewMode.set('list');
  }

  protected resetFilters(): void {
    this.searchQuery.set('');
    this.categoryFilter.set(null);
    this.difficultyFilter.set(null);
    this.viewMode.set('grid');
    this.load();
  }
}
