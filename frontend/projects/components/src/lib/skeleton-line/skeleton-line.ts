import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonDelay } from './skeleton-delay';
import { SkeletonLineSize } from './skeleton-line-size';
import { SkeletonTone } from './skeleton-tone';

@Component({
  selector: 'lib-skeleton-line',
  templateUrl: './skeleton-line.html',
  styleUrl: './skeleton-line.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-delay]': 'delay()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-rounded]': 'rounded() || null',
    '[attr.data-inline]': 'inline() || null',
    '[style.width]': 'widthValue()',
  },
})
export class SkeletonLine {
  readonly size = input<SkeletonLineSize>('md');
  readonly width = input<number | string | null>(null);
  readonly delay = input<SkeletonDelay>(0);
  readonly tone = input<SkeletonTone>('default');
  readonly rounded = input<boolean>(false);
  readonly inline = input<boolean>(false);

  protected readonly widthValue = computed(() => {
    const w = this.width();
    if (w == null) return null;
    return typeof w === 'number' ? `${w}%` : w;
  });
}
