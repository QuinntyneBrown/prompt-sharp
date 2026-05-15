import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-admin-users-table',
  templateUrl: './admin-users-table.html',
  styleUrl: './admin-users-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersTable {
}
