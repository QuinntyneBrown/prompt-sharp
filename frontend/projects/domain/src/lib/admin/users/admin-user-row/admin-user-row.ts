import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-admin-user-row',
  templateUrl: './admin-user-row.html',
  styleUrl: './admin-user-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserRow {
  readonly edit = output<void>();
  readonly remove = output<void>();
}
