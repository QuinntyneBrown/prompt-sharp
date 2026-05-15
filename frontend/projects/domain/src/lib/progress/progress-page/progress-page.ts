import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Bookmark, PromptSharpMeApi } from 'api';
import { Button } from 'components';

@Component({
  selector: 'ps-progress-page',
  templateUrl: './progress-page.html',
  styleUrl: './progress-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
})
export class ProgressPage implements OnInit {
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly bookmarks = signal<readonly Bookmark[]>([]);
  protected readonly status = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.meApi.bookmarks().subscribe({
      next: (b) => {
        this.bookmarks.set(b);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected removeBookmark(tutorialId: string): void {
    this.meApi.deleteBookmark(tutorialId).subscribe({
      next: () => {
        this.bookmarks.update((items) => items.filter((item) => item.tutorial.id !== tutorialId));
        this.status.set('Bookmark removed');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }
}
