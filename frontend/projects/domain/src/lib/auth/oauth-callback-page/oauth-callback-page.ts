import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-oauth-callback-page',
  templateUrl: './oauth-callback-page.html',
  styleUrl: './oauth-callback-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthCallbackPage {
  readonly completed = output<void>();
}
