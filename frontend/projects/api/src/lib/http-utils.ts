import { HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { PROMPT_SHARP_API_BASE_URL } from './api-configuration';

type QueryValue = string | number | boolean | null | undefined;

export abstract class PromptSharpApiEndpoint {
  private readonly baseUrl = normalizeBaseUrl(inject(PROMPT_SHARP_API_BASE_URL));

  protected url(path: string): string {
    const normalizedPath = path.replace(/^\/+/, '');
    return this.baseUrl ? `${this.baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
  }
}

export function queryParams(values: object): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(values) as [string, QueryValue][]) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    params = params.set(key, String(value));
  }

  return params;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, '');
}
