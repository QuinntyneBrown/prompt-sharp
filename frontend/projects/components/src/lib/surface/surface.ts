import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SurfacePadding } from './surface-padding';
import { SurfaceRadius } from './surface-radius';
import { SurfaceTone } from './surface-tone';

@Component({
  selector: 'lib-surface',
  templateUrl: './surface.html',
  styleUrl: './surface.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-padding]': 'padding()',
    '[attr.data-bordered]': 'bordered() || null',
  },
})
export class Surface {
  readonly tone = input<SurfaceTone>('surface');
  readonly radius = input<SurfaceRadius>('none');
  readonly padding = input<SurfacePadding>('md');
  readonly bordered = input<boolean>(true);
}
