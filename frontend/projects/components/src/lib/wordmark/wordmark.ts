import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WordmarkSize } from './wordmark-size';

@Component({
  selector: 'lib-wordmark',
  templateUrl: './wordmark.html',
  styleUrl: './wordmark.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class Wordmark {
  readonly size = input<WordmarkSize>('md');
}
