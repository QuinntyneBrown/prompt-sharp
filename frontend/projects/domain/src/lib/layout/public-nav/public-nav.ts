import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, NavItem, Wordmark } from 'components';

@Component({
  selector: 'ps-public-nav',
  templateUrl: './public-nav.html',
  styleUrl: './public-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, NavItem, Wordmark],
})
export class PublicNav {
  readonly activeRoute = input<string | null>(null);
  readonly signedIn = input<boolean>(false);
  readonly signIn = output<void>();
  readonly signOut = output<void>();
}
