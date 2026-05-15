import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
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
    this.tutorialsApi.list({ search: this.query() || null, page: 1, pageSize: 24 }).subscribe({
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

  protected search(query: string): void {
    this.query.set(query.trim());
    this.load();
  }
}
