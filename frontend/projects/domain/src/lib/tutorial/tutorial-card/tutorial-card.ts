import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DifficultyLevel } from 'api';
import { DifficultyBadge, Eyebrow, Mono } from 'components';

@Component({
  selector: 'ps-tutorial-card',
  templateUrl: './tutorial-card.html',
  styleUrl: './tutorial-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DifficultyBadge, Eyebrow, Mono],
})
export class TutorialCard {
  readonly title = input.required<string>();
  readonly slug = input.required<string>();
  readonly summary = input<string | null>(null);
  readonly categoryName = input<string | null>(null);
  readonly difficulty = input<DifficultyLevel | null>(null);
  readonly estimatedMinutes = input<number | null>(null);

  readonly selected = output<void>();
}
