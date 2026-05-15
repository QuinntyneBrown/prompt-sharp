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

  constructor() {
    this.syncShellFlags();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.syncShellFlags());
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
}
