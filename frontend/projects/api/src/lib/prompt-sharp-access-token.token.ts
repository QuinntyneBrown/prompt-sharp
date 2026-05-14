import { InjectionToken } from '@angular/core';
import { PromptSharpAccessTokenProvider } from './prompt-sharp-access-token-provider';

export const PROMPT_SHARP_ACCESS_TOKEN = new InjectionToken<PromptSharpAccessTokenProvider | null>(
  'PROMPT_SHARP_ACCESS_TOKEN',
  {
    providedIn: 'root',
    factory: () => null,
  },
);
