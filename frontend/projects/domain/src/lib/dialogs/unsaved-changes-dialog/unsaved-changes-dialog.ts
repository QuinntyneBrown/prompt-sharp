import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-unsaved-changes-dialog',
  templateUrl: './unsaved-changes-dialog.html',
  styleUrl: './unsaved-changes-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class UnsavedChangesDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly discarded = output<void>();
}
