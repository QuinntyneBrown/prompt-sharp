import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-marquee-strip',
  templateUrl: './marquee-strip.html',
  styleUrl: './marquee-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeStrip {
}
