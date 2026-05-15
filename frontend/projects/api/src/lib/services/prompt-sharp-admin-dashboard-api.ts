import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDashboard } from '../models/admin-dashboard';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminDashboardApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  get(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(this.url('api/v1/admin/dashboard'));
  }
}
