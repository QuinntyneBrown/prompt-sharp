import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PromptSharpAdminTutorialsApi, TutorialListItem } from 'api';

@Component({
  selector: 'ps-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage implements OnInit {
  private readonly tutorialsApi = inject(PromptSharpAdminTutorialsApi);

  protected readonly tutorials = signal<readonly TutorialListItem[]>([]);

  ngOnInit(): void {
    this.tutorialsApi.list({ page: 1, pageSize: 5 }).subscribe({
      next: (page) => this.tutorials.set(page.items),
    });
  }

  protected createTutorial(): void {
    location.assign('/admin/tutorials/new');
  }
}
