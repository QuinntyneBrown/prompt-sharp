import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class ConfirmDeleteDialog {
  readonly open = input<boolean>(false);
  readonly itemName = input<string | null>(null);

  readonly cancelled = output<void>();
  readonly confirmed = output<void>();
}
