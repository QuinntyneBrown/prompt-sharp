import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
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
