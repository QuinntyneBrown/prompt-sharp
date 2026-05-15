import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  DifficultyLevel,
  Media,
  PromptSharpAdminCategoriesApi,
  PromptSharpAdminMediaApi,
  PromptSharpAdminTagsApi,
  PromptSharpAdminTutorialsApi,
  Tag,
  TutorialDetail,
  TutorialStep,
  TutorialStepUpsert,
  TutorialUpsert,
} from 'api';
import { Button, DropZone, SelectField, SelectFieldOption, TextArea, TextField } from 'components';
import { Observable, switchMap } from 'rxjs';
import { PublishDialog } from '../../../dialogs/publish-dialog/publish-dialog';
import { UnsavedChangesDialog } from '../../../dialogs/unsaved-changes-dialog/unsaved-changes-dialog';

@Component({
  selector: 'ps-admin-tutorial-editor-page',
  templateUrl: './admin-tutorial-editor-page.html',
  styleUrl: './admin-tutorial-editor-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DropZone, PublishDialog, SelectField, TextArea, TextField, UnsavedChangesDialog],
})
export class AdminTutorialEditorPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tutorialsApi = inject(PromptSharpAdminTutorialsApi);
  private readonly categoriesApi = inject(PromptSharpAdminCategoriesApi);
  private readonly tagsApi = inject(PromptSharpAdminTagsApi);
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);
  private readonly dirty = signal<boolean>(false);
  private readonly pendingNavigationUrl = signal<string | null>(null);

  protected readonly tutorial = signal<TutorialDetail | null>(null);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly tags = signal<readonly Tag[]>([]);
  protected readonly media = signal<readonly Media[]>([]);
  protected readonly isStepRoute = signal<boolean>(false);
  protected readonly stepRows = signal<readonly TutorialStepUpsert[]>([]);
  protected readonly validation = signal<string | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly publishDialogOpen = signal<boolean>(false);
  protected readonly unsavedDialogOpen = signal<boolean>(false);
  protected readonly title = signal<string>('');
  protected readonly slug = signal<string>('');
  protected readonly summary = signal<string>('');
  protected readonly categoryId = signal<string>('');
  protected readonly difficultyLevel = signal<DifficultyLevel | ''>('');
  protected readonly estimatedMinutes = signal<string>('');
  protected readonly selectedStepId = signal<string | null>(null);
  protected readonly stepTitle = signal<string>('');
  protected readonly stepBodyMarkdown = signal<string>('');
  protected readonly stepCodeSnippet = signal<string>('');
  protected readonly stepCodeLanguage = signal<string>('');
  protected readonly categoryOptions = computed<SelectFieldOption[]>(() =>
    this.categories().map((category) => ({ value: category.id, label: category.name })),
  );
  protected readonly difficultyOptions: SelectFieldOption[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];
  protected readonly codeLanguageOptions: SelectFieldOption[] = [
    { value: 'Bash', label: 'Bash' },
    { value: 'CSharp', label: 'CSharp' },
  ];

  ngOnInit(): void {
    const stepId = this.route.snapshot.paramMap.get('stepId');
    this.selectedStepId.set(stepId);
    this.isStepRoute.set(stepId !== null);
    this.load();
  }

  canDeactivate(nextUrl: string): boolean {
    if (!this.dirty()) {
      return true;
    }

    this.pendingNavigationUrl.set(nextUrl);
    this.unsavedDialogOpen.set(true);
    return false;
  }

  protected load(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoriesApi.list().subscribe({ next: (c) => this.categories.set(c) });
    this.tagsApi.list().subscribe({ next: (t) => this.tags.set(t) });
    this.mediaApi.list().subscribe({ next: (m) => this.media.set(m) });
    if (!id || id === 'new') {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.get(id).subscribe({
      next: (t) => {
        this.tutorial.set(t);
        this.setFormFromTutorial(t);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected requestPublish(): void {
    if (this.stepRows().length === 0) {
      this.validation.set('Validation required: add tutorial details and at least one step.');
      return;
    }

    if (!this.buildTutorialInput()) {
      return;
    }

    this.validation.set(null);
    this.publishDialogOpen.set(true);
  }

  protected confirmPublish(): void {
    const draft = this.persistDraft();
    if (!draft) {
      return;
    }

    draft.pipe(switchMap((tutorial) => this.tutorialsApi.publish(tutorial.id))).subscribe({
      next: (tutorial) => {
        this.tutorial.set(tutorial);
        this.publishDialogOpen.set(false);
        this.status.set('Published');
        this.markClean();
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected cancelPublish(): void {
    this.publishDialogOpen.set(false);
  }

  protected addStep(): void {
    this.stepRows.update((items) => [
      ...items,
      {
        title: `Step ${items.length + 1}`,
        bodyMarkdown: 'Draft step content.',
        codeSnippet: null,
        codeLanguage: null,
        imageMediaId: null,
      },
    ]);
    this.markDirty();
  }

  protected saveDraft(): void {
    const draft = this.persistDraft();
    if (!draft) {
      return;
    }

    draft.subscribe({
      next: (tutorial) => {
        this.tutorial.set(tutorial);
        this.status.set('Saved');
        this.markClean();
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected preview(): void {
    history.replaceState(null, '', `${location.pathname}?preview=true`);
  }

  protected moveUp(): void {
    const tutorial = this.tutorial();
    const stepId = this.selectedStepId();
    if (!tutorial || !stepId) {
      return;
    }

    const index = tutorial.steps.findIndex((step) => step.id === stepId);
    if (index <= 0) {
      this.status.set('Step already first');
      return;
    }

    const steps = [...tutorial.steps];
    [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
    this.tutorial.set({ ...tutorial, steps: this.reindexSteps(steps) });
    this.markDirty();
    this.status.set('Step moved');
  }

  protected saveStep(): void {
    const tutorial = this.tutorial();
    const stepId = this.selectedStepId();
    if (!tutorial || !stepId) {
      this.validation.set('Validation required: load a tutorial step before saving.');
      return;
    }

    const steps = tutorial.steps.map((step) =>
      step.id === stepId
        ? {
            title: this.stepTitle().trim(),
            bodyMarkdown: this.stepBodyMarkdown().trim(),
            codeSnippet: this.stepCodeSnippet().trim() || null,
            codeLanguage: this.stepCodeLanguage() || null,
            imageMediaId: step.imageMediaId,
          }
        : this.toStepUpsert(step),
    );

    if (steps.some((step) => !step.title || !step.bodyMarkdown)) {
      this.validation.set('Validation required: step title and body markdown.');
      return;
    }

    this.validation.set(null);
    this.tutorialsApi.replaceSteps(tutorial.id, steps).subscribe({
      next: (updated) => {
        this.tutorial.set(updated);
        this.setSelectedStepForm(updated);
        this.status.set('Step saved');
        this.markClean();
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected setDifficulty(value: string): void {
    if (value === 'beginner' || value === 'intermediate' || value === 'advanced') {
      this.difficultyLevel.set(value);
      this.markDirty();
    }
  }

  protected setStepCodeLanguage(value: string): void {
    this.stepCodeLanguage.set(value);
    this.markDirty();
  }

  protected setTitle(value: string): void {
    this.title.set(value);
    this.markDirty();
  }

  protected setSlug(value: string): void {
    this.slug.set(value);
    this.markDirty();
  }

  protected setSummary(value: string): void {
    this.summary.set(value);
    this.markDirty();
  }

  protected setCategory(value: string): void {
    this.categoryId.set(value);
    this.markDirty();
  }

  protected setEstimatedMinutes(value: string): void {
    this.estimatedMinutes.set(value);
    this.markDirty();
  }

  protected setStepTitle(value: string): void {
    this.stepTitle.set(value);
    this.markDirty();
  }

  protected setStepBodyMarkdown(value: string): void {
    this.stepBodyMarkdown.set(value);
    this.markDirty();
  }

  protected setStepCodeSnippet(value: string): void {
    this.stepCodeSnippet.set(value);
    this.markDirty();
  }

  protected keepEditing(): void {
    this.pendingNavigationUrl.set(null);
    this.unsavedDialogOpen.set(false);
  }

  protected discardChanges(): void {
    const url = this.pendingNavigationUrl();
    this.markClean();
    this.unsavedDialogOpen.set(false);
    this.pendingNavigationUrl.set(null);
    if (url) {
      void this.router.navigateByUrl(url);
    }
  }

  protected markDirty(): void {
    this.dirty.set(true);
  }

  private markClean(): void {
    this.dirty.set(false);
  }

  private persistDraft(): Observable<TutorialDetail> | null {
    const input = this.buildTutorialInput();
    if (!input) {
      return null;
    }

    const current = this.tutorial();
    const save = current
      ? this.tutorialsApi.update(current.id, input)
      : this.tutorialsApi.create(input);

    return save.pipe(
      switchMap((tutorial) => this.tutorialsApi.replaceSteps(tutorial.id, [...this.stepRows()])),
    );
  }

  private buildTutorialInput(): TutorialUpsert | null {
    const title = this.title().trim();
    const slug = this.slug().trim();
    const summary = this.summary().trim();
    const categoryId = this.categoryId();
    const difficultyLevel = this.difficultyLevel();
    const estimatedMinutes = Number.parseInt(this.estimatedMinutes(), 10);

    if (!title || !slug || !summary || !categoryId || !difficultyLevel || !Number.isFinite(estimatedMinutes)) {
      this.validation.set('Validation required: title, slug, summary, category, difficulty, and estimated minutes.');
      return null;
    }

    if (estimatedMinutes <= 0) {
      this.validation.set('Validation required: estimated minutes must be greater than zero.');
      return null;
    }

    this.validation.set(null);
    return {
      title,
      slug,
      summary,
      categoryId,
      difficultyLevel,
      estimatedMinutes,
      tagIds: [],
    };
  }

  private setFormFromTutorial(tutorial: TutorialDetail): void {
    this.title.set(tutorial.title);
    this.slug.set(tutorial.slug);
    this.summary.set(tutorial.summary);
    this.categoryId.set(tutorial.categoryId);
    this.difficultyLevel.set(tutorial.difficultyLevel);
    this.estimatedMinutes.set(tutorial.estimatedMinutes.toString());
    this.stepRows.set(
      tutorial.steps.map((step) => ({
        title: step.title,
        bodyMarkdown: step.bodyMarkdown,
        codeSnippet: step.codeSnippet,
        codeLanguage: step.codeLanguage,
        imageMediaId: step.imageMediaId,
      })),
    );
    this.setSelectedStepForm(tutorial);
    this.markClean();
  }

  private setSelectedStepForm(tutorial: TutorialDetail): void {
    const stepId = this.selectedStepId();
    if (!stepId) {
      return;
    }

    const step = tutorial.steps.find((item) => item.id === stepId);
    if (!step) {
      return;
    }

    this.stepTitle.set(step.title);
    this.stepBodyMarkdown.set(step.bodyMarkdown);
    this.stepCodeSnippet.set(step.codeSnippet ?? '');
    this.stepCodeLanguage.set(step.codeLanguage ?? '');
  }

  private toStepUpsert(step: TutorialStep): TutorialStepUpsert {
    return {
      title: step.title,
      bodyMarkdown: step.bodyMarkdown,
      codeSnippet: step.codeSnippet,
      codeLanguage: step.codeLanguage,
      imageMediaId: step.imageMediaId,
    };
  }

  private reindexSteps(steps: TutorialStep[]): TutorialStep[] {
    return steps.map((step, index) => ({ ...step, order: index + 1 }));
  }
}
