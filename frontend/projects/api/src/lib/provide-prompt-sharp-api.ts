import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { PROMPT_SHARP_ACCESS_TOKEN } from './prompt-sharp-access-token.token';
import { PROMPT_SHARP_API_BASE_URL } from './prompt-sharp-api-base-url.token';
import { PromptSharpApiConfig } from './prompt-sharp-api-config';
import { promptSharpAuthInterceptor } from './prompt-sharp-auth-interceptor';

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
