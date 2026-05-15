import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EyebrowTone } from './eyebrow-tone';

@Component({
  selector: 'lib-eyebrow',
  templateUrl: './eyebrow.html',
  styleUrl: './eyebrow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
  },
})
export class Eyebrow {
  readonly showDot = input<boolean>(false);
  readonly tone = input<EyebrowTone>('default');
  readonly icon = input<string | null>(null);
}
