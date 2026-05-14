import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from '../models/guid';
import { User } from '../models/user';
import { UserRolesUpsert } from '../models/user-roles-upsert';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminUsersApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.url('api/v1/admin/users'));
  }

  updateRoles(id: Guid, input: UserRolesUpsert): Observable<User> {
    return this.http.put<User>(this.url(`api/v1/admin/users/${encodeURIComponent(id)}/roles`), input);
  }
}
