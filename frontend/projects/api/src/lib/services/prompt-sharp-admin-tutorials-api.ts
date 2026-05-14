import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminTutorialListQuery } from '../models/admin-tutorial-list-query';
import { Guid } from '../models/guid';
import { PagedResult } from '../models/paged-result';
import { TutorialDetail } from '../models/tutorial-detail';
import { TutorialListItem } from '../models/tutorial-list-item';
import { TutorialStepUpsert } from '../models/tutorial-step-upsert';
import { TutorialUpsert } from '../models/tutorial-upsert';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';
import { queryParams } from '../query-params';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminTutorialsApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(query: AdminTutorialListQuery = {}): Observable<PagedResult<TutorialListItem>> {
    return this.http.get<PagedResult<TutorialListItem>>(this.url('api/v1/admin/tutorials'), {
      params: queryParams(query),
    });
  }

  create(input: TutorialUpsert): Observable<TutorialDetail> {
    return this.http.post<TutorialDetail>(this.url('api/v1/admin/tutorials'), input);
  }

  get(id: Guid): Observable<TutorialDetail> {
    return this.http.get<TutorialDetail>(this.url(`api/v1/admin/tutorials/${encodeURIComponent(id)}`));
  }

  update(id: Guid, input: TutorialUpsert): Observable<TutorialDetail> {
    return this.http.put<TutorialDetail>(
      this.url(`api/v1/admin/tutorials/${encodeURIComponent(id)}`),
      input,
    );
  }

  delete(id: Guid): Observable<void> {
    return this.http.delete<void>(this.url(`api/v1/admin/tutorials/${encodeURIComponent(id)}`));
  }

  publish(id: Guid): Observable<TutorialDetail> {
    return this.http.post<TutorialDetail>(
      this.url(`api/v1/admin/tutorials/${encodeURIComponent(id)}/publish`),
      null,
    );
  }

  feature(id: Guid): Observable<TutorialDetail> {
    return this.http.post<TutorialDetail>(
      this.url(`api/v1/admin/tutorials/${encodeURIComponent(id)}/feature`),
      null,
    );
  }

  setEditorsPick(id: Guid): Observable<TutorialDetail> {
    return this.http.post<TutorialDetail>(
      this.url(`api/v1/admin/tutorials/${encodeURIComponent(id)}/editors-pick`),
      null,
    );
  }

  replaceSteps(id: Guid, steps: TutorialStepUpsert[]): Observable<TutorialDetail> {
    return this.http.put<TutorialDetail>(
      this.url(`api/v1/admin/tutorials/${encodeURIComponent(id)}/steps`),
      steps,
    );
  }
}
