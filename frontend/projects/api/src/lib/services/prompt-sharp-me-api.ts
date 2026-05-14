import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bookmark } from '../models/bookmark';
import { Guid } from '../models/guid';
import { ProgressUpsert } from '../models/progress-upsert';
import { TutorialProgress } from '../models/tutorial-progress';
import { User } from '../models/user';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

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
