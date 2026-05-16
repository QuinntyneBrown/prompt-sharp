import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from 'api';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterThinComponent } from '../footer-thin/footer-thin.component';

@Component({
  selector: 'lib-account-page',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterThinComponent],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPageComponent {
  readonly user = input.required<User>();

  readonly editNameClicked = output<void>();
  readonly changeEmailClicked = output<void>();
  readonly upgradeClicked = output<void>();
  readonly signOutClicked = output<void>();
  readonly deleteAccountClicked = output<void>();

  protected readonly sessionLabel = computed(
    () => `${this.user().session.lastSignInLabel} · ${this.user().session.device}`
  );
}
