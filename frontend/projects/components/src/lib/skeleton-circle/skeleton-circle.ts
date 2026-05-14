import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'lib-skeleton-circle',
  templateUrl: './skeleton-circle.html',
  styleUrl: './skeleton-circle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width.px]': 'size()',
  },
})
export class SkeletonCircle {
  readonly size = input<number>(40);
}
