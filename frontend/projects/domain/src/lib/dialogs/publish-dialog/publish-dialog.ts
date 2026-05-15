import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-publish-dialog',
  templateUrl: './publish-dialog.html',
  styleUrl: './publish-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishDialog {
  readonly submitted = output<unknown>();
  readonly cancelled = output<void>();
}
