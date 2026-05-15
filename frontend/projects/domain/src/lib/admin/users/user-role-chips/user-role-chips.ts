import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-user-role-chips',
  templateUrl: './user-role-chips.html',
  styleUrl: './user-role-chips.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRoleChips {
  readonly rolesChanged = output<string[]>();
}
