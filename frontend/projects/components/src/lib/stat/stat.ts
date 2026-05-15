import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatTone } from './stat-tone';
import { StatTrend } from './stat-trend';

@Component({
  selector: 'lib-stat',
  templateUrl: './stat.html',
  styleUrl: './stat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
    '[attr.data-trend]': 'trend()',
  },
})
export class Stat {
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
  readonly supportingLabel = input<string | null>(null);
  readonly trend = input<StatTrend>('flat');
  readonly tone = input<StatTone>('default');
}
