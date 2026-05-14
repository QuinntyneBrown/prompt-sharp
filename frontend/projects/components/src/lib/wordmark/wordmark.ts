import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type WordmarkSize = 'sm' | 'md' | 'lg' | 'xl';

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
