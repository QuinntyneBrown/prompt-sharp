import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SigninPageComponent } from 'components';

@Component({
  selector: 'lib-signin-page-container',
  standalone: true,
  imports: [SigninPageComponent],
  templateUrl: './signin-page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninPageContainerComponent {
  private readonly router = inject(Router);

  protected onMagicLink(_email: string): void {
    this.router.navigate(['/projects']);
  }

  protected onOAuth(_provider: 'google' | 'github'): void {
    this.router.navigate(['/projects']);
  }
}
