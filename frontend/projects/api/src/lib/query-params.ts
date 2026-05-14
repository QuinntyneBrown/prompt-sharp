import { HttpParams } from '@angular/common/http';

type QueryValue = string | number | boolean | null | undefined;

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
