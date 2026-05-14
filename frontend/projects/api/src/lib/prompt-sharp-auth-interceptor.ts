import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PROMPT_SHARP_ACCESS_TOKEN } from './prompt-sharp-access-token.token';
import { PromptSharpAccessTokenProvider } from './prompt-sharp-access-token-provider';
import { PROMPT_SHARP_API_BASE_URL } from './prompt-sharp-api-base-url.token';
import { PROMPT_SHARP_SKIP_AUTH } from './prompt-sharp-skip-auth.token';

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
