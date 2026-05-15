import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-sign-out-dialog',
  templateUrl: './sign-out-dialog.html',
  styleUrl: './sign-out-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class SignOutDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly confirmed = output<void>();
}
