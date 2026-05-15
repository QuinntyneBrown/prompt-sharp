import { ChangeDetectionStrategy, Component, OnInit, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button, Checkbox, TextField } from 'components';
import { SessionExpiredDialog } from '../../dialogs/session-expired-dialog/session-expired-dialog';

@Component({
  selector: 'ps-sign-in-page',
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Checkbox, SessionExpiredDialog, TextField],
})
export class SignInPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly submitted = output<{ email: string; password: string }>();

  protected readonly email = signal<string>('');
  protected readonly password = signal<string>('');
  protected readonly rememberMe = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly sessionExpiredOpen = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.sessionExpiredOpen.set(params.get('reason') === 'expired');
    });
  }

  protected startProvider(provider: string): void {
    location.assign(`/auth/callback?provider=${encodeURIComponent(provider.toLowerCase())}`);
  }

  protected submitCredentials(): void {
    this.submitted.emit({ email: this.email(), password: this.password() });
    this.error.set('Invalid credentials. Use a configured OAuth provider to sign in.');
  }

  protected acknowledgeSessionExpired(): void {
    this.sessionExpiredOpen.set(false);
  }
}
