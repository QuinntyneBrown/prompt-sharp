import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-about-hero',
  templateUrl: './about-hero.html',
  styleUrl: './about-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutHero {
}
