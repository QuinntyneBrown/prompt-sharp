import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TextFieldType } from './text-field-type';

@Component({
  selector: 'lib-text-field',
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-error]': 'error() ? "true" : null',
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class TextField {
  readonly label = input<string | null>(null);
  readonly value = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<TextFieldType>('text');
  readonly prefix = input<string | null>(null);
  readonly suffix = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);

  readonly valueChange = output<string>();

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
