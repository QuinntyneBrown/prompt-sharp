import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-admin-kpi-card',
  templateUrl: './admin-kpi-card.html',
  styleUrl: './admin-kpi-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminKpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
}
