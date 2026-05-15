import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-admin-filter-chips',
  templateUrl: './admin-filter-chips.html',
  styleUrl: './admin-filter-chips.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFilterChips {
  readonly filtersChanged = output<string[]>();
}
