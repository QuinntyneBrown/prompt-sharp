import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'ps-sign-in-page',
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
  readonly submitted = output<{ email: string; password: string }>();

  protected readonly error = signal<string | null>(null);

  protected startProvider(provider: string): void {
    location.assign(`/auth/callback?provider=${encodeURIComponent(provider.toLowerCase())}`);
  }

  protected submitCredentials(email: string, password: string): void {
    this.submitted.emit({ email, password });
    this.error.set('Invalid credentials. Use a configured OAuth provider to sign in.');
  }
}
