import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-sign-in-field-row',
  templateUrl: './sign-in-field-row.html',
  styleUrl: './sign-in-field-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFieldRow {
  readonly label = input.required<string>();
  readonly kind = input<'text' | 'password' | null>(null);
}
