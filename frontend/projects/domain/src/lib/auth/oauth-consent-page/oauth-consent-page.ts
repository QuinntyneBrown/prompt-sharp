import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-oauth-consent-page',
  templateUrl: './oauth-consent-page.html',
  styleUrl: './oauth-consent-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthConsentPage {
  readonly approved = output<void>();
  readonly denied = output<void>();
}
