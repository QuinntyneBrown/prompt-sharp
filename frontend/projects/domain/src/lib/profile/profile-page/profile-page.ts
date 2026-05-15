import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Bookmark, PromptSharpMeApi, User } from 'api';
import { Button, SpinnerDot } from 'components';
import { SignOutDialog } from '../../dialogs/sign-out-dialog/sign-out-dialog';

@Component({
  selector: 'ps-profile-page',
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, SignOutDialog, SpinnerDot],
})
export class ProfilePage implements OnInit {
  private readonly meApi = inject(PromptSharpMeApi);

  protected readonly user = signal<User | null>(null);
  protected readonly bookmarks = signal<readonly Bookmark[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly signOutDialogOpen = signal(false);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.meApi.get().subscribe({
      next: (u) => {
        this.user.set(u);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
    this.meApi.bookmarks().subscribe({ next: (b) => this.bookmarks.set(b) });
  }

  protected signOut(): void {
    this.signOutDialogOpen.set(true);
  }

  protected cancelSignOut(): void {
    this.signOutDialogOpen.set(false);
  }

  protected confirmSignOut(): void {
    localStorage.removeItem('prompt-sharp.access-token');
    location.assign('/sign-in');
  }
}
