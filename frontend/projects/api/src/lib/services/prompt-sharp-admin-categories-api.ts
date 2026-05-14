import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryUpsert } from '../models/category-upsert';
import { Guid } from '../models/guid';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminCategoriesApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url('api/v1/admin/categories'));
  }

  create(input: CategoryUpsert): Observable<Category> {
    return this.http.post<Category>(this.url('api/v1/admin/categories'), input);
  }

  update(id: Guid, input: CategoryUpsert): Observable<Category> {
    return this.http.put<Category>(this.url(`api/v1/admin/categories/${encodeURIComponent(id)}`), input);
  }

  delete(id: Guid): Observable<void> {
    return this.http.delete<void>(this.url(`api/v1/admin/categories/${encodeURIComponent(id)}`));
  }
}
