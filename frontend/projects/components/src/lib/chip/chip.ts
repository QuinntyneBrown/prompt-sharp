import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ChipVariant = 'default' | 'accent';

@Component({
  selector: 'lib-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
  },
})
export class Chip {
  readonly variant = input<ChipVariant>('default');
}
