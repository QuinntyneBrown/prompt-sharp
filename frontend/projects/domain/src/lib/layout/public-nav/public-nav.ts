import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ps-public-nav',
  templateUrl: './public-nav.html',
  styleUrl: './public-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNav {
  private readonly router = inject(Router);

  readonly activeRoute = input<string | null>(null);
  readonly signedIn = input<boolean>(false);
  readonly signIn = output<void>();
  readonly signOut = output<void>();

  protected isActive(section: 'tutorials' | 'categories' | 'about'): boolean {
    const route = this.activeRoute();
    if (route) {
      return route === section || (section === 'tutorials' && route === 'catalog');
    }

    const url = this.router.url.split('?')[0] ?? '/';
    if (section === 'tutorials') {
      return url === '/' || url.startsWith('/tutorials') || url.startsWith('/search') || url.startsWith('/tags');
    }

    if (section === 'categories') {
      return url.startsWith('/categories');
    }

    return url.startsWith('/about');
  }
}
