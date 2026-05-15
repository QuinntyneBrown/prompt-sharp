import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-tutorial-hero',
  templateUrl: './tutorial-hero.html',
  styleUrl: './tutorial-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialHero {
}
