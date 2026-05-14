import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/paged-result';
import { TutorialDetail } from '../models/tutorial-detail';
import { TutorialListItem } from '../models/tutorial-list-item';
import { TutorialListQuery } from '../models/tutorial-list-query';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';
import { queryParams } from '../query-params';

@Injectable({ providedIn: 'root' })
export class PromptSharpTutorialsApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(query: TutorialListQuery = {}): Observable<PagedResult<TutorialListItem>> {
    return this.http.get<PagedResult<TutorialListItem>>(this.url('api/v1/tutorials'), {
      params: queryParams(query),
    });
  }

  featured(): Observable<TutorialListItem[]> {
    return this.http.get<TutorialListItem[]>(this.url('api/v1/tutorials/featured'));
  }

  editorsPick(): Observable<TutorialListItem | null> {
    return this.http.get<TutorialListItem | null>(this.url('api/v1/tutorials/editors-pick'));
  }

  bySlug(slug: string): Observable<TutorialDetail> {
    return this.http.get<TutorialDetail>(this.url(`api/v1/tutorials/${encodeURIComponent(slug)}`));
  }
}
