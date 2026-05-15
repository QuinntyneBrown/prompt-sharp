import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-media-upload-dialog',
  templateUrl: './media-upload-dialog.html',
  styleUrl: './media-upload-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaUploadDialog {
  readonly uploaded = output<unknown>();
  readonly cancelled = output<void>();
}
