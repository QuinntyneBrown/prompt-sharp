import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PromptSharpAdminUsersApi, User } from 'api';

@Component({
  selector: 'ps-admin-users-page',
  templateUrl: './admin-users-page.html',
  styleUrl: './admin-users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPage implements OnInit {
  private readonly usersApi = inject(PromptSharpAdminUsersApi);

  protected readonly users = signal<readonly User[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usersApi.list().subscribe({
      next: (u) => {
        this.users.set(u);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
