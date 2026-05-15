import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-sign-out-dialog',
  templateUrl: './sign-out-dialog.html',
  styleUrl: './sign-out-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutDialog {
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
