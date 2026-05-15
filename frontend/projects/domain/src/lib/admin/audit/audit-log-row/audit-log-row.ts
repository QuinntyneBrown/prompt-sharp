import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-audit-log-row',
  templateUrl: './audit-log-row.html',
  styleUrl: './audit-log-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogRow {
}
