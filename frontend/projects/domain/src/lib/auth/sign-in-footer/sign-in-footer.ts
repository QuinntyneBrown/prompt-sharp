import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-sign-in-footer',
  templateUrl: './sign-in-footer.html',
  styleUrl: './sign-in-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFooter {
}
