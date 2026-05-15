import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-oauth-consent-card',
  templateUrl: './oauth-consent-card.html',
  styleUrl: './oauth-consent-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthConsentCard {
}
