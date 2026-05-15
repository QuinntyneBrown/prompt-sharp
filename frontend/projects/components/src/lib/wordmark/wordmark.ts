import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WordmarkSize } from './wordmark-size';
import { WordmarkVariant } from './wordmark-variant';

@Component({
  selector: 'lib-wordmark',
  templateUrl: './wordmark.html',
  styleUrl: './wordmark.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    role: 'img',
    '[attr.aria-label]': '"Prompt/Sharp"',
  },
})
export class Wordmark {
  readonly size = input<WordmarkSize>('md');
  readonly variant = input<WordmarkVariant>('inline');
}
