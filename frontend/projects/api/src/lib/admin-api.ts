import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminTutorialListQuery,
  Category,
  CategoryUpsert,
  Guid,
  Media,
  PagedResult,
  Tag,
  TagUpsert,
  TutorialDetail,
  TutorialListItem,
  TutorialStepUpsert,
  TutorialUpsert,
  User,
  UserRolesUpsert,
} from './models';
import { PromptSharpApiEndpoint, queryParams } from './http-utils';

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

@Injectable({ providedIn: 'root' })
export class PromptSharpAdminUsersApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.url('api/v1/admin/users'));
  }

  updateRoles(id: Guid, input: UserRolesUpsert): Observable<User> {
    return this.http.put<User>(this.url(`api/v1/admin/users/${encodeURIComponent(id)}/roles`), input);
  }
}
