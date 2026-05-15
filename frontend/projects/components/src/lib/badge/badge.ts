import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeSize } from './badge-size';
import { BadgeTone } from './badge-tone';

@Component({
  selector: 'lib-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
    '[attr.data-size]': 'size()',
  },
})
export class Badge {
  readonly tone = input<BadgeTone>('default');
  readonly size = input<BadgeSize>('md');
}
