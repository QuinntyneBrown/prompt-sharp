import {
  HttpContextToken,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders } from '@angular/core';

export type PromptSharpAccessTokenProvider = () => string | null | undefined;

export interface PromptSharpApiConfig {
  baseUrl?: string;
  accessToken?: PromptSharpAccessTokenProvider;
}

export const PROMPT_SHARP_API_BASE_URL = new InjectionToken<string>(
  'PROMPT_SHARP_API_BASE_URL',
  {
    providedIn: 'root',
    factory: () => '',
  },
);

export const PROMPT_SHARP_ACCESS_TOKEN = new InjectionToken<PromptSharpAccessTokenProvider | null>(
  'PROMPT_SHARP_ACCESS_TOKEN',
  {
    providedIn: 'root',
    factory: () => null,
  },
);

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

export const PROMPT_SHARP_SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export function providePromptSharpApi(config: PromptSharpApiConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors([promptSharpAuthInterceptor])),
    {
      provide: PROMPT_SHARP_API_BASE_URL,
      useValue: config.baseUrl ?? '',
    },
    {
      provide: PROMPT_SHARP_ACCESS_TOKEN,
      useValue: config.accessToken ?? null,
    },
  ]);
}

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
