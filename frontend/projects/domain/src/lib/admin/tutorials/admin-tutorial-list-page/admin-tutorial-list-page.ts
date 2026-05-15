import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, PagedResult, PromptSharpAdminCategoriesApi, PromptSharpAdminTutorialsApi, TutorialListItem } from 'api';
import { Button, SearchField, SelectField, SelectFieldOption, SpinnerDot } from 'components';
import { AdminTutorialDialog, AdminTutorialDialogSubmit } from '../admin-tutorial-dialog/admin-tutorial-dialog';
import { ConfirmDeleteDialog } from '../../../dialogs/confirm-delete-dialog/confirm-delete-dialog';
import { PublishDialog } from '../../../dialogs/publish-dialog/publish-dialog';

@Component({
  selector: 'ps-admin-tutorial-list-page',
  templateUrl: './admin-tutorial-list-page.html',
  styleUrl: './admin-tutorial-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminTutorialDialog, Button, ConfirmDeleteDialog, PublishDialog, SearchField, SelectField, SpinnerDot],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminTutorialListPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tutorialsApi = inject(PromptSharpAdminTutorialsApi);
  private readonly categoriesApi = inject(PromptSharpAdminCategoriesApi);

  protected readonly tutorials = signal<PagedResult<TutorialListItem> | null>(null);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly searchQuery = signal<string>('');
  protected readonly statusFilter = signal<string>('All');
  protected readonly pendingDelete = signal<TutorialListItem | null>(null);
  protected readonly pendingPublish = signal<TutorialListItem | null>(null);
  protected readonly createDialogOpen = signal<boolean>(false);
  protected readonly createDialogError = signal<string | null>(null);
  protected readonly activeActionsId = signal<string | null>(null);
  protected readonly categoryOptions = computed<SelectFieldOption[]>(() =>
    this.categories().map((category) => ({ value: category.id, label: category.name })),
  );
  protected readonly statusOptions: SelectFieldOption[] = [
    { value: 'All', label: 'All' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' },
  ];

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('auditDialog') === 'tutorial') {
      this.openCreateDialog();
    }

    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.list({ page: 1, pageSize: 50 }).subscribe({
      next: (page) => {
        this.tutorials.set(page);
        this.applyAuditDialog(page.items[0] ?? null);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
    this.categoriesApi.list().subscribe({ next: (categories) => this.categories.set(categories) });
  }

  protected search(query: string): void {
    this.searchQuery.set(query);
    this.loading.set(true);
    this.tutorialsApi.list({ page: 1, pageSize: 50, search: query.trim() || null }).subscribe({
      next: (page) => {
        this.tutorials.set(page);
        this.applyAuditDialog(page.items[0] ?? null);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected requestPublish(tutorial: TutorialListItem): void {
    this.pendingPublish.set(tutorial);
    this.activeActionsId.set(null);
  }

  protected openCreateDialog(): void {
    this.createDialogError.set(null);
    this.createDialogOpen.set(true);
  }

  protected closeCreateDialog(): void {
    this.createDialogOpen.set(false);
    this.createDialogError.set(null);
  }

  protected createDraft(input: AdminTutorialDialogSubmit): void {
    this.createDialogError.set(null);
    this.tutorialsApi.create({
      ...input,
      tagIds: [],
    }).subscribe({
      next: (tutorial) => {
        this.status.set('Draft created');
        this.createDialogOpen.set(false);
        void this.router.navigate(['/admin/tutorials', tutorial.id, 'edit']);
      },
      error: (e: Error) => this.createDialogError.set(e.message),
    });
  }

  protected confirmPublish(): void {
    const tutorial = this.pendingPublish();
    if (tutorial === null) {
      return;
    }

    this.tutorialsApi.publish(tutorial.id).subscribe({
      next: (updated) => {
        this.pendingPublish.set(null);
        this.tutorials.update((page) =>
          page === null
            ? page
            : {
                ...page,
                items: page.items.map((item) =>
                  item.id === tutorial.id ? { ...item, isPublished: updated.isPublished } : item,
                ),
              },
        );
        this.status.set('Published');
      },
      error: (e: Error) => {
        this.error.set(e.message);
      },
    });
  }

  protected cancelPublish(): void {
    this.pendingPublish.set(null);
  }

  protected openActions(tutorial: TutorialListItem): void {
    this.activeActionsId.set(tutorial.id);
  }

  protected feature(tutorial: TutorialListItem): void {
    this.tutorialsApi.feature(tutorial.id).subscribe({ next: () => this.status.set('Featured') });
  }

  protected editorsPick(tutorial: TutorialListItem): void {
    this.tutorialsApi.setEditorsPick(tutorial.id).subscribe({ next: () => this.status.set("Editor's pick saved") });
  }

  protected requestDelete(tutorial: TutorialListItem): void {
    this.pendingDelete.set(tutorial);
    this.activeActionsId.set(null);
  }

  protected confirmDelete(): void {
    const tutorial = this.pendingDelete();
    if (tutorial === null) {
      return;
    }

    this.tutorialsApi.delete(tutorial.id).subscribe({
      next: () => {
        this.pendingDelete.set(null);
        this.tutorials.update((page) =>
          page === null
            ? page
            : {
                ...page,
                items: page.items.filter((item) => item.id !== tutorial.id),
                totalCount: Math.max(0, page.totalCount - 1),
              },
        );
        this.status.set('Deleted');
      },
      error: (e: Error) => {
        this.error.set(e.message);
      },
    });
  }

  protected cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  private applyAuditDialog(firstTutorial: TutorialListItem | null): void {
    if (firstTutorial === null) {
      return;
    }

    const auditDialog = this.route.snapshot.queryParamMap.get('auditDialog');
    if (auditDialog === 'publish') {
      this.pendingPublish.set(firstTutorial);
      return;
    }

    if (auditDialog === 'confirm-delete') {
      this.pendingDelete.set(firstTutorial);
    }
  }
}
