import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonRadius } from './skeleton-radius';

@Component({
  selector: 'lib-skeleton-tile',
  templateUrl: './skeleton-tile.html',
  styleUrl: './skeleton-tile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-radius]': 'radius()',
    '[style.aspect-ratio]': 'aspectRatio()',
  },
})
export class SkeletonTile {
  readonly aspectRatio = input<string>('4 / 3');
  readonly radius = input<SkeletonRadius>('none');
}
