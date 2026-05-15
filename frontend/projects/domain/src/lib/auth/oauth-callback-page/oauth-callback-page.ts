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

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    const description = this.route.snapshot.queryParamMap.get('error_description');
    if (error) {
      this.error.set(`Sign in failed: ${description || error}`);
    }
  }
}
