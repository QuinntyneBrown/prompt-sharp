import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-admin-taxonomy-row',
  templateUrl: './admin-taxonomy-row.html',
  styleUrl: './admin-taxonomy-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTaxonomyRow {
  readonly edit = output<void>();
  readonly remove = output<void>();
}
