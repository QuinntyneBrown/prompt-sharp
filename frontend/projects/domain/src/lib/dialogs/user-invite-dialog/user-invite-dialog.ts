import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell, TextField } from 'components';

@Component({
  selector: 'ps-user-invite-dialog',
  templateUrl: './user-invite-dialog.html',
  styleUrl: './user-invite-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell, TextField],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserInviteDialog {
  readonly open = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly cancelled = output<void>();
  readonly submitted = output<{ email: string; roles: string[] }>();

  protected emailValue = 'alex@example.com';

  protected onEmail(value: string): void {
    this.emailValue = value;
  }

  protected submit(): void {
    this.submitted.emit({ email: this.emailValue, roles: [] });
  }
}
