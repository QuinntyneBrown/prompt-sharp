import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-tutorial-card',
  templateUrl: './tutorial-card.html',
  styleUrl: './tutorial-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialCard {
  readonly title = input.required<string>();
  readonly slug = input.required<string>();
  readonly summary = input<string | null>(null);
  readonly selected = output<void>();
}
