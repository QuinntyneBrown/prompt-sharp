import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button } from 'components';

@Component({
  selector: 'ps-tutorial-step-nav',
  templateUrl: './tutorial-step-nav.html',
  styleUrl: './tutorial-step-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
})
export class TutorialStepNav {
  readonly next = output<void>();
  readonly previous = output<void>();
}
