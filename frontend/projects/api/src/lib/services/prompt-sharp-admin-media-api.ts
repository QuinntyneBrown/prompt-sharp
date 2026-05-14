import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from '../models/guid';
import { Media } from '../models/media';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminMediaApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(): Observable<Media[]> {
    return this.http.get<Media[]>(this.url('api/v1/admin/media'));
  }

  upload(file: Blob, fileName?: string): Observable<Media> {
    const formData = new FormData();
    const namedFile = file as Blob & { name?: string };
    formData.append('file', file, fileName ?? namedFile.name ?? 'upload.bin');

    return this.http.post<Media>(this.url('api/v1/admin/media'), formData);
  }

  delete(id: Guid): Observable<void> {
    return this.http.delete<void>(this.url(`api/v1/admin/media/${encodeURIComponent(id)}`));
  }
}
