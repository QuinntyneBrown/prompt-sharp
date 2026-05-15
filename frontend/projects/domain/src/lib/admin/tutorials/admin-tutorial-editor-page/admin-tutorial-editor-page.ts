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
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing tutorial id.');
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
    this.categoriesApi.list().subscribe({ next: (c) => this.categories.set(c) });
    this.tagsApi.list().subscribe({ next: (t) => this.tags.set(t) });
    this.mediaApi.list().subscribe({ next: (m) => this.media.set(m) });
  }
}
