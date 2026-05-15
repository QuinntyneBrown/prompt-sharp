import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage {
}
