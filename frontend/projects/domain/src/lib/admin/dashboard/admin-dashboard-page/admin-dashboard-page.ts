import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AdminDashboard, PromptSharpAdminDashboardApi } from 'api';
import { Button } from 'components';

@Component({
  selector: 'ps-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
})
export class AdminDashboardPage implements OnInit {
  private readonly dashboardApi = inject(PromptSharpAdminDashboardApi);

  protected readonly dashboard = signal<AdminDashboard | null>(null);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.dashboardApi.get().subscribe({
      next: (summary) => {
        this.dashboard.set(summary);
        this.error.set('');
      },
      error: () => this.error.set('Dashboard summary could not be loaded.'),
    });
  }

  protected createTutorial(): void {
    location.assign('/admin/tutorials/new');
  }
}
