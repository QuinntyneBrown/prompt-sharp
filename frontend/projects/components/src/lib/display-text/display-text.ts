import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DisplayTextLevel } from './display-text-level';
import { DisplayTextTone } from './display-text-tone';

@Component({
  selector: 'lib-display-text',
  templateUrl: './display-text.html',
  styleUrl: './display-text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-level]': 'level()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-italic-accent]': 'italicAccent() || null',
  },
})
export class DisplayText {
  readonly level = input<DisplayTextLevel>('1');
  readonly tone = input<DisplayTextTone>('default');
  readonly italicAccent = input<boolean>(false);
}
