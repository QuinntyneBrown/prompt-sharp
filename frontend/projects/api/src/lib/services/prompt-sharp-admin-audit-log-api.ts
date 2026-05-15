import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditEvent } from '../models/audit-event';
import { AuditLogQuery } from '../models/audit-log-query';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';
import { queryParams } from '../query-params';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminAuditLogApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(query: AuditLogQuery = {}): Observable<AuditEvent[]> {
    return this.http.get<AuditEvent[]>(this.url('api/v1/admin/audit-log'), {
      params: queryParams(query),
    });
  }
}
