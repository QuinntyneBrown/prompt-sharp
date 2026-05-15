import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-home-hero',
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHero {
}
