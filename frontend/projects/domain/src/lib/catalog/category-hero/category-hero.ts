import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-category-hero',
  templateUrl: './category-hero.html',
  styleUrl: './category-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryHero {
}
