import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-session-expired-dialog',
  templateUrl: './session-expired-dialog.html',
  styleUrl: './session-expired-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiredDialog {
  readonly reauthenticate = output<void>();
}
