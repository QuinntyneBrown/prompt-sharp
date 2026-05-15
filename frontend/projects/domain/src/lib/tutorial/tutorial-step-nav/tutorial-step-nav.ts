import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-tutorial-step-nav',
  templateUrl: './tutorial-step-nav.html',
  styleUrl: './tutorial-step-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialStepNav {
  readonly next = output<void>();
  readonly previous = output<void>();
}
