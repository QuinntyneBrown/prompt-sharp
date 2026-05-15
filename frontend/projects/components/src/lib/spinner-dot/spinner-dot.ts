import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpinnerDotSize } from './spinner-dot-size';
import { SpinnerDotTone } from './spinner-dot-tone';

@Component({
  selector: 'lib-spinner-dot',
  templateUrl: './spinner-dot.html',
  styleUrl: './spinner-dot.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'tone()',
    role: 'status',
    '[attr.aria-label]': 'label()',
  },
})
export class SpinnerDot {
  readonly size = input<SpinnerDotSize>('md');
  readonly tone = input<SpinnerDotTone>('default');
  readonly label = input<string>('Loading');
}
