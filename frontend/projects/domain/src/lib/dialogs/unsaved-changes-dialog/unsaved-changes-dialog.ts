import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-unsaved-changes-dialog',
  templateUrl: './unsaved-changes-dialog.html',
  styleUrl: './unsaved-changes-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesDialog {
  readonly discarded = output<void>();
  readonly cancelled = output<void>();
}
