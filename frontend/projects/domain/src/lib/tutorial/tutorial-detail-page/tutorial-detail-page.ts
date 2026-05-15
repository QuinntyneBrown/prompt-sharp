import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromptSharpMeApi, PromptSharpTutorialsApi, TutorialDetail, TutorialProgress } from 'api';

@Component({
  selector: 'ps-tutorial-detail-page',
  templateUrl: './tutorial-detail-page.html',
  styleUrl: './tutorial-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly tutorial = signal<TutorialDetail | null>(null);
  protected readonly progress = signal<TutorialProgress | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error.set('Missing tutorial slug.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.bySlug(slug).subscribe({
      next: (detail) => {
        this.tutorial.set(detail);
        this.loading.set(false);
        this.meApi.progress(detail.id).subscribe({
          next: (p) => this.progress.set(p),
          error: () => this.progress.set(null),
        });
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
