import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

@Component({
  selector: 'lib-difficulty-badge',
  templateUrl: './difficulty-badge.html',
  styleUrl: './difficulty-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-level]': 'level()',
  },
})
export class DifficultyBadge {
  readonly level = input.required<DifficultyLevel>();

  protected readonly label = computed(() => this.level().toUpperCase());
}
