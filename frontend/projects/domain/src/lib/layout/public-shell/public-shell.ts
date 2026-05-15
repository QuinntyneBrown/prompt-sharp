import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { PublicNav } from '../public-nav/public-nav';
import { PublicFooter } from '../public-footer/public-footer';

@Component({
  selector: 'ps-public-shell',
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, PublicNav, PublicFooter],
})
export class PublicShell {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly minimalShell = signal(false);
  protected readonly hideFooter = signal(false);
  protected readonly signedIn = signal(false);

  constructor() {
    this.syncShellFlags();
    this.syncSignedIn();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.syncShellFlags();
        this.syncSignedIn();
      });
  }

  protected signOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('prompt-sharp.access-token');
    }

    this.signedIn.set(false);
    void this.router.navigateByUrl('/sign-in');
  }

  private syncShellFlags(): void {
    let active = this.route.firstChild;
    while (active?.firstChild) {
      active = active.firstChild;
    }

    const data = active?.snapshot?.data ?? {};
    const minimalShell = data['minimalShell'] === true;
    this.minimalShell.set(minimalShell);
    this.hideFooter.set(minimalShell || data['hideFooter'] === true);
  }

  private syncSignedIn(): void {
    if (typeof localStorage === 'undefined') {
      this.signedIn.set(false);
      return;
    }

    const token = localStorage.getItem('prompt-sharp.access-token');
    this.signedIn.set(token !== null && !this.isExpired(token));
  }

  private isExpired(token: string): boolean {
    const [, payload] = token.split('.');
    if (!payload) {
      return true;
    }

    try {
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const parsed = JSON.parse(atob(padded)) as { exp?: unknown };
      return typeof parsed.exp === 'number' && parsed.exp <= Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }
}
