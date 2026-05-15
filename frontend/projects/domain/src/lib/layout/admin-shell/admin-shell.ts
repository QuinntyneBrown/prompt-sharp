import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminNavRail } from '../admin-nav-rail/admin-nav-rail';
import { AdminTopbar } from '../admin-topbar/admin-topbar';

@Component({
  selector: 'ps-admin-shell',
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AdminNavRail, AdminTopbar],
})
export class AdminShell {
  private readonly router = inject(Router);

  protected navigateWithinAdmin(event: MouseEvent): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest<HTMLAnchorElement>('a[href]');
    if (!anchor || (anchor.target && anchor.target !== '_self')) {
      return;
    }

    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin) {
      return;
    }

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    if (!nextUrl.startsWith('/admin')) {
      return;
    }

    event.preventDefault();
    void this.router.navigateByUrl(nextUrl);
  }
}
