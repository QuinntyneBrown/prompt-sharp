import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { PagedQuery } from '../models/paged-query';
import { PagedResult } from '../models/paged-result';
import { TutorialListItem } from '../models/tutorial-list-item';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';
import { queryParams } from '../query-params';

@Injectable({ providedIn: 'root' })
export class PromptSharpCategoriesApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url('api/v1/categories'));
  }

  tutorials(slug: string, query: PagedQuery = {}): Observable<PagedResult<TutorialListItem>> {
    return this.http.get<PagedResult<TutorialListItem>>(
      this.url(`api/v1/categories/${encodeURIComponent(slug)}/tutorials`),
      {
        params: queryParams(query),
      },
    );
  }
}
