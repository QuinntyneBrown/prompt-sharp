import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactSubmission } from '../models/contact-submission';
import { ContactSubmissionInput } from '../models/contact-submission-input';
import { PromptSharpApiEndpoint } from '../prompt-sharp-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PromptSharpContactApi extends PromptSharpApiEndpoint {
  private readonly http = inject(HttpClient);

  submit(input: ContactSubmissionInput): Observable<ContactSubmission> {
    return this.http.post<ContactSubmission>(this.url('api/v1/contact-submissions'), input);
  }
}
