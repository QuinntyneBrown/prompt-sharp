import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Button, DialogShell, DropZone } from 'components';
import { PromptSharpAdminMediaApi } from 'api';

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
  readonly uploaded = output<unknown>();
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected onFiles(files: FileList | null): void {
    if (!files || files.length === 0) return;
    const file = files[0];
    this.mediaApi.upload(file, file.name).subscribe({
      next: (media) => this.uploaded.emit(media),
    });
  }
}
