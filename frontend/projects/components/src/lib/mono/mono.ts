import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MonoSize } from './mono-size';
import { MonoTone } from './mono-tone';

@Component({
  selector: 'lib-mono',
  templateUrl: './mono.html',
  styleUrl: './mono.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'tone()',
  },
})
export class Mono {
  readonly size = input<MonoSize>('md');
  readonly tone = input<MonoTone>('default');
}
