import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'api';
import { PromptSharpMeApi, PromptSharpTutorialsApi, TutorialDetail, TutorialProgress } from 'api';
import { Button, SpinnerDot } from 'components';

@Component({
  selector: 'ps-tutorial-detail-page',
  templateUrl: './tutorial-detail-page.html',
  styleUrl: './tutorial-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, SpinnerDot],
})
export class TutorialDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly tutorial = signal<TutorialDetail | null>(null);
  protected readonly progress = signal<TutorialProgress | null>(null);
  protected readonly currentStepIndex = signal<number>(0);
  protected readonly completedStepIds = signal<readonly Guid[]>([]);
  protected readonly status = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly currentStep = computed(() => {
    const tutorial = this.tutorial();
    return tutorial?.steps[this.currentStepIndex()] ?? null;
  });

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
          next: (p) => {
            this.progress.set(p);
            this.completedStepIds.set(p.completedStepIds);
            const stepIndex = detail.steps.findIndex((step) => step.id === p.currentStepId);
            this.currentStepIndex.set(stepIndex >= 0 ? stepIndex : 0);
          },
          error: () => this.progress.set(null),
        });
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected startTutorial(): void {
    this.currentStepIndex.set(0);
    this.status.set('Tutorial started');
  }

  protected copyCurrentCode(): void {
    const code = this.currentStep()?.codeSnippet ?? '';
    navigator.clipboard?.writeText(code).catch(() => undefined);
    this.status.set('Copied code');
  }

  protected completeCurrentStep(): void {
    const tutorial = this.tutorial();
    const step = this.currentStep();
    if (!tutorial || !step) {
      return;
    }

    const completed = Array.from(new Set([...this.completedStepIds(), step.id]));
    this.completedStepIds.set(completed);
    this.meApi.putProgress(tutorial.id, {
      currentStepId: step.id,
      completedStepIds: completed,
    }).subscribe({
      next: (progress) => this.progress.set(progress),
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected bookmark(): void {
    const tutorial = this.tutorial();
    if (!tutorial) {
      return;
    }

    this.meApi.addBookmark(tutorial.id).subscribe({
      next: () => this.status.set('Bookmarked tutorial'),
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected nextStep(): void {
    const tutorial = this.tutorial();
    if (!tutorial) {
      return;
    }

    this.currentStepIndex.set(Math.min(this.currentStepIndex() + 1, tutorial.steps.length - 1));
  }
}
