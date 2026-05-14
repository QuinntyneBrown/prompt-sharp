import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bookmark, Guid, ProgressUpsert, TutorialProgress, User } from './models';
import { PromptSharpApiEndpoint } from './http-utils';

@Injectable({ providedIn: 'root' })
export class PromptSharpMeApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  get(): Observable<User> {
    return this.http.get<User>(this.url('api/v1/me'));
  }

  bookmarks(): Observable<Bookmark[]> {
    return this.http.get<Bookmark[]>(this.url('api/v1/me/bookmarks'));
  }

  addBookmark(tutorialId: Guid): Observable<void> {
    return this.http.post<void>(
      this.url(`api/v1/me/bookmarks/${encodeURIComponent(tutorialId)}`),
      null,
    );
  }

  deleteBookmark(tutorialId: Guid): Observable<void> {
    return this.http.delete<void>(this.url(`api/v1/me/bookmarks/${encodeURIComponent(tutorialId)}`));
  }

  progress(tutorialId: Guid): Observable<TutorialProgress> {
    return this.http.get<TutorialProgress>(
      this.url(`api/v1/me/progress/${encodeURIComponent(tutorialId)}`),
    );
  }

  putProgress(tutorialId: Guid, input: ProgressUpsert): Observable<TutorialProgress> {
    return this.http.put<TutorialProgress>(
      this.url(`api/v1/me/progress/${encodeURIComponent(tutorialId)}`),
      input,
    );
  }
}
