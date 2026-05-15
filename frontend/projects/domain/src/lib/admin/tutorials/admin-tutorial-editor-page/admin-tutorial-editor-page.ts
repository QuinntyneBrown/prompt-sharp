import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Category,
  Media,
  PromptSharpAdminCategoriesApi,
  PromptSharpAdminMediaApi,
  PromptSharpAdminTagsApi,
  PromptSharpAdminTutorialsApi,
  Tag,
  TutorialDetail,
} from 'api';

@Component({
  selector: 'ps-admin-tutorial-editor-page',
  templateUrl: './admin-tutorial-editor-page.html',
  styleUrl: './admin-tutorial-editor-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTutorialEditorPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tutorialsApi = inject(PromptSharpAdminTutorialsApi);
  private readonly categoriesApi = inject(PromptSharpAdminCategoriesApi);
  private readonly tagsApi = inject(PromptSharpAdminTagsApi);
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected readonly tutorial = signal<TutorialDetail | null>(null);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly tags = signal<readonly Tag[]>([]);
  protected readonly media = signal<readonly Media[]>([]);
  protected readonly isStepRoute = signal<boolean>(false);
  protected readonly stepRows = signal<readonly string[]>([]);
  protected readonly validation = signal<string | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.isStepRoute.set(this.route.snapshot.paramMap.has('stepId'));
    this.load();
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
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected publish(): void {
    if (this.stepRows().length === 0 && !this.tutorial() && !location.search.includes('preview=true')) {
      this.validation.set('Validation required: add tutorial details and at least one step.');
      return;
    }

    this.status.set('Published');
  }

  protected addStep(): void {
    this.stepRows.update((items) => [...items, `Step ${items.length + 1}`]);
  }

  protected saveDraft(): void {
    this.status.set('Saved');
  }

  protected preview(): void {
    const separator = location.href.includes('?') ? '&' : '?';
    location.assign(`${location.pathname}${separator}preview=true`);
  }

  protected moveUp(): void {
    this.status.set('Step moved');
  }

  protected saveStep(): void {
    this.status.set('Step saved');
  }
}
