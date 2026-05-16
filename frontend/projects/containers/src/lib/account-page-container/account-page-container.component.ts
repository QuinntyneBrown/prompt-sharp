import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountPageComponent } from 'components';
import { AuthService } from 'api';

@Component({
  selector: 'lib-account-page-container',
  standalone: true,
  imports: [AccountPageComponent],
  templateUrl: './account-page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPageContainerComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.currentUser;

  protected onSignOut(): void {
    this.auth.signOut();
    this.router.navigate(['/signin']);
  }

  protected onUpgrade(): void { /* placeholder */ }
  protected onEditName(): void { /* placeholder */ }
  protected onChangeEmail(): void { /* placeholder */ }
  protected onDeleteAccount(): void { /* placeholder */ }
}
