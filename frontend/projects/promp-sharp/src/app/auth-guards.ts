import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router, UrlTree } from '@angular/router';
import { AdminTutorialEditorPage } from 'domain';

type JwtPayload = {
  exp?: number;
  role?: string | string[];
  roles?: string | string[];
  [claim: string]: unknown;
};

export const requireUser: CanActivateFn = (_route, state) => authorize(state.url);

export const requireAdmin: CanActivateFn = (_route, state) => authorize(state.url, ['Admin']);

export const confirmTutorialEditorNavigation: CanDeactivateFn<AdminTutorialEditorPage> = (
  component,
  _currentRoute,
  _currentState,
  nextState,
) => component.canDeactivate(nextState?.url ?? '/admin/tutorials');

function authorize(returnUrl: string, requiredRoles: readonly string[] = []): boolean | UrlTree {
  const router = inject(Router);
  const token = readToken();
  const payload = token === null ? null : decodePayload(token);
  const tokenIsInvalidOrExpired = token !== null && (payload === null || isExpired(payload));

  if (payload === null || tokenIsInvalidOrExpired) {
    removeToken();
    return router.createUrlTree(['/sign-in'], {
      queryParams: tokenIsInvalidOrExpired ? { returnUrl, reason: 'expired' } : { returnUrl },
    });
  }

  if (requiredRoles.length > 0 && !hasRequiredRole(payload, requiredRoles)) {
    return router.createUrlTree(['/access-denied'], {
      queryParams: { required: requiredRoles.join(',') },
    });
  }

  return true;
}

function readToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem('prompt-sharp.access-token');
}

function removeToken(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('prompt-sharp.access-token');
  }
}

function decodePayload(token: string): JwtPayload | null {
  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

function isExpired(payload: JwtPayload): boolean {
  return typeof payload.exp === 'number' && payload.exp <= Math.floor(Date.now() / 1000);
}

function hasRequiredRole(payload: JwtPayload, requiredRoles: readonly string[]): boolean {
  const roles = extractRoles(payload);
  return requiredRoles.some((role) => roles.includes(role));
}

function extractRoles(payload: JwtPayload): string[] {
  const roleClaim =
    payload.role ??
    payload.roles ??
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  if (Array.isArray(roleClaim)) {
    return roleClaim.filter((role): role is string => typeof role === 'string');
  }

  return typeof roleClaim === 'string' ? [roleClaim] : [];
}
