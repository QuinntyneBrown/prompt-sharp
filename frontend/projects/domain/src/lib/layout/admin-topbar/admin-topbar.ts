import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-admin-topbar',
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTopbar {
  readonly currentUserName = input<string | null>(null);
  readonly signOut = output<void>();
}
