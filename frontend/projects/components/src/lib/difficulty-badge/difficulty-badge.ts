import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DifficultyBadgeDensity } from './difficulty-badge-density';
import { DifficultyLevel } from './difficulty-level';

@Component({
  selector: 'lib-difficulty-badge',
  templateUrl: './difficulty-badge.html',
  styleUrl: './difficulty-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-level]': 'level()',
    '[attr.data-density]': 'density()',
  },
})
export class DifficultyBadge {
  readonly level = input.required<DifficultyLevel>();
  readonly density = input<DifficultyBadgeDensity>('default');

  protected readonly label = computed(() => this.level().toUpperCase());
}
