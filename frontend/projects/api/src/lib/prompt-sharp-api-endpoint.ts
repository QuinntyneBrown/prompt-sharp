import { inject } from '@angular/core';
import { PROMPT_SHARP_API_BASE_URL } from './prompt-sharp-api-base-url.token';

export abstract class PromptSharpApiEndpoint {
  private readonly baseUrl = normalizeBaseUrl(inject(PROMPT_SHARP_API_BASE_URL));

  protected url(path: string): string {
    const normalizedPath = path.replace(/^\/+/, '');
    return this.baseUrl ? `${this.baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, '');
}
