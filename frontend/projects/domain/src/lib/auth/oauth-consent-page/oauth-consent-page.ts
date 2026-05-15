import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-oauth-consent-page',
  templateUrl: './oauth-consent-page.html',
  styleUrl: './oauth-consent-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class OauthConsentPage {
  readonly approved = output<void>();
  readonly denied = output<void>();

  protected readonly status = signal<string | null>(null);
  protected readonly scopes = [
    { label: 'User.Read', description: 'Read your profile' },
    { label: 'Mail.Read', description: 'Read your email' },
    { label: 'openid profile', description: 'Sign in and read your profile' },
  ];

  protected allow(): void {
    this.status.set('Consent approved');
    this.approved.emit();
  }

  protected deny(): void {
    this.status.set('Consent denied');
    this.denied.emit();
  }
}
