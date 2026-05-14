import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonDelay } from './skeleton-delay';
import { SkeletonLineSize } from './skeleton-line-size';

@Component({
  selector: 'lib-skeleton-line',
  templateUrl: './skeleton-line.html',
  styleUrl: './skeleton-line.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-delay]': 'delay()',
    '[style.width]': 'widthValue()',
  },
})
export class SkeletonLine {
  readonly size = input<SkeletonLineSize>('md');
  readonly width = input<number | null>(null);
  readonly delay = input<SkeletonDelay>(0);

  protected readonly widthValue = computed(() => {
    const w = this.width();
    return w == null ? null : `${w}%`;
  });
}
