import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Bookmark, PromptSharpMeApi, TutorialProgress } from 'api';
import { Button, SpinnerDot } from 'components';
import { catchError, forkJoin, map, of } from 'rxjs';
import { TutorialCard } from '../../tutorial/tutorial-card/tutorial-card';
import { ProgressRow } from '../progress-row/progress-row';

@Component({
  selector: 'ps-progress-page',
  templateUrl: './progress-page.html',
  styleUrl: './progress-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ProgressRow, SpinnerDot, TutorialCard],
})
export class ProgressPage implements OnInit {
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly bookmarks = signal<readonly Bookmark[]>([]);
  protected readonly progressByTutorialId = signal<Record<string, TutorialProgress>>({});
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
        this.loadProgress(b);
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
        this.progressByTutorialId.update((items) => {
          const next = { ...items };
          delete next[tutorialId];
          return next;
        });
        this.status.set('Bookmark removed');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected progressPercent(bookmark: Bookmark): number {
    const progress = this.progressByTutorialId()[bookmark.tutorial.id];
    const stepCount = bookmark.tutorial.stepCount;

    if (!progress || stepCount <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((progress.completedStepIds.length / stepCount) * 100));
  }

  private loadProgress(bookmarks: readonly Bookmark[]): void {
    if (bookmarks.length === 0) {
      this.progressByTutorialId.set({});
      return;
    }

    forkJoin(
      bookmarks.map((bookmark) =>
        this.meApi.progress(bookmark.tutorial.id).pipe(
          map((progress) => [bookmark.tutorial.id, progress] as const),
          catchError(() => of([bookmark.tutorial.id, null] as const)),
        ),
      ),
    ).subscribe({
      next: (entries) => {
        const progressByTutorialId: Record<string, TutorialProgress> = {};

        for (const [tutorialId, progress] of entries) {
          if (progress) {
            progressByTutorialId[tutorialId] = progress;
          }
        }

        this.progressByTutorialId.set(progressByTutorialId);
      },
    });
  }
}
