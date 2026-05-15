import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-text-area',
  templateUrl: './text-area.html',
  styleUrl: './text-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-error]': 'error() ? "true" : null',
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class TextArea {
  readonly label = input<string | null>(null);
  readonly value = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(4);
  readonly name = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);

  readonly valueChange = output<string>();

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }
}
