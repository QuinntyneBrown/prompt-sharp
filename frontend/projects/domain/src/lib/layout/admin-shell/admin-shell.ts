import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavRail } from '../admin-nav-rail/admin-nav-rail';
import { AdminTopbar } from '../admin-topbar/admin-topbar';

@Component({
  selector: 'ps-admin-shell',
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AdminNavRail, AdminTopbar],
})
export class AdminShell {}
