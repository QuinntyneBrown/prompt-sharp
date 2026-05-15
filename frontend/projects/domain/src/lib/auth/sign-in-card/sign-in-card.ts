import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-sign-in-card',
  templateUrl: './sign-in-card.html',
  styleUrl: './sign-in-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInCard {
}
