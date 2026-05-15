import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-session-expired-dialog',
  templateUrl: './session-expired-dialog.html',
  styleUrl: './session-expired-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class SessionExpiredDialog {
  readonly open = input<boolean>(false);
  readonly reauthenticate = output<void>();
}
