import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-admin-table-shell',
  templateUrl: './admin-table-shell.html',
  styleUrl: './admin-table-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTableShell {
}
