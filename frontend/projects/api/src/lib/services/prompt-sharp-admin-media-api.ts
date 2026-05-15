import { HttpClient, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Guid } from '../models/guid';
import { Media } from '../models/media';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

export type MediaUploadEvent =
  | { type: 'progress'; percent: number | null }
  | { type: 'complete'; media: Media };

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

  uploadWithProgress(file: Blob, fileName?: string): Observable<MediaUploadEvent> {
    const formData = new FormData();
    const namedFile = file as Blob & { name?: string };
    formData.append('file', file, fileName ?? namedFile.name ?? 'upload.bin');

    return this.http
      .post<Media>(this.url('api/v1/admin/media'), formData, {
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter((event) => event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
        map((event) => {
          if (event.type === HttpEventType.Response) {
            return { type: 'complete', media: event.body as Media } satisfies MediaUploadEvent;
          }

          return {
            type: 'progress',
            percent: event.total ? Math.round((event.loaded / event.total) * 100) : null,
          } satisfies MediaUploadEvent;
        }),
      );
  }

  delete(id: Guid): Observable<void> {
    return this.http.delete<void>(this.url(`api/v1/admin/media/${encodeURIComponent(id)}`));
  }
}
