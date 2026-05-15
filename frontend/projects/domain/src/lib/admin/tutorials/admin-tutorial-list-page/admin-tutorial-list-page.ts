import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
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
