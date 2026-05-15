import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Media, PromptSharpAdminMediaApi } from 'api';
import { Button, DialogShell, DropZone } from 'components';

@Component({
  selector: 'ps-media-upload-dialog',
  templateUrl: './media-upload-dialog.html',
  styleUrl: './media-upload-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell, DropZone],
})
export class MediaUploadDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly uploaded = output<Media>();

  private readonly mediaApi = inject(PromptSharpAdminMediaApi);
  protected readonly uploading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected onFiles(files: FileList | null): void {
    if (!files || files.length === 0) return;
    const file = files[0];
    this.uploading.set(true);
    this.error.set(null);
    this.mediaApi.upload(file, file.name).subscribe({
      next: (media) => {
        this.uploading.set(false);
        this.uploaded.emit(media);
      },
      error: (e: Error) => {
        this.uploading.set(false);
        this.error.set(e.message);
      },
    });
  }
}
