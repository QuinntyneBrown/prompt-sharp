import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-public-nav',
  templateUrl: './public-nav.html',
  styleUrl: './public-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNav {
  readonly activeRoute = input<string | null>(null);
  readonly signedIn = input<boolean>(false);
  readonly signIn = output<void>();
  readonly signOut = output<void>();
}
