import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Media, PromptSharpAdminMediaApi } from 'api';
import { Button, TextField } from 'components';
import { ConfirmDeleteDialog } from '../../../dialogs/confirm-delete-dialog/confirm-delete-dialog';
import { MediaUploadDialog } from '../../../dialogs/media-upload-dialog/media-upload-dialog';

@Component({
  selector: 'ps-admin-media-page',
  templateUrl: './admin-media-page.html',
  styleUrl: './admin-media-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ConfirmDeleteDialog, MediaUploadDialog, TextField],
})
export class AdminMediaPage implements OnInit {
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected readonly media = signal<readonly Media[]>([]);
  protected readonly searchQuery = signal<string>('');
  protected readonly pendingDelete = signal<Media | null>(null);
  protected readonly uploadDialogOpen = signal<boolean>(false);
  protected readonly status = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly filteredMedia = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase();
    if (!query) {
      return this.media();
    }

    return this.media().filter((item) =>
      item.fileName.toLocaleLowerCase().includes(query) ||
      item.url.toLocaleLowerCase().includes(query));
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.mediaApi.list().subscribe({
      next: (m) => {
        this.media.set(m);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected openUploadDialog(): void {
    this.uploadDialogOpen.set(true);
  }

  protected cancelUpload(): void {
    this.uploadDialogOpen.set(false);
  }

  protected addUploadedMedia(media: Media): void {
    this.media.update((items) => [media, ...items]);
    this.uploadDialogOpen.set(false);
    this.status.set('Uploaded');
  }

  protected copyUrl(media: Media): void {
    navigator.clipboard?.writeText(media.url).catch(() => undefined);
    this.status.set('Copied');
  }

  protected requestDelete(media: Media): void {
    this.pendingDelete.set(media);
  }

  protected cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  protected confirmDelete(): void {
    const media = this.pendingDelete();
    if (!media) {
      return;
    }

    this.mediaApi.delete(media.id).subscribe({
      next: () => {
        this.media.update((items) => items.filter((item) => item.id !== media.id));
        this.pendingDelete.set(null);
        this.status.set('Deleted');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }
}
