import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonTile } from '../skeleton-tile/skeleton-tile';

@Component({
  selector: 'lib-thumbnail',
  templateUrl: './thumbnail.html',
  styleUrl: './thumbnail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonTile],
  host: {
    '[attr.data-selected]': 'selected() || null',
    '[style.aspect-ratio]': 'ratio()',
  },
})
export class Thumbnail {
  readonly src = input<string | null>(null);
  readonly alt = input<string>('');
  readonly ratio = input<string>('16 / 10');
  readonly selected = input<boolean>(false);
}
