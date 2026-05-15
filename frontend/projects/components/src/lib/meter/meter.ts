import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MeterTone } from './meter-tone';

@Component({
  selector: 'lib-meter',
  templateUrl: './meter.html',
  styleUrl: './meter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
    '[attr.data-indeterminate]': 'indeterminate() || null',
    role: 'progressbar',
    '[attr.aria-label]': 'label()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'indeterminate() ? null : value()',
  },
})
export class Meter {
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly tone = input<MeterTone>('default');
  readonly label = input<string | null>(null);
  readonly indeterminate = input<boolean>(false);

  protected readonly percent = computed(() => {
    if (this.indeterminate()) return 50;
    const max = this.max() || 1;
    return Math.max(0, Math.min(100, (this.value() / max) * 100));
  });
}
