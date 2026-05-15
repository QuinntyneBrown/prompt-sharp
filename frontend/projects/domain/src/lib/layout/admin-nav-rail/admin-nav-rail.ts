import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

type AdminNavItem = {
  icon: string;
  label: string;
  route: string;
  match: 'exact' | 'prefix';
  badge?: string;
  aliases?: readonly string[];
};

@Component({
  selector: 'ps-admin-nav-rail',
  templateUrl: './admin-nav-rail.html',
  styleUrl: './admin-nav-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavRail {
  private readonly router = inject(Router);

  readonly collapsed = input<boolean>(false);
  readonly activeRoute = input<string | null>(null);
  readonly collapseToggled = output<void>();
  readonly signOut = output<void>();

  protected readonly primaryItems: readonly AdminNavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin', match: 'exact' },
    { icon: 'menu_book', label: 'Tutorials', route: '/admin/tutorials', match: 'prefix', badge: '12' },
    { icon: 'category', label: 'Categories', route: '/admin/categories', match: 'prefix', aliases: ['/admin/taxonomy'] },
    { icon: 'image', label: 'Media', route: '/admin/media', match: 'prefix' },
    { icon: 'group', label: 'Users', route: '/admin/users', match: 'prefix' },
  ];

  protected readonly systemItems: readonly AdminNavItem[] = [
    { icon: 'manage_search', label: 'Audit log', route: '/admin/audit-log', match: 'prefix', aliases: ['/admin/audit'] },
    { icon: 'notifications', label: 'Notifications', route: '/admin/notifications', match: 'prefix' },
  ];

  protected isActive(item: AdminNavItem): boolean {
    const url = this.router.url.split('?')[0] || '/admin';
    const routes = [item.route, ...(item.aliases ?? [])];
    return routes.some((route) => (item.match === 'exact' ? url === route : url === route || url.startsWith(`${route}/`)));
  }
}
