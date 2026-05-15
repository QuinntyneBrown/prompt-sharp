import { ChangeDetectionStrategy, Component, OnInit, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ps-oauth-callback-page',
  templateUrl: './oauth-callback-page.html',
  styleUrl: './oauth-callback-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthCallbackPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly completed = output<void>();
  protected readonly error = signal<string | null>(null);
  protected readonly provider = signal<string>('Microsoft');
  protected readonly returnUrl = signal<string>('/admin');

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    const description = this.route.snapshot.queryParamMap.get('error_description');
    const provider = this.route.snapshot.queryParamMap.get('provider');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.provider.set(formatProvider(provider ?? 'microsoft'));
    this.returnUrl.set(returnUrl ?? '/admin');
    if (error) {
      this.error.set(`Sign in failed: ${description || error}`);
    }
  }
}

function formatProvider(value: string): string {
  return value.length === 0 ? 'Microsoft' : value[0].toUpperCase() + value.slice(1).toLowerCase();
}
