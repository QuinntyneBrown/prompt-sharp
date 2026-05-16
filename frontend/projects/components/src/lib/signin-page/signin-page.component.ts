import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavCenterComponent } from '../nav-center/nav-center.component';
import { FooterThinComponent } from '../footer-thin/footer-thin.component';

@Component({
  selector: 'lib-signin-page',
  standalone: true,
  imports: [FormsModule, NavCenterComponent, FooterThinComponent],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninPageComponent {
  readonly magicLinkRequested = output<string>();
  readonly oauthClicked = output<'google' | 'github'>();

  protected readonly email = signal('');

  protected onSubmit(): void {
    const value = this.email().trim();
    if (value.length === 0) return;
    this.magicLinkRequested.emit(value);
  }
}
