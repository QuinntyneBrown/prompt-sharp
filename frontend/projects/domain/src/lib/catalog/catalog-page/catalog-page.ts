import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
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
