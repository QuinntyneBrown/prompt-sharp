import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button, DisplayText } from 'components';

@Component({
  selector: 'ps-sign-in-card',
  templateUrl: './sign-in-card.html',
  styleUrl: './sign-in-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DisplayText],
})
export class SignInCard {
  readonly submitted = output<void>();
}
