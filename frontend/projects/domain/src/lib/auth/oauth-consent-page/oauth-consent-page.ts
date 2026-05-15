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
    { label: 'Profile', description: 'Read your name and account identifier.' },
    { label: 'Email', description: 'Use your verified email for your Prompt/Sharp profile.' },
    { label: 'Offline access', description: 'Keep you signed in on this device when allowed by the provider.' },
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
