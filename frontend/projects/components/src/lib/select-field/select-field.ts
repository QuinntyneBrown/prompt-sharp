import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SelectFieldOption } from './select-field-option';

@Component({
  selector: 'lib-select-field',
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-error]': 'error() ? "true" : null',
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class SelectField {
  readonly label = input<string | null>(null);
  readonly value = input<string>('');
  readonly options = input.required<SelectFieldOption[]>();
  readonly name = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly placeholder = input<string | null>(null);

  readonly valueChange = output<string>();

  protected onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}
