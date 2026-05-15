import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Stat } from 'components';

@Component({
  selector: 'ps-admin-kpi-card',
  templateUrl: './admin-kpi-card.html',
  styleUrl: './admin-kpi-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Stat],
})
export class AdminKpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly supportingLabel = input<string | null>(null);
}
