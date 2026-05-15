import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-switch',
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-checked]': 'checked() || null',
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class Switch {
  readonly checked = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly name = input<string | null>(null);

  readonly checkedChange = output<boolean>();

  protected onToggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
