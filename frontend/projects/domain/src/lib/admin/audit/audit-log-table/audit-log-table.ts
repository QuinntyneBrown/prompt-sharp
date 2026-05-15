import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-audit-log-table',
  templateUrl: './audit-log-table.html',
  styleUrl: './audit-log-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogTable {
}
