import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChipVariant } from './chip-variant';

@Component({
  selector: 'lib-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-selected]': 'selected() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class Chip {
  readonly variant = input<ChipVariant>('default');
  readonly selected = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly removable = input<boolean>(false);

  readonly removed = output<void>();

  protected onRemove(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled()) {
      return;
    }
    this.removed.emit();
  }
}
