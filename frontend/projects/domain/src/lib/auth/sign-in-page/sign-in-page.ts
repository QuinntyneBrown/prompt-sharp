import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-sign-in-page',
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
  readonly submitted = output<{ email: string; password: string }>();
}
