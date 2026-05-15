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
