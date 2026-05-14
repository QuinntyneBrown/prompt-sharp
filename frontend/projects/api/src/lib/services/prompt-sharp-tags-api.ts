import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedQuery } from '../models/paged-query';
import { PagedResult } from '../models/paged-result';
import { TutorialListItem } from '../models/tutorial-list-item';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';
import { queryParams } from '../query-params';

@Injectable({ providedIn: 'root' })
export class PromptSharpTagsApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  tutorials(slug: string, query: PagedQuery = {}): Observable<PagedResult<TutorialListItem>> {
    return this.http.get<PagedResult<TutorialListItem>>(
      this.url(`api/v1/tags/${encodeURIComponent(slug)}/tutorials`),
      {
        params: queryParams(query),
      },
    );
  }
}
