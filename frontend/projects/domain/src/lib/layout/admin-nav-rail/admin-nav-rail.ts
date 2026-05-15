import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconButton, NavItem, Wordmark } from 'components';

@Component({
  selector: 'ps-admin-nav-rail',
  templateUrl: './admin-nav-rail.html',
  styleUrl: './admin-nav-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton, NavItem, Wordmark],
})
export class AdminNavRail {
  readonly collapsed = input<boolean>(false);
  readonly activeRoute = input<string | null>(null);
  readonly collapseToggled = output<void>();
}
