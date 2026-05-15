import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from '../models/guid';
import { User } from '../models/user';
import { UserInvitation } from '../models/user-invitation';
import { UserInvitationInput } from '../models/user-invitation-input';
import { UserRolesUpsert } from '../models/user-roles-upsert';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminUsersApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.url('api/v1/admin/users'));
  }

  invitations(): Observable<UserInvitation[]> {
    return this.http.get<UserInvitation[]>(this.url('api/v1/admin/users/invitations'));
  }

  invite(input: UserInvitationInput): Observable<UserInvitation> {
    return this.http.post<UserInvitation>(this.url('api/v1/admin/users/invitations'), input);
  }

  updateRoles(id: Guid, input: UserRolesUpsert): Observable<User> {
    return this.http.put<User>(this.url(`api/v1/admin/users/${encodeURIComponent(id)}/roles`), input);
  }
}
