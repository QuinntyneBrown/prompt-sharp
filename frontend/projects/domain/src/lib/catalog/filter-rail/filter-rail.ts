import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-filter-rail',
  templateUrl: './filter-rail.html',
  styleUrl: './filter-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterRail {
  readonly filtersChanged = output<Record<string, unknown>>();
}
