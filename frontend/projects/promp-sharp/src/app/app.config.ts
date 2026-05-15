import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePromptSharpApi } from 'api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePromptSharpApi({
      baseUrl: promptSharpApiBaseUrl(),
      accessToken: promptSharpAccessToken,
    }),
  ],
};

function promptSharpApiBaseUrl(): string {
  if (typeof location === 'undefined') {
    return '';
  }

  return ['localhost', '127.0.0.1'].includes(location.hostname) ? 'http://127.0.0.1:5000' : '';
}

function promptSharpAccessToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem('prompt-sharp.access-token');
}
