import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar, Button, IconButton, StatusDot } from 'components';

@Component({
  selector: 'ps-admin-topbar',
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Button, IconButton, StatusDot],
})
export class AdminTopbar {
  readonly currentUserName = input<string | null>(null);
  readonly signOut = output<void>();
}
