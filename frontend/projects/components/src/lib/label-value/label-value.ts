import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LabelValueOrientation } from './label-value-orientation';

@Component({
  selector: 'lib-label-value',
  templateUrl: './label-value.html',
  styleUrl: './label-value.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-orientation]': 'orientation()',
  },
})
export class LabelValue {
  readonly label = input.required<string>();
  readonly value = input<string | number | null>(null);
  readonly orientation = input<LabelValueOrientation>('horizontal');
}
