import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TextField } from 'components';

@Component({
  selector: 'ps-sign-in-field-row',
  templateUrl: './sign-in-field-row.html',
  styleUrl: './sign-in-field-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextField],
})
export class SignInFieldRow {
  readonly label = input.required<string>();
  readonly kind = input<'text' | 'password' | null>(null);
  readonly value = input<string>('');
  readonly valueChange = output<string>();
}
