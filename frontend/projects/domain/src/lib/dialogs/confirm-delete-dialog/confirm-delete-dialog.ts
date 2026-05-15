import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialog {
  readonly itemName = input<string | null>(null);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
