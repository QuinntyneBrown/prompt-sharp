import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonCircleSize } from './skeleton-circle-size';

@Component({
  selector: 'lib-skeleton-circle',
  templateUrl: './skeleton-circle.html',
  styleUrl: './skeleton-circle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class SkeletonCircle {
  readonly size = input<SkeletonCircleSize>('md');
}
