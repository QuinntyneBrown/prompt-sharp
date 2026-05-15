import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-user-invite-dialog',
  templateUrl: './user-invite-dialog.html',
  styleUrl: './user-invite-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInviteDialog {
  readonly submitted = output<{ email: string; roles: string[] }>();
  readonly cancelled = output<void>();
}
