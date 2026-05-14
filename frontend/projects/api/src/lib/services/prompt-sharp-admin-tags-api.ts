import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from '../models/guid';
import { Tag } from '../models/tag';
import { TagUpsert } from '../models/tag-upsert';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminTagsApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.url('api/v1/admin/tags'));
  }

  create(input: TagUpsert): Observable<Tag> {
    return this.http.post<Tag>(this.url('api/v1/admin/tags'), input);
  }

  update(id: Guid, input: TagUpsert): Observable<Tag> {
    return this.http.put<Tag>(this.url(`api/v1/admin/tags/${encodeURIComponent(id)}`), input);
  }

  delete(id: Guid): Observable<void> {
    return this.http.delete<void>(this.url(`api/v1/admin/tags/${encodeURIComponent(id)}`));
  }
}
