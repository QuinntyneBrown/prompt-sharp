import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-admin-tutorial-dialog',
  templateUrl: './admin-tutorial-dialog.html',
  styleUrl: './admin-tutorial-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTutorialDialog {
  readonly submitted = output<unknown>();
  readonly cancelled = output<void>();
}
