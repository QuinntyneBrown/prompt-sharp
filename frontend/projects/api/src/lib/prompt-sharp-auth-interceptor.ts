import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { PROMPT_SHARP_ACCESS_TOKEN } from './prompt-sharp-access-token.token';
import { PromptSharpAccessTokenProvider } from './prompt-sharp-access-token-provider';
import { PROMPT_SHARP_API_BASE_URL } from './prompt-sharp-api-base-url.token';
import { PROMPT_SHARP_SKIP_AUTH } from './prompt-sharp-skip-auth.token';
import { ApiProblemDetails } from './models/api-problem-details';
import { ApiValidationProblemDetails } from './models/api-validation-problem-details';

let unauthorizedRedirectInProgress = false;

export const promptSharpAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const baseUrl = inject(PROMPT_SHARP_API_BASE_URL);
  const getAccessToken = request.context.get(PROMPT_SHARP_SKIP_AUTH)
    ? null
    : injectAccessTokenProvider();
  const accessToken = getAccessToken?.();

  if (
    !accessToken ||
    request.headers.has('Authorization') ||
    !isPromptSharpApiRequest(request.url, baseUrl)
  ) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const problem = getProblemDetails(error);

        if (error.status === 401 || problem?.status === 401) {
          redirectToExpiredSession();
        }
      }

      return throwError(() => error);
    }),
  );
};

function injectAccessTokenProvider(): PromptSharpAccessTokenProvider | null {
  return inject(PROMPT_SHARP_ACCESS_TOKEN);
}

function isPromptSharpApiRequest(url: string, baseUrl: string): boolean {
  const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, '');

  if (normalizedBaseUrl) {
    return url.startsWith(`${normalizedBaseUrl}/api/`);
  }

  return url.startsWith('/api/') || url.startsWith('api/');
}

function getProblemDetails(error: HttpErrorResponse): ApiProblemDetails | ApiValidationProblemDetails | null {
  const body = error.error;

  if (!isApiProblemDetails(body)) {
    return null;
  }

  return isApiValidationProblemDetails(body) ? body : body;
}

function isApiProblemDetails(body: unknown): body is ApiProblemDetails {
  return typeof body === 'object' && body !== null && 'title' in body && 'status' in body;
}

function isApiValidationProblemDetails(body: ApiProblemDetails): body is ApiValidationProblemDetails {
  return 'errors' in body;
}

function redirectToExpiredSession(): void {
  if (unauthorizedRedirectInProgress) {
    return;
  }

  unauthorizedRedirectInProgress = true;

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('prompt-sharp.access-token');
  }

  if (typeof location === 'undefined' || location.pathname === '/sign-in') {
    return;
  }

  const returnUrl = `${location.pathname}${location.search}${location.hash}` || '/';
  location.assign(`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}&reason=expired`);
}
