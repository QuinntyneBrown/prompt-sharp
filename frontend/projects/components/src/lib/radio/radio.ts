import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-radio',
  templateUrl: './radio.html',
  styleUrl: './radio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class Radio {
  readonly checked = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly name = input.required<string>();
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly checkedChange = output<string>();

  protected onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) this.checkedChange.emit(this.value());
  }
}
