import { InjectionToken } from '@angular/core';

export const PROMPT_SHARP_API_BASE_URL = new InjectionToken<string>(
  'PROMPT_SHARP_API_BASE_URL',
  {
    providedIn: 'root',
    factory: () => '',
  },
);
