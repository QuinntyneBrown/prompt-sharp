import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-admin-nav-rail',
  templateUrl: './admin-nav-rail.html',
  styleUrl: './admin-nav-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavRail {
  readonly collapsed = input<boolean>(false);
  readonly activeRoute = input<string | null>(null);
  readonly collapseToggled = output<void>();
}
