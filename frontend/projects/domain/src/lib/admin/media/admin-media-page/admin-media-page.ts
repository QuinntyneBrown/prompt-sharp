import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Media, PromptSharpAdminMediaApi } from 'api';

@Component({
  selector: 'ps-admin-media-page',
  templateUrl: './admin-media-page.html',
  styleUrl: './admin-media-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMediaPage implements OnInit {
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected readonly media = signal<readonly Media[]>([]);
  protected readonly pendingDelete = signal<Media | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

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

  protected upload(files: FileList | null): void {
    const file = files?.[0];
    if (!file) {
      return;
    }

    this.mediaApi.upload(file, file.name).subscribe({
      next: (media) => {
        this.media.update((items) => [media, ...items]);
        this.status.set('Uploaded');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected copyUrl(media: Media): void {
    navigator.clipboard?.writeText(media.url).catch(() => undefined);
    this.status.set('Copied');
  }

  protected requestDelete(media: Media): void {
    this.pendingDelete.set(media);
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
