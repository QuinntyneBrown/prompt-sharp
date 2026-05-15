import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BannerTone } from './banner-tone';

@Component({
  selector: 'lib-banner',
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
  },
})
export class Banner {
  readonly tone = input<BannerTone>('default');
  readonly icon = input<string | null>(null);
}
