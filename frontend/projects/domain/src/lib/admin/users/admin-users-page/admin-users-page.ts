import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { PromptSharpAdminUsersApi, RoleName, User, UserInvitation } from 'api';
import { Button, Checkbox, SearchField, SpinnerDot } from 'components';
import { UserInviteDialog } from '../../../dialogs/user-invite-dialog/user-invite-dialog';

@Component({
  selector: 'ps-admin-users-page',
  templateUrl: './admin-users-page.html',
  styleUrl: './admin-users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Checkbox, SearchField, SpinnerDot, UserInviteDialog],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminUsersPage implements OnInit {
  private readonly usersApi = inject(PromptSharpAdminUsersApi);

  protected readonly roles: readonly RoleName[] = ['Admin', 'Editor', 'User'];
  protected readonly users = signal<readonly User[]>([]);
  protected readonly invitations = signal<readonly UserInvitation[]>([]);
  protected readonly userSearch = signal<string>('');
  protected readonly inviteDialogOpen = signal<boolean>(false);
  protected readonly inviteError = signal<string | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly filteredUsers = computed(() => {
    const query = this.userSearch().trim().toLocaleLowerCase();
    if (!query) {
      return this.users();
    }

    return this.users().filter((user) =>
      user.email.toLocaleLowerCase().includes(query) ||
      user.displayName.toLocaleLowerCase().includes(query));
  });

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
    this.usersApi.invitations().subscribe({ next: (invitations) => this.invitations.set(invitations) });
  }

  protected searchUsers(query: string): void {
    this.userSearch.set(query);
  }

  protected hasRole(user: User, role: RoleName): boolean {
    return user.roles.includes(role);
  }

  protected setRole(user: User, role: RoleName, enabled: boolean): void {
    this.users.update((users) => users.map((item) => {
      if (item.id !== user.id) {
        return item;
      }

      const roles = enabled
        ? Array.from(new Set([...item.roles, role]))
        : item.roles.filter((existing) => existing !== role);
      return { ...item, roles };
    }));
  }

  protected saveRoles(user: User): void {
    const current = this.users().find((item) => item.id === user.id);
    if (!current) {
      return;
    }

    this.usersApi.updateRoles(current.id, { roles: current.roles }).subscribe({
      next: (updated) => {
        this.users.update((users) => users.map((item) => item.id === updated.id ? updated : item));
        this.status.set('Roles saved');
      },
      error: (e: Error) => this.error.set(e.message),
    });
  }

  protected openInviteDialog(): void {
    this.inviteError.set(null);
    this.inviteDialogOpen.set(true);
  }

  protected closeInviteDialog(): void {
    this.inviteDialogOpen.set(false);
    this.inviteError.set(null);
  }

  protected inviteUser(input: { email: string; roles: string[] }): void {
    const email = input.email.trim();
    if (!email) {
      this.inviteError.set('Email is required.');
      return;
    }

    this.usersApi.invite({ email, roles: ['User'] }).subscribe({
      next: (invitation) => {
        this.invitations.update((items) => [
          invitation,
          ...items.filter((item) => item.id !== invitation.id && item.email !== invitation.email),
        ]);
        this.status.set('Invite sent');
        this.closeInviteDialog();
      },
      error: (e: Error) => this.inviteError.set(e.message),
    });
  }
}
