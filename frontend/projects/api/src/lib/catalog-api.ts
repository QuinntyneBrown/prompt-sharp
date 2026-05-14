import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Category,
  PagedQuery,
  PagedResult,
  TutorialDetail,
  TutorialListItem,
  TutorialListQuery,
} from './models';
import { PromptSharpApiEndpoint, queryParams } from './http-utils';

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
