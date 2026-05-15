import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AuditEvent, PromptSharpAdminAuditLogApi } from 'api';
import { Button, SearchField, SelectField, SelectFieldOption } from 'components';

@Component({
  selector: 'ps-admin-audit-log-page',
  templateUrl: './admin-audit-log-page.html',
  styleUrl: './admin-audit-log-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, SearchField, SelectField],
})
export class AdminAuditLogPage implements OnInit {
  private readonly auditLogApi = inject(PromptSharpAdminAuditLogApi);
  private requestId = 0;

  protected readonly actorFilter = signal<string>('');
  protected readonly actionFilter = signal<string>('');
  protected readonly selectedEntry = signal<AuditEvent | null>(null);
  protected readonly entries = signal<readonly AuditEvent[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly actionOptions: SelectFieldOption[] = [
    { value: '', label: 'All actions' },
    { value: 'Publish tutorial', label: 'Publish tutorial' },
    { value: 'Update roles', label: 'Update roles' },
  ];

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    const requestId = ++this.requestId;
    this.loading.set(true);
    this.error.set(null);
    this.auditLogApi.list({
      actor: this.actorFilter().trim() || null,
      action: this.actionFilter() || null,
    }).subscribe({
      next: (entries) => {
        if (requestId !== this.requestId) {
          return;
        }

        this.entries.set(entries);
        this.loading.set(false);
      },
      error: (e: Error) => {
        if (requestId !== this.requestId) {
          return;
        }

        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected filterByActor(actor: string): void {
    this.actorFilter.set(actor);
    this.load();
  }

  protected filterByAction(action: string): void {
    this.actionFilter.set(action);
    this.load();
  }

  protected openDetails(entry: AuditEvent): void {
    this.selectedEntry.set(entry);
  }

  protected closeDetails(): void {
    this.selectedEntry.set(null);
  }
}
