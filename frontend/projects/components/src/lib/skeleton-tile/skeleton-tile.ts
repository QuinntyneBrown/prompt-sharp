import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-skeleton-tile',
  templateUrl: './skeleton-tile.html',
  styleUrl: './skeleton-tile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.aspect-ratio]': 'aspectRatio()',
  },
})
export class SkeletonTile {
  readonly aspectRatio = input<string>('4 / 3');
}
